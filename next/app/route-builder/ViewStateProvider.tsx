"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  use,
} from "react";
import type { LngLatBounds } from "react-map-gl/maplibre";

import type { MapViewState } from "@deck.gl/core";
import ngeohash from "ngeohash";

type ViewStateContextType = {
  setViewState: (viewState: MapViewState) => void;
  viewState: MapViewState | null;
  bounds: LngLatBounds | null;
  setBounds: (bounds: LngLatBounds) => void;
  geohashesInScope: string[];
  geohashesAdded: string[];
  geoHashesRemoved: string[];
};

const GEOHASH_PRECISION = 4;

const ViewStateContext = createContext<ViewStateContextType | null>(null);

export default function ViewStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [viewState, setViewState] = useState<MapViewState | null>(null);
  const [bounds, setBounds] = useState<LngLatBounds | null>(null);
  const prevGeohashesInScopeRef = useRef<string[]>([]);

  const geohashesInScope = useMemo(() => {
    if (!bounds) return [];
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const out = ngeohash.bboxes(
      sw.lng,
      sw.lat,
      ne.lng,
      ne.lat,
      GEOHASH_PRECISION
    );
    if (out.join(",") === prevGeohashesInScopeRef.current.join(",")) {
      return prevGeohashesInScopeRef.current;
    }

    return out;
  }, [bounds?.toString()]);

  const [geohashesAdded, geoHashesRemoved] = useMemo((): string[][] => {
    const previousSet = new Set(prevGeohashesInScopeRef.current);
    const currentSet = new Set(geohashesInScope);
    const geohashesAdded: string[] = [];
    const geoHashesRemoved: string[] = [];
    for (const geohash of geohashesInScope) {
      if (!previousSet.has(geohash)) {
        geohashesAdded.push(geohash);
      }
    }
    for (const geohash of prevGeohashesInScopeRef.current) {
      if (!currentSet.has(geohash)) {
        geoHashesRemoved.push(geohash);
      }
    }
    prevGeohashesInScopeRef.current = geohashesInScope;
    return [geohashesAdded, geoHashesRemoved];
  }, [geohashesInScope.join(",")]);

  return (
    <ViewStateContext.Provider
      value={{
        setViewState,
        viewState,
        bounds,
        setBounds,
        geohashesInScope,
        geohashesAdded,
        geoHashesRemoved,
      }}
    >
      {children}
    </ViewStateContext.Provider>
  );
}

export function useViewState(initialViewState: MapViewState) {
  const viewStateContextValues = useContext(ViewStateContext);
  if (!viewStateContextValues) {
    throw new Error("useViewState must be used within a ViewStateProvider");
  }
  // useEffect(() => {
  //   if (!viewStateContextValues.viewState) {
  //     viewStateContextValues.setViewState(initialViewState);
  //   }
  // }, []);

  if (!viewStateContextValues.viewState) {
    return { ...viewStateContextValues, viewState: initialViewState };
  }
  return viewStateContextValues;
}
