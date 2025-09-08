"use client";

import React from "react";
import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { HeatmapRect } from "@visx/heatmap";
import { AxisBottom, AxisLeft } from "@visx/axis";

type Point = { x: number; y: number; value: number };

type HeatmapProps = {
  values: number[][];
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export default function Heatmap({
  values,
  minX,
  maxX,
  minY,
  maxY,
}: HeatmapProps) {
  const xBins = values[0]?.length ?? 0;
  const yBins = values.length;

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  // Convert matrix to visx-compatible shape
  const data = Array.from({ length: values[0].length }, (_, colIndex) => ({
    row: colIndex,
    bins: values.map((_, rowIndex) => ({
      bin: rowIndex,
      count: values[rowIndex][colIndex],
    })),
  }));

  return (
    <ParentSize>
      {({ width, height }) => {
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const binWidth = innerWidth / xBins;
        const binHeight = innerHeight / yBins;

        const maxValue = Math.max(...values.flat());

        // X-axis: left to right
        const xScale = scaleLinear({
          domain: [0, xBins],
          range: [0, innerWidth],
        });

        // Y-axis: top to bottom (so [0][0] is top-left)
        const yScale = scaleLinear({
          domain: [0, yBins],
          range: [innerHeight, 0],
        });

        const colorScale = scaleLinear<string>({
          domain: [0, maxValue],
          range: ["#fff5f0", "#de2d26"],
          clamp: true,
        });

        console.log(
          "y ticks",
          getTicks(minY, maxY, yBins, 10).map((val) => yBins - val)
        );

        return (
          <svg width={width} height={height}>
            <Group left={margin.left} top={margin.top}>
              <HeatmapRect
                data={data}
                xScale={xScale}
                yScale={yScale}
                binWidth={binWidth}
                binHeight={binHeight}
                gap={2}
              >
                {(heatmap) =>
                  heatmap.map((rows) =>
                    rows.map((cell) => (
                      <rect
                        key={`${cell.row}-${cell.column}`}
                        x={cell.x}
                        y={cell.y}
                        width={cell.width}
                        height={cell.height}
                        fill={colorScale(cell.count || 0)}
                      />
                    ))
                  )
                }
              </HeatmapRect>
            </Group>

            {/* X Axis */}
            <Group top={height - margin.bottom} left={margin.left}>
              <AxisBottom
                scale={xScale}
                tickValues={getTicks(minX, maxX, xBins, 50)}
                tickFormat={(val) =>
                  `${Math.round(clamp(val as number, 0, xBins, minX, maxX))}`
                }
                tickLength={4}
                tickLabelProps={() => ({
                  fill: "#000",
                  fontSize: 11,
                  textAnchor: "middle",
                  dy: "0.5em",
                })}
              />
            </Group>

            {/* Y Axis */}
            <Group top={margin.top} left={margin.left}>
              <AxisLeft
                scale={yScale}
                tickValues={getTicks(minY, maxY, yBins, 10).map((val) => val)}
                tickFormat={(val) => `${Math.round(val as number)}`}
                tickLength={4}
                tickLabelProps={() => ({
                  fill: "#000",
                  fontSize: 11,
                  textAnchor: "end",
                  dx: "-0.4em",
                  dy: "0.33em",
                })}
              />
            </Group>
          </svg>
        );
      }}
    </ParentSize>
  );
}

function getTicks(
  min: number,
  max: number,
  binCount: number,
  step: number = 10
): number[] {
  const start = Math.ceil(min / step) * step;
  const end = Math.floor(max / step) * step;
  const ticks: number[] = [];
  for (let val = start; val <= end; val += step) {
    ticks.push(clamp(val, min, max, 0, binCount));
  }
  return ticks;
}

function clamp(
  oldVal: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
): number {
  return ((oldVal - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

export function binPoints({
  xSeries,
  ySeries,
  values,
  xBins,
  yBins,
  minX,
  maxX,
  minY,
  maxY,
  normalize,
}: {
  xSeries: number[];
  ySeries: number[];
  values: number[];
  xBins: number;
  yBins: number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  normalize?: string;
}): [number[][], number, number, number, number] {
  if (xSeries.length !== ySeries.length || xSeries.length !== values.length) {
    throw new Error("xSeries, ySeries, and values must have the same length");
  }
  // Default min/max if not provided
  minX = minX ?? Math.min(...xSeries);
  maxX = maxX ?? Math.max(...xSeries) * 1.000001;
  minY = minY ?? Math.min(...ySeries);
  maxY = maxY ?? Math.max(...ySeries) * 1.000001;

  const xBinSize = (maxX - minX) / xBins;
  const yBinSize = (maxY - minY) / yBins;

  // Initialize accumulators
  const binSums: number[][] = Array.from({ length: yBins }, () =>
    Array(xBins).fill(0)
  );
  const binCounts: number[][] = Array.from({ length: yBins }, () =>
    Array(xBins).fill(0)
  );

  for (let i = 0; i < xSeries.length; i++) {
    const px = xSeries[i];
    const py = ySeries[i];
    const val = values[i];

    if (px < minX || px > maxX || py < minY || py > maxY) continue;

    const xIdx = Math.min(Math.floor((px - minX) / xBinSize), xBins - 1);
    const yIdx =
      yBins - 1 - Math.min(Math.floor((py - minY) / yBinSize), yBins - 1);

    binSums[yIdx][xIdx] += val;
    binCounts[yIdx][xIdx] += 1;
  }

  let out = binSums;

  if (normalize === "totalCount") {
    out = binSums.map((row) => row.map((sum) => sum / xSeries.length));
  } else if (normalize === "average") {
    for (let i = 0; i < yBins; i++) {
      for (let j = 0; j < xBins; j++) {
        if (binCounts[i][j] > 0) {
          out[i][j] = binSums[i][j] / binCounts[i][j];
        }
      }
    }
  } else if (normalize === "column") {
    for (let j = 0; j < xBins; j++) {
      let colSum = 0;
      for (let i = 0; i < yBins; i++) {
        colSum += binSums[i][j];
      }
      if (colSum > 0) {
        for (let i = 0; i < yBins; i++) {
          out[i][j] = binSums[i][j] / colSum;
        }
      }
    }
  }

  return [out, minX, maxX, minY, maxY];
}

function transposeMatrix(matrix: number[][]): number[][] {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}
