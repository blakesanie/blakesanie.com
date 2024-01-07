const powerCanvas = document.getElementById("powerChart");

// const data = [
//   { year: 2010, count: 10 },
//   { year: 2011, count: 20 },
//   { year: 2012, count: 15 },
//   { year: 2013, count: 25 },
//   { year: 2014, count: 22 },
//   { year: 2015, count: 30 },
//   { year: 2016, count: 28 },
// ];
Chart.defaults.font.family = "Plus Jakarta Sans";

const powerChart = new Chart(powerCanvas, {
  type: "line",
  options: {
    scales: {
      x: {
        ticks: {
          callback: function (value, index, ticks) {
            const out = (ticks.length - (index + 1)) / fps;
            if (out % 1 < 0.0000001) {
              return Math.round(-out) + "s";
            }
          },
        },
        title: {
          text: "History (s)",
          display: true,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          text: "Power Saved (W)",
          display: true,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          text: "Force Saved (N)",
          display: true,
        },
      },
    },
    plugins: {
      animation: true,
      legend: {
        display: false,
      },
    },
  },
  data: {
    labels: [0, 0],
    datasets: [
      {
        label: "Power Savings",
        data: [0, 0],
        pointStyle: false,
        yAxisID: "y",
        xAxisID: "x",
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      },
      {
        label: "Force Savings",
        data: [0, 0],
        pointStyle: false,
        yAxisID: "y1",
        xAxisID: "x",
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      },
    ],
  },
});

window.updateCharts = function () {
  console.log("chart update", window.powerSavings);
  const newPower = [...window.powerSavings];
  const newForce = [...window.forceSavings];
  powerChart.data.labels = newPower;
  powerChart.data.datasets[0].data = newPower;
  powerChart.data.datasets[1].data = newForce;
  //   data.power = makePowerData();
  powerChart.update();
};

// setInterval(() => {
//   console.log("chart update", window.powerSavings);
//   powerChart.data.labels = makeLabels();
//   //   powerChart.data.datasets[0].data
//   data.power = makePowerData();
//   powerChart.update();
// }, 4000);
