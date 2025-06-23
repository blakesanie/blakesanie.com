"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Map as MapLibre } from "react-map-gl/maplibre";
import { DeckGL, DeckGLRef } from "@deck.gl/react";
import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import maplibregl from "maplibre-gl";
import type { MapViewState, Layer } from "@deck.gl/core";
import {
  lineString,
  length as turfLength,
  along as turfAlong,
} from "@turf/turf";
import Geohash from "ngeohash";
import { useViewState } from "./ViewStateProvider";
import { useOverpass } from "./OverpassProvider";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import buildLayers from "./layers";

const layerCatalog: Set<string> = new Set(); // all layer ids stored

export default function MapComponent() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const deckRef = useRef<DeckGLRef | null>(null);
  const [layers, setLayers] = useState<Map<String, Layer[]>>(new Map()); // geohash to layer

  const {
    setViewState,
    setBounds,
    geohashesInScope,
    geohashesAdded,
    geoHashesRemoved,
    viewState,
  } = useViewState({
    longitude: -87.623177,
    latitude: 41.8781,
    zoom: 12,
    pitch: 0,
    bearing: 0,
  });

  const zoomedTooFarOut =
    viewState?.zoom !== undefined && viewState.zoom < 10.5;

  //   const viewState = {
  //     longitude: -87.623177,
  //     latitude: 41.8781,
  //     zoom: 12,
  //     pitch: 0,
  //     bearing: 0,
  //   };

  const updateBounds = useCallback(() => {
    // debugger;
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    setBounds(bounds);
  }, [setBounds]);

  const { callOverpass } = useOverpass();

  useEffect(() => {
    console.log("zoom level:", viewState?.zoom);
    if (zoomedTooFarOut) {
      console.warn("Zoom level too low, not loading processing new layers");
      return;
    }
    console.log("Geohashes in scope:", geohashesInScope);
    console.log("Geohashes added:", geohashesAdded);
    console.log("Geohashes removed:", geoHashesRemoved);
    for (const geohash of geoHashesRemoved) {
      for (const layer of layers.get(geohash) || []) {
        layerCatalog.delete(layer.id);
      }
      layers.delete(geohash);
      console.log("Removed layers for geohash:", geohash);
    }

    Promise.all(
      geohashesAdded.map((geohash) => {
        return callOverpass(geohash);
      })
    ).then((geojsons) => {
      let i = 0;
      for (const geohash of geohashesAdded) {
        assert(
          !layers.has(geohash),
          "Layer already exists for geohash: " + geohash
        );
        assert(
          !layerCatalog.has(geohash),
          "Layer catalog already has geohash: " + geohash
        );
        const geojsonBlob = geojsons[i];
        if (geojsonBlob) {
          const newLayers = buildLayers(geojsonBlob, layerCatalog, geohash);
          console.log("Adding layers for geohash:", geohash, newLayers);
          layers.set(geohash, newLayers);
          i++;
        }
      }

      setLayers(new Map(layers));
    });
  }, [geohashesAdded, geoHashesRemoved]);

  const layersFlat = useMemo(() => {
    const out: any[] = [];
    for (const layer of layers.values()) {
      out.push(...layer);
    }
    return out;
  }, [layers]);

  return (
    <DeckGL
      ref={deckRef}
      layers={zoomedTooFarOut ? [] : layersFlat}
      initialViewState={viewState}
      onViewStateChange={function handleViewStateChange(evt) {
        if ("viewState" in evt) {
          setViewState(evt.viewState as MapViewState);
          updateBounds();
        }
      }}
      controller={true}
    >
      <MapLibre
        ref={(instance) => {
          if (instance) mapRef.current = instance.getMap();
        }}
        mapLib={maplibregl}
        mapStyle="/mapstyle.json" // or your own style
        onLoad={updateBounds}
      />
    </DeckGL>
  );
}

function assert(condition: boolean, message = "Assertion failed") {
  if (!condition) {
    console.warn(message);
  }
}
