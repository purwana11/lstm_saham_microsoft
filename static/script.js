/* global Chart */
document.addEventListener("DOMContentLoaded", function () {
    const fillBtn = document.getElementById("fillExample");
    const latestBtn = document.getElementById("useLatest");
    const inputField = document.getElementById("prices");
  
    // Tombol isi contoh otomatis
    fillBtn.addEventListener("click", () => {
      inputField.value = "312.5, 310.8, 311.4, 313.0, 314.2";
      fillBtn.innerHTML = "✅ Contoh Terisi";
      setTimeout(() => (fillBtn.innerHTML = "Gunakan Contoh"), 1500);
    });
  
    // Tombol ambil harga terbaru dari tabel
    latestBtn.addEventListener("click", () => {
      const rows = document.querySelectorAll("tbody tr");
      const closeValues = [];
      rows.forEach((row, i) => {
        if (i < 5) {
          const close = parseFloat(row.children[4].innerText);
          closeValues.push(close);
        }
      });
      inputField.value = closeValues.reverse().join(", ");
      latestBtn.innerHTML = "✅ Harga Terbaru Diambil";
      setTimeout(() => (latestBtn.innerHTML = "Gunakan Harga Terbaru"), 2000);
    });
  
    // === CHART.JS ===
    const chartDataTag = document.getElementById("chart-data");
    if (chartDataTag) {
      const chartData = JSON.parse(chartDataTag.textContent);
      const ctx = document.getElementById("stockChart").getContext("2d");
  
      const labels = chartData.map((item) => item.Date);
      const closePrices = chartData.map((item) => item.Close);
  
      // Buat Chart
      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Harga Penutupan (Close)",
              data: closePrices,
              borderColor: "#00e0ff",
              backgroundColor: "rgba(0, 224, 255, 0.2)",
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.2,
              fill: true,
              cubicInterpolationMode: "monotone",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // biar tinggi menyesuaikan container
          plugins: {
            legend: {
              display: true,
              labels: { color: "#fff" },
            },
            title: {
              display: true,
              text: "Microsoft - Closing Price Over Time",
              color: "#fff",
              font: { size: 18, family: "Poppins" },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(0,0,0,0.7)",
              titleColor: "#00e0ff",
              bodyColor: "#fff",
              borderWidth: 1,
              borderColor: "#00e0ff",
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
          animation: {
            duration: 1500,
            easing: "easeInOutQuart",
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Tanggal",
                color: "#ccc",
                font: { size: 14 },
              },
              ticks: {
                color: "#ccc",
                maxRotation: 45,
                minRotation: 45,
                autoSkip: true,
                maxTicksLimit: 10,
              },
              grid: { color: "rgba(255,255,255,0.15)" },
            },
            y: {
              title: {
                display: true,
                text: "Harga Penutupan (USD)",
                color: "#ccc",
                font: { size: 14 },
              },
              ticks: {
                color: "#ccc",
                callback: function (value) {
                  return "$" + value;
                },
              },
              grid: { color: "rgba(255,255,255,0.15)" },
              beginAtZero: false,
              suggestedMin: 50, // menyesuaikan range harga saham Microsoft
              suggestedMax: 400,
            },
          },
        },
      });
    }
  });
  