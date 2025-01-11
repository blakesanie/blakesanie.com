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
      chart.data = {
        labels: result.map((_, i) => i + 1),
        datasets: [
          {
            label: "Prior Contribution",
            data: result.map((r) => r.YTDContribution - r.contribution),
            borderWidth: 1,
            stack: true,
            fill: "origin",
          },
          {
            label: "Prior Match",
            data: result.map((r) => r.YTDMatch - r.match),
            borderWidth: 1,
            stack: true,
            fill: "-1",
          },
          {
            label: "Contribution",
            data: result.map((r) => r.contribution),
            borderWidth: 1,
            stack: true,
            fill: "-1",
          },
          {
            label: "Match",
            data: result.map((r) => r.match),
            borderWidth: 1,
            stack: true,
            fill: "-1",
          },
          {
            label: "Growth",
            data: result.map((r) => r.growth),
            borderWidth: 1,
            stack: true,
            fill: "-1",
          },
        ],
      };
      chart.update("none");
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
