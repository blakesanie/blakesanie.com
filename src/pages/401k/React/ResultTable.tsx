import type { BreakdownPlotProps } from "./BreakdownPlot";
import React from "react";

function hundredths(num: number) {
  return Math.round(num * 100) / 100;
}

const ResultTable: React.FC<BreakdownPlotProps> = ({ result }) => {
  // if (!result) return null
  return (
    <table>
      <thead>
        <tr>
          <th>Pay Period</th>
          <th>Contribution</th>
          <th>Contribution YTD</th>
          <th>Match</th>
          <th>Match YTD</th>
          <th>Growth</th>
          <th>Worth</th>
        </tr>
      </thead>
      <tbody>
        {result.map((row, i) => {
          return (
            <tr>
              <td>{i + 1}</td>
              <td>{hundredths(row.contribution)}</td>
              <td>{hundredths(row.YTDContribution)}</td>
              <td>{hundredths(row.match)}</td>
              <td>{hundredths(row.YTDMatch)}</td>
              <td>{hundredths(row.growth)}</td>
              <td>{hundredths(row.worth)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ResultTable;
