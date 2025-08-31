"use client";

import React from "react";
import { scaleLinear } from "@visx/scale";
import { Circle } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";

type Datum = { x: number; y: number };

type ScatterplotProps = {
  data: Datum[];
};

export default function Scatterplot({ data }: ScatterplotProps) {
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  return (
    <ParentSize>
      {({ width, height }) => {
        if (width === 0 || height === 0) return null; // avoid zero dimension

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xMax = Math.max(...data.map((d) => d.x));
        const yMax = Math.max(...data.map((d) => d.y));

        const xScale = scaleLinear({
          domain: [0, xMax],
          range: [0, innerWidth],
          nice: true,
        });

        const yScale = scaleLinear({
          domain: [0, yMax],
          range: [innerHeight, 0],
          nice: true,
        });

        return (
          <svg width={width} height={height}>
            <Group left={margin.left} top={margin.top}>
              <AxisBottom scale={xScale} top={innerHeight} />
              <AxisLeft scale={yScale} />
              {data.map((d, i) => (
                <Circle
                  key={i}
                  cx={xScale(d.x)}
                  cy={yScale(d.y)}
                  r={4}
                  fill="dodgerblue"
                />
              ))}
            </Group>
          </svg>
        );
      }}
    </ParentSize>
  );
}
