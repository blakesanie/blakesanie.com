import React, { useEffect, useRef } from "react";
import type { SimulationResults } from "./simulation";

interface OptimalPlotProps {
  results: SimulationResults;
  onHighlight: (index: number) => void;
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

const OptimalPlot: React.FC<OptimalPlotProps> = ({ results, onHighlight }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chart) {
      chart.destroy();
    }
    Chart.defaults.font.family = "Assistant";
    chart = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: Object.keys(results),
        datasets: [
          {
            label: "Eventual 401k Equity",
            data: Object.values(results).map((r) => r[r.length - 1].worth),
            borderWidth: 1,
            fill: "origin",
          },
        ],
      },
      options: {
        onClick: (e, x) => {
          const out = x[0].index;
          if (!out) return;
          onHighlight(Number(Object.keys(results)[x[0].index]));
        },
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
              text: "EOY 401k Equity",
            },
            ticks: {
              callback: (val) => {
                return "$" + val.toLocaleString();
              },
            },
          },
          x: {
            type: "logarithmic",
            min: Object.keys(results)[0],
            max: Object.keys(results).slice(-1)[0],
            title: {
              display: true,
              text: "Paycheck Contribution",
            },
            ticks: {
              callback: (val) => {
                return "$" + val.toLocaleString();
              },
            },
          },
        },
      },
    });
    // chart.onHover((event, elements) => {
    //   console.log(event, elements);
    // });
  }, [results, chartRef]);

  return (
    <div style={{ position: "relative", width: "100%", height: 500 }}>
      <canvas ref={chartRef} onMouseMove={(e) => {}}></canvas>
    </div>
  );
};

export default OptimalPlot;
