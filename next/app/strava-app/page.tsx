"use client";
import { useSearchParams } from "next/navigation";
import { useStravaAuth, useActivityStreams } from "./strava";
import ScatterPlot from "./scatterplot";
import Heatmap, { binPoints } from "./heatmap";
import ModeToggle from "@/components/mode-toggle";
import { useMemo } from "react";

const isProd = process.env.NODE_ENV === "production";

const signinUrl = `https://www.strava.com/oauth/authorize?client_id=132542&response_type=code&redirect_uri=${isProd ? "https://blakesanie.com" : "http://localhost:3000"}/strava-app&approval_prompt=auto&scope=read,read_all,activity:read_all,activity:read,activity:write`;

const power = [200, 200, 200, 0, 0, 0, 0];
const cadence = [100, 100, 100, 0, 0, 0, 40];

export default function Page() {
  const [authenticated, authError] = useStravaAuth();
  const [streamSet, error, loading] = useActivityStreams();
  const [cadenceHeatmap, minX, maxX, minY, maxY] = useMemo(() => {
    const bp = binPoints({
      ySeries: cadence,
      xSeries: power,
      values: Array.from({ length: cadence.length ?? 0 }, () => 1),
      xBins: 10,
      yBins: 10,
      normalize: "column",
    });
    console.log("Binned points:", bp);
    return bp;
  }, [streamSet]);
  return (
    <>
      <ModeToggle />
      <a href={signinUrl}>
        <button>Sign in with Strava</button>
        <p>{`Authenticated: ${authenticated}`}</p>
        <p>{`Auth error: ${authError}`}</p>
      </a>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="p-4 rounded bg-[rgba(0,100,250,0.1)]">
          <h2 className="text-xl font-bold">Cadence</h2>
          <p>
            Cadence is the number of steps you take per minute while running. It
            is a key metric for runners to optimize their performance and reduce
            the risk of injury.
          </p>
        </div>
        <div className="p-4 rounded bg-[rgba(0,100,250,0.1)] h-[400px]">
          <Heatmap
            values={cadenceHeatmap}
            minX={minX}
            maxX={maxX}
            minY={minY}
            maxY={maxY}
          />
        </div>
      </div>
    </>
  );
}
