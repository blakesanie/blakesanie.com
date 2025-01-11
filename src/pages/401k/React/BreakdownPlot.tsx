import React, { useEffect, useRef } from "react";
import type { SimulationResult } from "./simulation";

export interface BreakdownPlotProps {
  result: SimulationResult[];
}

//
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend,
//   LogarithmicScale,
// );

// const labels = ["January", "February", "March", "April", "May", "June", "July"];
//
// const data = {
//   labels,
//   datasets: [
//     {
//       fill: true,
//       label: "Dataset 2",
//       data: labels.map(() => Math.random() * 1000),
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//     },
//   ],
// };

let chart;

const BreakdownPlot: React.FC<BreakdownPlotProps> = ({ result }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    function drawChart() {
      if (!chart) {
        Chart.defaults.font.family = "Assistant";
        chart = new Chart(chartRef.current, {
          type: "line",
          data: {
            labels: [],
            datasets: [
              {
                label: "Prior Contribution",
                data: [],
                borderWidth: 1,
                stack: true,
                fill: "origin",
              },
              {
                label: "Prior Match",
                data: [],
                borderWidth: 1,
                stack: true,
                fill: "-1",
              },
              {
                label: "Contribution",
                data: [],
                borderWidth: 1,
                stack: true,
                fill: "-1",
              },
              {
                label: "Match",
                data: [],
                borderWidth: 1,
                stack: true,
                fill: "-1",
              },
              {
                label: "Growth",
                data: [],
                borderWidth: 1,
                stack: true,
                fill: "-1",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
              point: {
                pointStyle: false,
              },
            },
            interaction: {
              mode: "index",
              intersect: false,
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "401k Equity",
                },
                ticks: {
                  callback: (val) => {
                    return "$" + val.toLocaleString();
                  },
                },
              },
              x: {
                min: 1,
                max: result.length,
                title: {
                  display: true,
                  text: "Pay Period",
                },
              },
            },
          },
        });
      }
      const d1 = result.map((r) => r.YTDContribution - r.contribution);
      const d2 = result.map((r) => r.YTDMatch - r.match);
      const d3 = result.map((r) => r.contribution);
      const d4 = result.map((r) => r.match);
      const d5 = result.map((r) => r.growth);
      const series = [d1, d2, d3, d4, d5];
      debugger;
      if (d1.length > chart.data.labels.length) {
        for (let i = chart.data.labels.length; i < d1.length; i++) {
          chart.data.labels.push(i);
        }
      } else if (d1.length < chart.data.labels.length) {
        for (let i = chart.data.labels.length - 1; i >= d1.length; i--) {
          chart.data.labels.pop();
        }
      }
      for (let i = 0; i < series.length; i++) {
        const s = series[i];
        const datasetData = chart.data.datasets[i].data;
        for (let j = 0; j < s.length; j++) {
          if (j >= datasetData.length) {
            datasetData.push(s[j]);
          } else {
            datasetData[j] = s[j];
          }
        }
        for (let j = datasetData.length - 1; j >= s.length; j--) {
          datasetData.pop();
        }
      }

      chart.update();
    }

    drawChart();
  }, [result, chartRef]);

  return (
    <div style={{ position: "relative", width: "100%", height: 500 }}>
      <canvas ref={chartRef} onMouseMove={(e) => {}}></canvas>
    </div>
  );
};

export default BreakdownPlot;
