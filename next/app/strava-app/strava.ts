import { useState, useEffect, useCallback } from "react";
import qs from "querystring";
import { useSearchParams } from "next/navigation";

export function useStravaAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  useEffect(() => {
    if (!code) return;

    fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: qs.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          setError("Failed to authenticate with Strava");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.access_token) {
          setAuthenticated(true);
          localStorage.setItem("stravaAccessToken", data.access_token);
        } else {
          setError("Invalid response from Strava");
        }
      })
      .catch((err) => {
        console.error("Error during Strava authentication:", err);
        setError("An error occurred while authenticating with Strava");
      });
  }, [code]);
  return [authenticated, error];
}

export function useActivityStreams(): [
  StreamSet | null,
  string | null,
  boolean,
] {
  const [streamSet, setStreamSet] = useState<StreamSet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetch("/activity.json")
      .then((res) => {
        if (!res.ok) {
          setError("Failed to fetch activity streams");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          const ss = data as StreamSet;
          setStreamSet(ss);
        }
      })
      .catch((err) => {
        console.error("Error fetching activity streams:", err);
        setError("An error occurred while fetching activity streams");
      });
  }, []);
  return [streamSet, error, loading];
}

type BaseStream<T> = {
  type: string;
  original_size: number;
  resolution: string;
  series_type: string;
  data: T[];
};

// Specific stream types
type TimeStream = BaseStream<number>;
type DistanceStream = BaseStream<number>;
type LatLngStream = BaseStream<[number, number]>; // [lat, lng]
type AltitudeStream = BaseStream<number>;
type SmoothVelocityStream = BaseStream<number>;
type HeartrateStream = BaseStream<number>;
type CadenceStream = BaseStream<number>;
type PowerStream = BaseStream<number>;
type TemperatureStream = BaseStream<number>;
type MovingStream = BaseStream<boolean>;
type SmoothGradeStream = BaseStream<number>;

// Top-level object returned by Strava
type StreamSet = {
  time?: TimeStream;
  distance?: DistanceStream;
  latlng?: LatLngStream;
  altitude?: AltitudeStream;
  velocity_smooth?: SmoothVelocityStream;
  heartrate?: HeartrateStream;
  cadence?: CadenceStream;
  watts?: PowerStream;
  temp?: TemperatureStream;
  moving?: MovingStream;
  grade_smooth?: SmoothGradeStream;
};
