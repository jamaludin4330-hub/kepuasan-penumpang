import json
import os

import joblib
import pandas as pd
from flask import Flask, jsonify, render_template, request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

app = Flask(__name__)

# ---------------------------------------------------------------
# Muat model, scaler, dan metrik hasil notebook
# ---------------------------------------------------------------
model = joblib.load(os.path.join(MODEL_DIR, "model.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))

with open(os.path.join(MODEL_DIR, "metrics.json"), encoding="utf-8") as f:
    METRICS = json.load(f)

FITUR = METRICS["fitur_urut"]
NUMERIK = METRICS["kolom_numerik"]
PETA = METRICS["peta"]
KOEF = {k["fitur"]: k["koefisien"] for k in METRICS["koefisien"]}

LAYANAN = [
    "Inflight wifi service", "Departure/Arrival time convenient",
    "Ease of Online booking", "Gate location", "Food and drink",
    "Online boarding", "Seat comfort", "Inflight entertainment",
    "On-board service", "Leg room service", "Baggage handling",
    "Checkin service", "Inflight service", "Cleanliness",
]

NAMA_ID = {
    "Gender": "Jenis kelamin",
    "Customer Type": "Tipe pelanggan",
    "Age": "Usia",
    "Type of Travel": "Tipe perjalanan",
    "Class": "Kelas penerbangan",
    "Flight Distance": "Jarak penerbangan",
    "Inflight wifi service": "Wifi di pesawat",
    "Departure/Arrival time convenient": "Kenyamanan jadwal",
    "Ease of Online booking": "Kemudahan pemesanan online",
    "Gate location": "Lokasi gerbang",
    "Food and drink": "Makanan dan minuman",
    "Online boarding": "Boarding online",
    "Seat comfort": "Kenyamanan kursi",
    "Inflight entertainment": "Hiburan di pesawat",
    "On-board service": "Layanan di pesawat",
    "Leg room service": "Ruang kaki",
    "Baggage handling": "Penanganan bagasi",
    "Checkin service": "Layanan check-in",
    "Inflight service": "Layanan selama penerbangan",
    "Cleanliness": "Kebersihan",
    "Departure Delay in Minutes": "Keterlambatan keberangkatan",
    "Arrival Delay in Minutes": "Keterlambatan kedatangan",
}

# Rata-rata fitur kategorikal pada data latih (setelah encoding).
# Dipakai sebagai pembanding agar kontribusi tiap fitur dihitung
# terhadap penumpang rata-rata. Fitur numerik sudah berpusat di 0
# karena distandarisasi.
RATA_KATEGORIKAL = {
    "Gender": 0.4925,
    "Customer Type": 0.8173,
    "Type of Travel": 0.6896,
    "Class": 1.0281,
}

BATAS = {
    "Age": (1, 120),
    "Flight Distance": (1, 20000),
    "Departure Delay in Minutes": (0, 5000),
    "Arrival Delay in Minutes": (0, 5000),
}


def validasi(data):
    """Mengubah isian pengguna menjadi dict nilai model. Mengembalikan (nilai, pesan_error)."""
    nilai = {}

    for kolom, peta in PETA.items():
        isi = data.get(kolom)
        if isi not in peta:
            return None, f"Pilihan untuk {NAMA_ID[kolom]} tidak valid."
        nilai[kolom] = peta[isi]

    for kolom, (kecil, besar) in BATAS.items():
        try:
            angka = float(data.get(kolom))
        except (TypeError, ValueError):
            return None, f"{NAMA_ID[kolom]} harus berupa angka."
        if angka < kecil or angka > besar:
            return None, f"{NAMA_ID[kolom]} harus antara {kecil} dan {besar}."
        nilai[kolom] = angka

    for kolom in LAYANAN:
        try:
            angka = int(data.get(kolom))
        except (TypeError, ValueError):
            return None, f"Skor {NAMA_ID[kolom]} harus berupa angka 0 sampai 5."
        if angka < 0 or angka > 5:
            return None, f"Skor {NAMA_ID[kolom]} harus antara 0 dan 5."
        nilai[kolom] = angka

    return nilai, None


def buat_rekomendasi(label, nilai, penekan):
    """Rekomendasi sederhana berbasis aturan untuk pihak maskapai."""
    layanan_lemah = [
        k for k in penekan
        if k["fitur"] in LAYANAN and nilai[k["fitur"]] <= 3 and nilai[k["fitur"]] != 0
    ][:3]

    if label == "Puas":
        if layanan_lemah:
            nama = ", ".join(NAMA_ID[k["fitur"]].lower() for k in layanan_lemah)
            return ("Penumpang diprediksi puas. Pertahankan kualitas layanan saat ini, "
                    f"dan perhatikan aspek yang masih bisa ditingkatkan: {nama}.")
        return ("Penumpang diprediksi puas. Pertahankan kualitas layanan saat ini "
                "dan jaga konsistensinya pada penerbangan berikutnya.")

    if layanan_lemah:
        nama = ", ".join(NAMA_ID[k["fitur"]].lower() for k in layanan_lemah)
        return ("Penumpang berisiko tidak puas. Prioritaskan perbaikan pada: "
                f"{nama}. Pertimbangkan tindak lanjut seperti survei singkat "
                "atau penawaran kompensasi.")
    return ("Penumpang berisiko tidak puas, tetapi penyebabnya lebih terkait profil "
            "perjalanan atau keterlambatan. Pertimbangkan komunikasi proaktif "
            "mengenai jadwal dan penawaran yang sesuai segmen penumpang.")


@app.route("/")
def beranda():
    return render_template("index.html")


@app.route("/api/metrics")
def api_metrics():
    return jsonify(METRICS)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Data yang dikirim tidak valid."}), 400

    nilai, pesan = validasi(data)
    if pesan:
        return jsonify({"error": pesan}), 400

    baris = pd.DataFrame([nilai])[FITUR].astype(float)
    baris[NUMERIK] = scaler.transform(baris[NUMERIK])

    prob_puas = float(model.predict_proba(baris)[0, 1])
    label = "Puas" if prob_puas >= 0.5 else "Tidak Puas"

    # Kontribusi tiap fitur terhadap skor (koefisien x selisih dari rata-rata)
    kontribusi = []
    for kolom in FITUR:
        x = float(baris.iloc[0][kolom])
        rata = RATA_KATEGORIKAL.get(kolom, 0.0)
        kontribusi.append({
            "fitur": kolom,
            "nama": NAMA_ID[kolom],
            "nilai": float(KOEF[kolom] * (x - rata)),
        })

    pendorong = sorted([k for k in kontribusi if k["nilai"] > 0],
                       key=lambda k: k["nilai"], reverse=True)[:3]
    penekan = sorted([k for k in kontribusi if k["nilai"] < 0],
                     key=lambda k: k["nilai"])[:5]

    return jsonify({
        "label": label,
        "prob_puas": prob_puas,
        "prob_tidak_puas": 1 - prob_puas,
        "pendorong": pendorong,
        "penekan": penekan[:3],
        "rekomendasi": buat_rekomendasi(label, nilai, penekan),
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")