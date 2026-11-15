/* =====================================================================
   Prediksi Kepuasan Penumpang Maskapai - Logika antarmuka
   Bagian: konfigurasi, navigasi, form, prediksi, performa model,
           eksplorasi data, panduan.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Konfigurasi dan data statis ---------- */
  var NAMA = {
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
    "Arrival Delay in Minutes": "Keterlambatan kedatangan"
  };

  var LAYANAN = [
    "Inflight wifi service", "Departure/Arrival time convenient", "Ease of Online booking",
    "Gate location", "Food and drink", "Online boarding", "Seat comfort",
    "Inflight entertainment", "On-board service", "Leg room service", "Baggage handling",
    "Checkin service", "Inflight service", "Cleanliness"
  ];

  var LABEL_SKOR = { 0: "Tidak berlaku", 1: "Sangat buruk", 2: "Buruk", 3: "Cukup", 4: "Baik", 5: "Sangat baik" };

  var STEP_FIELDS = [
    [
      { k: "Gender", type: "select", label: "Jenis kelamin",
        opts: [["Female", "Perempuan"], ["Male", "Laki-laki"]],
        hint: "Jenis kelamin penumpang." },
      { k: "Customer Type", type: "select", label: "Tipe pelanggan",
        opts: [["Loyal Customer", "Pelanggan loyal"], ["disloyal Customer", "Pelanggan tidak loyal"]],
        hint: "Pelanggan loyal adalah penumpang yang rutin terbang dengan maskapai ini." },
      { k: "Age", type: "number", label: "Usia (tahun)", min: 1, max: 120,
        hint: "Isi antara 1 sampai 120. Contoh: 35." },
      { k: "Type of Travel", type: "select", label: "Tipe perjalanan",
        opts: [["Business travel", "Perjalanan bisnis"], ["Personal Travel", "Perjalanan pribadi"]],
        hint: "Tujuan utama perjalanan penumpang." }
    ],
    [
      { k: "Class", type: "select", label: "Kelas penerbangan",
        opts: [["Eco", "Ekonomi"], ["Eco Plus", "Ekonomi Plus"], ["Business", "Bisnis"]],
        hint: "Kelas kabin yang dipesan." },
      { k: "Flight Distance", type: "number", label: "Jarak penerbangan (mil)", min: 1, max: 20000,
        hint: "Jarak antara bandara asal dan tujuan. Contoh: 1000." },
      { k: "Departure Delay in Minutes", type: "number", label: "Keterlambatan keberangkatan (menit)", min: 0, max: 5000,
        hint: "Isi 0 jika berangkat tepat waktu." },
      { k: "Arrival Delay in Minutes", type: "number", label: "Keterlambatan kedatangan (menit)", min: 0, max: 5000,
        hint: "Isi 0 jika tiba tepat waktu." }
    ]
  ];

  var DEFAULTS = {
    "Gender": "Female", "Customer Type": "Loyal Customer", "Age": 35, "Type of Travel": "Business travel",
    "Class": "Eco", "Flight Distance": 1000, "Departure Delay in Minutes": 0, "Arrival Delay in Minutes": 0
  };
  LAYANAN.forEach(function (k) { DEFAULTS[k] = 3; });

  var CONTOH_PUAS = {
    "Gender": "Female", "Customer Type": "Loyal Customer", "Age": 42, "Type of Travel": "Business travel",
    "Class": "Business", "Flight Distance": 2200, "Departure Delay in Minutes": 0, "Arrival Delay in Minutes": 0,
    "Inflight wifi service": 4, "Departure/Arrival time convenient": 4, "Ease of Online booking": 4,
    "Gate location": 3, "Food and drink": 4, "Online boarding": 5, "Seat comfort": 5,
    "Inflight entertainment": 5, "On-board service": 5, "Leg room service": 5, "Baggage handling": 5,
    "Checkin service": 4, "Inflight service": 5, "Cleanliness": 5
  };

  var CONTOH_TIDAK = {
    "Gender": "Male", "Customer Type": "disloyal Customer", "Age": 24, "Type of Travel": "Personal Travel",
    "Class": "Eco", "Flight Distance": 450, "Departure Delay in Minutes": 40, "Arrival Delay in Minutes": 55,
    "Inflight wifi service": 2, "Departure/Arrival time convenient": 2, "Ease of Online booking": 2,
    "Gate location": 3, "Food and drink": 2, "Online boarding": 2, "Seat comfort": 2,
    "Inflight entertainment": 2, "On-board service": 2, "Leg room service": 2, "Baggage handling": 3,
    "Checkin service": 3, "Inflight service": 3, "Cleanliness": 2
  };

  var NAMA_OPSI = {
    "Female": "Perempuan", "Male": "Laki-laki",
    "Loyal Customer": "Pelanggan loyal", "disloyal Customer": "Pelanggan tidak loyal",
    "Business travel": "Perjalanan bisnis", "Personal Travel": "Perjalanan pribadi",
    "Eco": "Ekonomi", "Eco Plus": "Ekonomi Plus", "Business": "Bisnis"
  };

  var EDA = [
    { judul: "Distribusi Target", img: "eda_target.png",
      teks: "Dari 103.904 data latih, 56,7% penumpang tidak puas atau netral (58.879) dan 43,3% puas (45.025). Kedua kelas relatif seimbang, sehingga teknik penyeimbangan seperti SMOTE tidak diperlukan." },
    { judul: "Fitur Kategorikal", img: "eda_kategori.png",
      teks: "Penumpang kelas Bisnis paling sering puas (69,4%) dibanding Ekonomi Plus (24,6%) dan Ekonomi (18,6%). Perjalanan bisnis jauh lebih sering puas (58,3%) daripada perjalanan pribadi (10,2%), dan pelanggan loyal (47,7%) lebih sering puas daripada yang tidak loyal (23,7%)." },
    { judul: "Usia dan Jarak", img: "eda_numerik.png",
      teks: "Rata-rata usia penumpang puas 41,8 tahun, sedikit lebih tinggi daripada yang tidak puas (37,6 tahun). Jarak penerbangan median penumpang puas 1.250 mil, hampir dua kali lipat penumpang tidak puas (671 mil)." },
    { judul: "Skor Layanan", img: "eda_layanan.png",
      teks: "Selisih skor terbesar antara penumpang puas dan tidak puas ada pada boarding online (4,03 berbanding 2,66), hiburan di pesawat (3,96 berbanding 2,89), dan kenyamanan kursi. Lokasi gerbang hampir tidak membedakan (2,98 pada kedua kelompok)." },
    { judul: "Korelasi Fitur", img: "eda_korelasi.png",
      teks: "Fitur yang paling berkorelasi dengan kepuasan adalah boarding online (0,50), kelas penerbangan (0,49), dan tipe perjalanan (0,45). Keterlambatan keberangkatan dan kedatangan berkorelasi 0,96, sehingga keduanya membawa informasi yang hampir sama." }
  ];

  var STATE = { step: 0, metrics: null, history: [], values: {} };

  /* ---------- Utilitas ---------- */
  function $(id) { return document.getElementById(id); }
  function pct(x, d) { return (x * 100).toFixed(d === undefined ? 1 : d).replace(".", ",") + "%"; }
  function num(x) { return Number(x).toLocaleString("id-ID"); }
  function dec(x, d) { return Number(x).toFixed(d).replace(".", ","); }

  // Animasi angka naik dari 0 ke nilai akhir
  function countUp(el, target, formatter) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = formatter(target); return; }
    var start = null, dur = 900;
    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var e = 1 - Math.pow(1 - t, 3);
      el.textContent = formatter(target * e);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = formatter(target);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Navigasi tab ---------- */
  function activateTab(name) {
    var ada = false;
    document.querySelectorAll(".tab").forEach(function (t) {
      var on = t.id === name;
      if (on) ada = true;
      t.classList.toggle("active", on);
    });
    if (!ada) { name = "beranda"; $("beranda").classList.add("active"); }
    document.querySelectorAll(".tab-btn").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-tab") === name);
    });
    return name;
  }

  function showTab(name) {
    name = activateTab(name);
    if (location.hash !== "#" + name) { history.replaceState(null, "", "#" + name); }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".tab-btn").forEach(function (b) {
    b.addEventListener("click", function () { showTab(b.getAttribute("data-tab")); });
  });
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.addEventListener("click", function () { showTab(b.getAttribute("data-go")); });
  });
  window.addEventListener("hashchange", function () { activateTab(location.hash.replace("#", "")); });

  /* ---------- Form prediksi ---------- */
  function buildForm() {
    STEP_FIELDS.forEach(function (fields, i) {
      var html = "";
      fields.forEach(function (f) {
        var id = "f-" + i + "-" + f.k.replace(/\W/g, "");
        html += '<div class="field">';
        html += '<label for="' + id + '">' + f.label + "</label>";
        if (f.type === "select") {
          html += '<select id="' + id + '" data-key="' + f.k + '">';
          f.opts.forEach(function (o) { html += '<option value="' + o[0] + '">' + o[1] + "</option>"; });
          html += "</select>";
        } else {
          html += '<input type="number" id="' + id + '" data-key="' + f.k + '" min="' + f.min + '" max="' + f.max + '" step="1" inputmode="numeric">';
        }
        html += '<div class="hint">' + f.hint + "</div>";
        html += '<div class="err" data-err="' + f.k + '"></div>';
        html += "</div>";
      });
      $("step" + i).innerHTML = html;
    });

    var rows = "";
    LAYANAN.forEach(function (k) {
      rows += '<div class="rate-row" data-rate="' + k + '">';
      rows += '<div class="rate-head"><span class="nm">' + NAMA[k] + '</span><span class="cur" data-cur="' + k + '"></span></div>';
      rows += '<div class="seg" role="group" aria-label="' + NAMA[k] + '">';
      rows += '<button type="button" class="na" data-v="0">N/A</button>';
      for (var v = 1; v <= 5; v++) { rows += '<button type="button" data-v="' + v + '">' + v + "</button>"; }
      rows += "</div></div>";
    });
    $("rating-list").innerHTML = rows;

    document.querySelectorAll(".rate-row .seg button").forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.closest(".rate-row").getAttribute("data-rate");
        setRating(k, parseInt(b.getAttribute("data-v"), 10));
      });
    });
  }

  function setRating(k, v) {
    STATE.values[k] = v;
    var row = document.querySelector('.rate-row[data-rate="' + k + '"]');
    row.querySelectorAll("button").forEach(function (b) {
      var on = parseInt(b.getAttribute("data-v"), 10) === v;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    row.querySelector("[data-cur]").textContent = v === 0 ? "Tidak berlaku" : v + " dari 5 (" + LABEL_SKOR[v] + ")";
  }

  function fillForm(obj) {
    STATE.values = {};
    Object.keys(obj).forEach(function (k) {
      if (LAYANAN.indexOf(k) >= 0) {
        setRating(k, obj[k]);
      } else {
        STATE.values[k] = obj[k];
        var el = document.querySelector('[data-key="' + k + '"]');
        if (el) el.value = obj[k];
      }
    });
    document.querySelectorAll(".err").forEach(function (e) { e.textContent = ""; });
    document.querySelectorAll(".field input").forEach(function (e) { e.classList.remove("invalid"); });
  }

  function readForm() {
    var data = {};
    document.querySelectorAll("[data-key]").forEach(function (el) {
      data[el.getAttribute("data-key")] = el.value;
    });
    LAYANAN.forEach(function (k) { data[k] = STATE.values[k]; });
    return data;
  }

  function validateStep(i) {
    var ok = true;
    if (i > 1) return true;
    STEP_FIELDS[i].forEach(function (f) {
      if (f.type !== "number") return;
      var el = document.querySelector('[data-key="' + f.k + '"]');
      var err = document.querySelector('[data-err="' + f.k + '"]');
      var raw = el.value.trim();
      var n = Number(raw);
      var msg = "";
      if (raw === "" || isNaN(n)) msg = "Wajib diisi dengan angka.";
      else if (n < f.min || n > f.max) msg = "Isi antara " + f.min + " dan " + f.max + ".";
      err.textContent = msg;
      el.classList.toggle("invalid", msg !== "");
      if (msg) ok = false;
    });
    return ok;
  }

  function goStep(i) {
    STATE.step = i;
    for (var s = 0; s < 3; s++) { $("step" + s).classList.toggle("active", s === i); }
    document.querySelectorAll("#pills .pill").forEach(function (p) {
      var s = parseInt(p.getAttribute("data-step"), 10);
      p.classList.toggle("active", s === i);
      p.classList.toggle("done", s < i);
    });
    $("progress-bar").style.width = ((i + 1) / 3 * 100) + "%";
    $("btn-back").style.visibility = i === 0 ? "hidden" : "visible";
    $("btn-next").textContent = i === 2 ? "Prediksi" : "Lanjut";
  }

  document.querySelectorAll("#pills .pill").forEach(function (p) {
    p.addEventListener("click", function () {
      var target = parseInt(p.getAttribute("data-step"), 10);
      for (var s = 0; s < target; s++) {
        if (!validateStep(s)) { goStep(s); return; }
      }
      goStep(target);
    });
  });

  $("btn-back").addEventListener("click", function () { if (STATE.step > 0) goStep(STATE.step - 1); });
  $("btn-next").addEventListener("click", function () {
    if (STATE.step < 2) {
      if (validateStep(STATE.step)) goStep(STATE.step + 1);
    } else {
      submitPrediction();
    }
  });
  $("btn-reset").addEventListener("click", function () { fillForm(DEFAULTS); goStep(0); resetResult(); });
  $("ex-puas").addEventListener("click", function () { fillForm(CONTOH_PUAS); goStep(0); });
  $("ex-tidak").addEventListener("click", function () { fillForm(CONTOH_TIDAK); goStep(0); });

  /* ---------- Prediksi dan hasil ---------- */
  function resetResult() {
    $("result-empty").style.display = "block";
    $("result-body").style.display = "none";
    $("result-body").innerHTML = "";
  }

  function submitPrediction() {
    for (var s = 0; s < 2; s++) {
      if (!validateStep(s)) { goStep(s); return; }
    }
    var data = readForm();
    var btn = $("btn-next");
    btn.disabled = true;
    btn.textContent = "Memproses...";

    fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok) { showError(res.body.error || "Terjadi kesalahan saat memproses data."); return; }
        showResult(res.body, data);
      })
      .catch(function () { showError("Tidak dapat terhubung ke server. Coba lagi."); })
      .then(function () { btn.disabled = false; btn.textContent = "Prediksi"; });
  }

  function showError(msg) {
    $("result-empty").style.display = "none";
    var b = $("result-body");
    b.style.display = "block";
    b.innerHTML = '<div class="errbox">' + msg + "</div>";
  }

  function factorList(items, cls, max) {
    if (!items.length) return '<p class="muted small">Tidak ada faktor yang menonjol.</p>';
    var h = "";
    items.forEach(function (f) {
      var w = Math.max(6, Math.round(Math.abs(f.nilai) / max * 100));
      var tanda = f.nilai > 0 ? "+" : "-";
      h += '<div class="factor ' + cls + '"><div class="row"><span>' + f.nama + "</span><span>" +
        tanda + dec(Math.abs(f.nilai), 2) + '</span></div><div class="bar"><i style="width:' + w + '%"></i></div></div>';
    });
    return h;
  }

  function pctRing(p) {
    var v = p * 100;
    if (v > 0 && v < 1) return "<1%";
    if (v > 99 && v < 100) return ">99%";
    return pct(p, 0);
  }

  function ringSvg(p, puas) {
    var r = 54, c = 2 * Math.PI * r;
    return '<svg class="ring" viewBox="0 0 140 140" role="img" aria-label="Peluang puas ' + pct(p, 0) + '">' +
      '<circle class="ring-bg" cx="70" cy="70" r="' + r + '"></circle>' +
      '<circle class="ring-fg ' + (puas ? "puas" : "tidak") + '" cx="70" cy="70" r="' + r + '" transform="rotate(-90 70 70)" ' +
      'stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + c.toFixed(2) + '" data-off="' + (c * (1 - p)).toFixed(2) + '"></circle>' +
      '<text class="ring-num" x="70" y="72" text-anchor="middle">' + pctRing(p) + "</text>" +
      '<text class="ring-cap" x="70" y="90" text-anchor="middle">peluang puas</text></svg>';
  }

  function keyakinan(p) {
    var k = Math.abs(p - 0.5) * 2;
    if (k >= 0.7) return "Tinggi";
    if (k >= 0.3) return "Sedang";
    return "Rendah (dekat ambang batas)";
  }

  function showResult(r, data) {
    $("result-empty").style.display = "none";
    var b = $("result-body");
    b.style.display = "block";
    var puas = r.label === "Puas";
    var pp = r.prob_puas;
    var max = 0.0001;
    r.pendorong.concat(r.penekan).forEach(function (f) { max = Math.max(max, Math.abs(f.nilai)); });

    b.innerHTML =
      '<div class="result-top">' + ringSvg(pp, puas) +
        "<div>" +
          '<span class="badge ' + (puas ? "puas" : "tidak") + '">Hasil prediksi</span>' +
          '<div class="res-label ' + (puas ? "puas" : "tidak") + '">' + (puas ? "Puas" : "Tidak Puas") + "</div>" +
          '<span class="badge info">Keyakinan model: ' + keyakinan(pp) + "</span>" +
        "</div>" +
      "</div>" +
      '<p class="muted small" style="margin-top:12px;">Probabilitas puas <b>' + pct(pp) + "</b> dan tidak puas <b>" +
        pct(r.prob_tidak_puas) + "</b>. Prediksi Puas diberikan jika probabilitas puas 50% atau lebih.</p>" +
      '<h4 style="margin-top:14px;">Faktor yang menaikkan peluang puas</h4>' + factorList(r.pendorong, "up", max) +
      '<h4 style="margin-top:14px;">Faktor yang menurunkan peluang puas</h4>' + factorList(r.penekan, "down", max) +
      '<p class="muted small" style="margin-top:8px;">Angka adalah kontribusi pada skor model dibanding penumpang rata-rata.</p>' +
      '<div class="reco"><b>Rekomendasi:</b> ' + r.rekomendasi + "</div>";

    var ring = b.querySelector(".ring-fg");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { ring.style.strokeDashoffset = ring.getAttribute("data-off"); });
    });

    if (window.innerWidth <= 960) {
      $("result-card").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    STATE.history.unshift({
      kelas: NAMA_OPSI[data["Class"]] || data["Class"],
      perjalanan: NAMA_OPSI[data["Type of Travel"]] || data["Type of Travel"],
      usia: data["Age"],
      label: r.label,
      prob: pp
    });
    if (STATE.history.length > 10) STATE.history.pop();
    renderHistory();
  }

  function renderHistory() {
    var box = $("history");
    if (!STATE.history.length) {
      box.innerHTML = '<p class="muted">Belum ada prediksi. Hasil prediksi Anda akan tercatat di sini.</p>';
      return;
    }
    var h = '<div class="table-wrap"><table><tr><th>No</th><th>Kelas</th><th>Tipe perjalanan</th><th>Usia</th><th>Prediksi</th><th>Probabilitas puas</th></tr>';
    var total = STATE.history.length;
    STATE.history.forEach(function (x, i) {
      h += "<tr><td>" + (total - i) + "</td><td>" + x.kelas + "</td><td>" + x.perjalanan + "</td><td>" + x.usia +
        '</td><td><span class="badge ' + (x.label === "Puas" ? "puas" : "tidak") + '">' + x.label + "</span></td><td>" + pct(x.prob) + "</td></tr>";
    });
    box.innerHTML = h + "</table></div>";
  }
  $("btn-clear").addEventListener("click", function () { STATE.history = []; renderHistory(); });

  /* ---------- Performa model ---------- */
  function renderHomeMetrics(m) {
    var vals = [m.accuracy, m.precision, m.recall, m.f1, m.auc];
    document.querySelectorAll("#home-metrics .val").forEach(function (el, i) {
      countUp(el, vals[i], function (v) { return i === 4 ? dec(v, 3) : pct(v); });
    });
    $("home-data").textContent = "Data latih: " + num(m.n_train) + " penumpang. Data uji: " + num(m.n_test) + " penumpang.";
    countUp($("hs-train"), m.n_train, function (v) { return num(Math.round(v)); });
    $("hs-fitur").textContent = String(m.fitur_urut.length);
    countUp($("hs-auc"), m.auc, function (v) { return dec(v, 3); });
  }

  function renderPerfMetrics(m) {
    var items = [
      ["Accuracy", pct(m.accuracy), "Persentase seluruh prediksi yang benar."],
      ["Precision", pct(m.precision), "Dari yang diprediksi puas, yang benar-benar puas."],
      ["Recall", pct(m.recall), "Dari yang sebenarnya puas, yang berhasil dikenali."],
      ["F1-Score", pct(m.f1), "Keseimbangan Precision dan Recall."],
      ["AUC", dec(m.auc, 3), "Kemampuan membedakan dua kelas."]
    ];
    var h = "";
    items.forEach(function (x) {
      h += '<div class="card metric"><div class="lbl">' + x[0] + '</div><div class="val">' + x[1] + '</div><div class="desc">' + x[2] + "</div></div>";
    });
    $("perf-metrics").innerHTML = h;
  }

  function renderCM(m) {
    var c = m.confusion;
    $("cm").innerHTML =
      '<div></div><div class="hd">Prediksi: Tidak Puas</div><div class="hd">Prediksi: Puas</div>' +
      '<div class="hd">Aktual: Tidak Puas</div>' +
      '<div class="cell ok"><div class="t">True Negative (TN)</div><div class="n">' + num(c.tn) + '</div><div class="d">Tidak puas, diprediksi tidak puas</div></div>' +
      '<div class="cell no"><div class="t">False Positive (FP)</div><div class="n">' + num(c.fp) + '</div><div class="d">Tidak puas, diprediksi puas</div></div>' +
      '<div class="hd">Aktual: Puas</div>' +
      '<div class="cell no"><div class="t">False Negative (FN)</div><div class="n">' + num(c.fn) + '</div><div class="d">Puas, diprediksi tidak puas</div></div>' +
      '<div class="cell ok"><div class="t">True Positive (TP)</div><div class="n">' + num(c.tp) + '</div><div class="d">Puas, diprediksi puas</div></div>';
    $("cm-note").innerHTML =
      "False Positive berarti maskapai mengira penumpang puas padahal tidak, sehingga kesempatan memperbaiki layanan terlewat. " +
      "False Negative berarti penumpang puas dikira tidak puas, dan dampaknya hanya biaya tindak lanjut yang sebenarnya tidak diperlukan.";
  }

  function renderROC(m) {
    var W = 360, H = 320, L = 46, R = 14, T = 12, B = 42;
    var pw = W - L - R, ph = H - T - B;
    function x(v) { return L + v * pw; }
    function y(v) { return T + (1 - v) * ph; }
    var d = "";
    m.roc.fpr.forEach(function (f, i) { d += (i === 0 ? "M" : "L") + x(f).toFixed(1) + " " + y(m.roc.tpr[i]).toFixed(1) + " "; });
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" role="img" aria-label="Kurva ROC">';
    for (var g = 0; g <= 5; g++) {
      var v = g / 5;
      svg += '<line x1="' + x(0) + '" y1="' + y(v) + '" x2="' + x(1) + '" y2="' + y(v) + '" stroke="#e2e8f0"/>';
      svg += '<line x1="' + x(v) + '" y1="' + y(0) + '" x2="' + x(v) + '" y2="' + y(1) + '" stroke="#e2e8f0"/>';
      svg += '<text x="' + (L - 8) + '" y="' + (y(v) + 4) + '" font-size="10" text-anchor="end">' + dec(v, 1) + "</text>";
      svg += '<text x="' + x(v) + '" y="' + (y(0) + 16) + '" font-size="10" text-anchor="middle">' + dec(v, 1) + "</text>";
    }
    svg += '<line x1="' + x(0) + '" y1="' + y(0) + '" x2="' + x(1) + '" y2="' + y(1) + '" stroke="#94a3b8" stroke-dasharray="5 4"/>';
    svg += '<path d="' + d + ' L' + x(1) + " " + y(0) + ' Z" fill="rgba(37,99,235,0.10)" stroke="none"/>';
    svg += '<path d="' + d + '" fill="none" stroke="#1d4ed8" stroke-width="2.6"/>';
    svg += '<text x="' + (L + pw / 2) + '" y="' + (H - 6) + '" font-size="11" text-anchor="middle">False Positive Rate (FPR)</text>';
    svg += '<text transform="rotate(-90)" x="' + (-(T + ph / 2)) + '" y="12" font-size="11" text-anchor="middle">True Positive Rate (TPR)</text>';
    svg += '<text x="' + x(0.98) + '" y="' + y(0.12) + '" font-size="12" text-anchor="end" font-weight="700">AUC = ' + dec(m.auc, 3) + "</text>";
    svg += '<text x="' + x(0.98) + '" y="' + y(0.05) + '" font-size="10" text-anchor="end">Garis putus-putus: tebakan acak</text>';
    svg += "</svg>";
    $("roc").innerHTML = svg;
  }

  function renderThreshold(m) {
    var slider = $("thr");
    function update() {
      var t = parseFloat(slider.value);
      var row = m.threshold.filter(function (r) { return Math.abs(r.threshold - t) < 0.001; })[0];
      if (!row) return;
      $("thr-val").textContent = dec(t, 2);
      var spec = row.tn / (row.tn + row.fp);
      $("thr-out").innerHTML =
        '<div><span class="small muted">Precision</span><b>' + pct(row.precision) + "</b></div>" +
        '<div><span class="small muted">Recall</span><b>' + pct(row.recall) + "</b></div>" +
        '<div><span class="small muted">F1-Score</span><b>' + pct(row.f1) + "</b></div>" +
        '<div><span class="small muted">Accuracy</span><b>' + pct(row.accuracy) + "</b></div>" +
        '<div><span class="small muted">False Positive</span><b>' + num(row.fp) + "</b></div>" +
        '<div><span class="small muted">False Negative</span><b>' + num(row.fn) + "</b></div>" +
        '<div><span class="small muted">True Positive</span><b>' + num(row.tp) + "</b></div>" +
        '<div><span class="small muted">Penumpang tidak puas yang terdeteksi</span><b>' + pct(spec) + "</b></div>";
      var catatan;
      if (t < 0.5) catatan = "Ambang batas rendah: model lebih mudah menyebut Puas. Recall naik, tetapi lebih banyak penumpang tidak puas terlewat (False Positive bertambah).";
      else if (t > 0.5) catatan = "Ambang batas tinggi: model lebih berhati-hati menyebut Puas. Precision naik dan penumpang tidak puas lebih banyak terdeteksi, tetapi lebih banyak penumpang puas dianggap tidak puas.";
      else catatan = "Ambang batas standar 0,50 yang dipakai aplikasi ini.";
      $("thr-note").textContent = catatan;
    }
    slider.addEventListener("input", update);
    update();
  }

  function renderCoef(m) {
    var list = m.koefisien.slice().sort(function (a, b) { return b.koefisien - a.koefisien; });
    var max = 0;
    list.forEach(function (k) { max = Math.max(max, Math.abs(k.koefisien)); });
    var h = '<div class="coefrow head"><span>Fitur</span><span></span><span>Koefisien</span><span>Odds ratio</span></div>';
    list.forEach(function (k) {
      var w = Math.abs(k.koefisien) / max * 50;
      var style = k.koefisien >= 0
        ? "left:50%;width:" + w + "%;background:#1d4ed8;"
        : "left:" + (50 - w) + "%;width:" + w + "%;background:#38bdf8;";
      h += '<div class="coefrow"><span>' + (NAMA[k.fitur] || k.fitur) + '</span><span class="track"><span class="mid"></span><i style="' + style + '"></i></span><span>' +
        (k.koefisien >= 0 ? "+" : "") + dec(k.koefisien, 2) + "</span><span>" + dec(k.odds_ratio, 2) + "</span></div>";
    });
    $("coef").innerHTML = h;
  }

  function renderSigmoid() {
    var W = 360, H = 240, L = 40, R = 14, T = 14, B = 34;
    var pw = W - L - R, ph = H - T - B;
    function x(z) { return L + (z + 8) / 16 * pw; }
    function y(p) { return T + (1 - p) * ph; }
    var d = "";
    for (var z = -8; z <= 8.001; z += 0.25) {
      var p = 1 / (1 + Math.exp(-z));
      d += (z === -8 ? "M" : "L") + x(z).toFixed(1) + " " + y(p).toFixed(1) + " ";
    }
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" role="img" aria-label="Kurva sigmoid">';
    svg += '<line x1="' + x(-8) + '" y1="' + y(0.5) + '" x2="' + x(8) + '" y2="' + y(0.5) + '" stroke="#94a3b8" stroke-dasharray="5 4"/>';
    svg += '<line x1="' + x(0) + '" y1="' + y(0) + '" x2="' + x(0) + '" y2="' + y(1) + '" stroke="#94a3b8" stroke-dasharray="5 4"/>';
    svg += '<path d="' + d + '" fill="none" stroke="#1d4ed8" stroke-width="2.6"/>';
    [0, 0.5, 1].forEach(function (pp) {
      svg += '<text x="' + (L - 6) + '" y="' + (y(pp) + 4) + '" font-size="10" text-anchor="end">' + dec(pp, 1) + "</text>";
    });
    [-8, -4, 0, 4, 8].forEach(function (zz) {
      svg += '<text x="' + x(zz) + '" y="' + (y(0) + 16) + '" font-size="10" text-anchor="middle">' + zz + "</text>";
    });
    svg += '<text x="' + (L + pw / 2) + '" y="' + (H - 4) + '" font-size="11" text-anchor="middle">Skor linear (z)</text>';
    svg += '<text x="' + x(-7.6) + '" y="' + (y(0.5) - 6) + '" font-size="10">ambang batas 0,5</text>';
    svg += "</svg>";
    $("sigmoid").innerHTML = svg;
  }

  function renderDiscussion(m) {
    var c = m.confusion;
    var spec = c.tn / (c.tn + c.fp);
    $("discussion").innerHTML =
      "<p>Kelas positif model adalah <b>Puas</b>. Bagi maskapai, kesalahan yang paling merugikan adalah <b>False Positive</b>: penumpang tidak puas yang diprediksi puas, karena peluang memperbaiki pengalaman dan mencegah kehilangan pelanggan terlewat.</p>" +
      "<p>Karena itu perhatian utama diberikan pada kemampuan mendeteksi penumpang tidak puas, yaitu <b>" + pct(spec) + "</b> pada ambang batas 0,5 (TN dibagi TN + FP), serta pada <b>Precision</b> kelas Puas (" + pct(m.precision) + ") agar prediksi Puas dapat dipercaya.</p>" +
      "<p class='muted small'>Jika maskapai ingin lebih banyak penumpang tidak puas terdeteksi, ambang batas dapat dinaikkan, dengan konsekuensi lebih banyak tindak lanjut yang sebenarnya tidak diperlukan.</p>";
  }

  function loadMetrics() {
    fetch("/api/metrics")
      .then(function (r) { return r.json(); })
      .then(function (m) {
        STATE.metrics = m;
        renderHomeMetrics(m);
        renderPerfMetrics(m);
        renderCM(m);
        renderROC(m);
        renderThreshold(m);
        renderCoef(m);
        renderSigmoid();
        renderDiscussion(m);
      })
      .catch(function () { $("perf-error").style.display = "block"; renderSigmoid(); });
  }

  /* ---------- Eksplorasi data ---------- */
  function buildEDA() {
    var h = "";
    EDA.forEach(function (e, i) {
      h += '<button type="button" class="pill' + (i === 0 ? " active" : "") + '" data-eda="' + i + '">' + e.judul + "</button>";
    });
    $("eda-tabs").innerHTML = h;
    document.querySelectorAll("[data-eda]").forEach(function (b) {
      b.addEventListener("click", function () { showEDA(parseInt(b.getAttribute("data-eda"), 10)); });
    });
    showEDA(0);
  }

  function showEDA(i) {
    document.querySelectorAll("[data-eda]").forEach(function (b) {
      b.classList.toggle("active", parseInt(b.getAttribute("data-eda"), 10) === i);
    });
    $("eda-img").src = "/static/img/" + EDA[i].img;
    $("eda-img").alt = "Grafik " + EDA[i].judul;
    $("eda-text").textContent = EDA[i].teks;
  }

  /* ---------- Panduan: kamus fitur ---------- */
  function buildFeatureTable() {
    var baris = [
      ["Gender", "Kategorikal", "Perempuan atau laki-laki (Female, Male)."],
      ["Customer Type", "Kategorikal", "Pelanggan loyal atau tidak loyal."],
      ["Age", "Numerik", "Usia penumpang dalam tahun."],
      ["Type of Travel", "Kategorikal", "Perjalanan bisnis atau pribadi."],
      ["Class", "Ordinal", "Ekonomi (0), Ekonomi Plus (1), Bisnis (2)."],
      ["Flight Distance", "Numerik", "Jarak penerbangan dalam mil."]
    ];
    LAYANAN.forEach(function (k) {
      baris.push([k, "Skor 0-5", "Penilaian penumpang terhadap layanan ini. 0 berarti tidak berlaku, 1 sangat buruk, 5 sangat baik."]);
    });
    baris.push(["Departure Delay in Minutes", "Numerik", "Keterlambatan keberangkatan dalam menit."]);
    baris.push(["Arrival Delay in Minutes", "Numerik", "Keterlambatan kedatangan dalam menit."]);

    var h = '<div class="table-wrap"><table><tr><th>Fitur</th><th>Jenis</th><th>Keterangan</th></tr>';
    baris.forEach(function (r) {
      h += "<tr><td><b>" + NAMA[r[0]] + '</b><br><span class="small muted">' + r[0] + '</span></td><td><span class="tag">' + r[1] + "</span></td><td>" + r[2] + "</td></tr>";
    });
    $("fitur-table").innerHTML = h + "</table></div>";
  }

  /* ---------- Inisialisasi ---------- */
  buildForm();
  fillForm(DEFAULTS);
  goStep(0);
  renderHistory();
  buildEDA();
  buildFeatureTable();
  loadMetrics();
  activateTab(location.hash.replace("#", "") || "beranda");
})();