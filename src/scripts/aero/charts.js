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
Chart.defaults.font.family = "Nunito";

const powerColor = "#4EB7FF";
const forceColor = "#FF6E28";
const gridColor = "#ffffff30";
const tickColor = "#ffffff50";
const labelColor = "#ffffff80";

const powerChart = new Chart(powerCanvas, {
  type: "line",
  options: {
    responsive: false,
    maintainAspectRatio: false,
    animations: {
      x: {
        duration: 0,
        easing: "linear",
      },
      y: {
        duration: 0,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value, index, ticks) {
            const out = (ticks.length - (index + 1)) / fps;
            if (out == 0) {
              return "Now";
            }
            if (out % 1 < 0.0000001) {
              return Math.round(-out) + "s";
            }
          },
          color: tickColor,
          font: {
            size: 16,
          },
        },
        grid: {
          color: gridColor,
        },
        title: {
          text: "History (s)",
          display: true,
          color: labelColor,
          font: {
            size: 14,
          },
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          color: gridColor,
          tickColor: gridColor,
        },
        title: {
          text: "Power Saved (W)",
          display: true,
          color: labelColor,
          font: {
            size: 14,
          },
        },
        ticks: {
          color: tickColor,
          font: {
            size: 20,
          },
        },
      },
      y1: {
        type: "linear",
        border: {
          color: gridColor,
        },
        display: true,
        position: "left",
        grid: {
          drawOnChartArea: false,
          color: gridColor,
        },
        title: {
          text: "Force Saved (N)",
          display: true,
          color: labelColor,
          font: {
            size: 14,
          },
        },
        ticks: {
          color: tickColor,
          font: {
            size: 20,
          },
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
    labels: [...window.powerSavings.keys()],
    datasets: [
      {
        label: "Power Savings",
        data: window.powerSavings,
        pointStyle: false,
        yAxisID: "y",
        xAxisID: "x",
        cubicInterpolationMode: "monotone",
        borderColor: powerColor + "90",
        borderWidth: 1,
        order: 2,
      },
      {
        label: "Force Savings",
        data: window.forceSavings,
        pointStyle: false,
        yAxisID: "y1",
        xAxisID: "x",
        cubicInterpolationMode: "monotone",
        borderColor: "transparent",
        borderWidth: 0,
        order: 3,
      },
      {
        label: "Power Savings (Avg.)",
        data: [],
        pointStyle: false,
        yAxisID: "y",
        xAxisID: "x",
        cubicInterpolationMode: "monotone",
        borderColor: powerColor,
        borderWidth: 3,
        order: 1,
      },
    ],
  },
});

function sizeChart() {
  const padding = 0 * 12 * 2;
  const heightAvailableOnScreen =
    window.innerHeight - document.getElementById("cover").clientHeight;
  const chartHeight = Math.max(heightAvailableOnScreen, 180);
  const chartWidth = window.innerWidth; //Math.min(window.innerWidth, 1000);
  powerChart.resize(chartWidth - padding, chartHeight - padding);
}

sizeChart();

window.addEventListener("resize", sizeChart);

window.updateCharts = function () {
  //   console.log("chart update", window.powerSavings);
  //   const newPower = [...window.powerSavings];
  //   const newForce = [...window.forceSavings];
  //   powerChart.data.labels = window.powerSavings; //newPower;
  //   powerChart.data.datasets[0].data = window.powerSavings; //newPower;
  //   powerChart.data.datasets[1].data = window.forceSavings; //newForce;
  //   data.power = makePowerData();
  // debugger;
  powerChart.data.datasets[2].data = window.powerMA
    .map((power, i) => {
      if (!power) {
        return;
      }
      return {
        x: i * window.framesPerChartUpdate,
        y: power,
      };
    })
    .filter((val) => val);
  powerChart.update();
};

// setInterval(() => {
//   console.log("chart update", window.powerSavings);
//   powerChart.data.labels = makeLabels();
//   //   powerChart.data.datasets[0].data
//   data.power = makePowerData();
//   powerChart.update();
// }, 4000);
