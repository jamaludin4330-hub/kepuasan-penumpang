# Prediksi Kepuasan Penumpang Maskapai Penerbangan Menggunakan Algoritma Logistic Regression

Tugas Akhir 3 (TA-03) Pembelajaran Mesin, Teknik Informatika, Universitas Bale Bandung.

Aplikasi web berbasis Flask yang memprediksi apakah seorang penumpang maskapai
puas atau tidak puas, lengkap dengan probabilitas, faktor penentu, dan rekomendasi.

## Dataset
Airline Passenger Satisfaction (Kaggle): 103.904 data latih dan 25.976 data uji,
22 fitur, target satisfaction (satisfied / neutral or dissatisfied).

## Hasil model (data uji)
Accuracy 87,1%, Precision 86,8%, Recall 83,3%, F1-Score 85,0%, AUC 0,926.

## Struktur
- notebook/    : analisis, pelatihan, dan evaluasi model
- model/       : model.pkl, scaler.pkl, metrics.json
- static/img/  : grafik hasil EDA dan evaluasi
- templates/   : index.html (antarmuka satu halaman)
- app.py       : aplikasi Flask

## Menjalankan secara lokal
1. python -m venv venv
2. venv\Scripts\activate
3. pip install -r requirements.txt
4. python app.py
5. Buka http://127.0.0.1:5000

## Deploy
Start command: gunicorn app:app

## Pembuat
Selsa Shafana Alfiyani (NIM 301240041)