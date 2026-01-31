"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
// import {
//   QueryClient,
//   QueryClientProvider,
//   useQuery,
// } from "@tanstack/react-query";
import ngeohash from "ngeohash";
import osmtogeojson from "osmtogeojson";

type OverpassDataType = Map<string, GeoJSON.FeatureCollection | null>;
type callOverpassType = (
  geohash: any,
) => Promise<GeoJSON.FeatureCollection | null>;

interface OverpassContextType {
  callOverpass: callOverpassType;
}

const OverpassContext = createContext<OverpassContextType | null>(null);

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";
const cyclewayQuery = `
    [out:json][timeout:25];
    (
      way["highway"]["bicycle"="designated"]({{bbox}});
      way["highway"="cycleway"]({{bbox}});
    );
    out body;
    >;
    out skel qt;
  `;
const onewayQuery = `

  [out:json][timeout:25];
  (
    way["highway"~"^primary|secondary|tertiary|residential"]["bicycle"!="no"]["oneway"="yes"]["access"!="private"]({{bbox}});
  );
  out body;
  >;
  out skel qt;
`;

const cache = new Map<string, GeoJSON.FeatureCollection | null>();
const geohashAccesses = new Map<string, number>();

export default function OverpassProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("overpass-")) {
        continue;
      }
      const geohash = key.replace("overpass-", "");
      const value = localStorage.getItem(key);
      if (!value) {
        continue;
      }
      try {
        cache.set(geohash, JSON.parse(value) as GeoJSON.FeatureCollection);
      } catch (e) {}
    }
  }, []);

  const callOverpass = useCallback<callOverpassType>(async (geohash) => {
    geohashAccesses.set(geohash, new Date().getTime());
    const cachedData = cache.get(geohash);
    if (cachedData) {
      console.log("Using cached data for geohash:", geohash, cachedData);
      return cachedData;
    }
    const [minlat, minlon, maxlat, maxlon] = ngeohash.decode_bbox(geohash);
    const bbox = `${minlon},${minlat},${maxlon},${maxlat}`;
    const formattedQuery = cyclewayQuery.replace(/{{bbox}}/g, bbox);
    let geojson: GeoJSON.FeatureCollection | null = null;
    const res = await fetch(OVERPASS_API_URL, {
      method: "POST",
      body: formattedQuery,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const raw = await res.json();
    geojson = osmtogeojson(raw) as GeoJSON.FeatureCollection;
    const serialized = JSON.stringify(geojson);

    setInLocalStorageUntilSuccess("overpass-" + geohash, serialized);
    cache.set(geohash, geojson);
    console.log("Fetched data for geohash:", geohash, geojson, formattedQuery);
    return geojson;
  }, []);

  return (
    <OverpassContext.Provider value={{ callOverpass }}>
      {children}
    </OverpassContext.Provider>
  );
}

export function useOverpass() {
  const context = useContext(OverpassContext);
  if (!context) {
    throw new Error("useOverpass must be used within an OverpassProvider");
  }
  return context;
}

function setInLocalStorageUntilSuccess(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (
      e instanceof DOMException &&
      (e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      let min = Infinity;
      let oldestKey = "";
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith("overpass-")) {
          continue;
        }
        const geohash = key.replace("overpass-", "");
        const accessTime = geohashAccesses.get(geohash);
        if (!accessTime)
          oldestKey = key; // if no access time, consider it oldest
        else if (accessTime < min) {
          min = accessTime;
          oldestKey = key;
        }
      }
      console.warn("Local storage full, removing oldest geohash:", oldestKey);
      localStorage.removeItem(oldestKey);
      // cache.delete(oldestKey);
      geohashAccesses.delete(oldestKey.replace("overpass-", ""));
      setInLocalStorageUntilSuccess(key, value); // try again after removing the oldest entry
    } else {
      throw e; // re-throw other errors
    }
  }
}
