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

const entitiesByGeohash = new Map<string, string[]>();
const entityCatalog = new Set<string>();

export default function MapComponent() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const deckRef = useRef<DeckGLRef | null>(null);
  const [layers, setLayers] = useState<Map<string, Layer[]>>(new Map()); // geohash to layer

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
    console.log("Geohashes in scope:", geohashesInScope);
    console.log("Geohashes added:", geohashesAdded);
    console.log("Geohashes removed:", geoHashesRemoved);
    for (const geohash of geoHashesRemoved) {
      for (const entity of entitiesByGeohash.get(geohash) || []) {
        entityCatalog.delete(entity);
      }
      entitiesByGeohash.delete(geohash);
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
          !entityCatalog.has(geohash),
          "Layer catalog already has geohash: " + geohash
        );
        const geojsonBlob = geojsons[i];
        if (geojsonBlob) {
          const newLayers = buildLayers(
            geojsonBlob,
            entityCatalog,
            entitiesByGeohash,
            geohash
          );
          if (newLayers.length === 0) {
            console.warn("No layers built for geohash:", geohash);
          } else {
            console.log("Adding layers for geohash:", geohash, newLayers);
            layers.set(geohash, newLayers);
          }
          i++;
        }
      }
      console.log("Layers after update:", layers);
      console.log("Entities after update:", entitiesByGeohash);
      // console.log("Entities by geohash after
      setLayers(new Map(layers));
    });
  }, [geohashesInScope, geohashesAdded, geoHashesRemoved]);

  const layersClean = useMemo(() => {
    // debugger;
    const geohashesInScopeSet = new Set(geohashesInScope);
    for (const geohash of layers.keys()) {
      if (!geohashesInScopeSet.has(geohash)) {
        layers.delete(geohash);
      }
    }
    for (const geohash of entitiesByGeohash.keys()) {
      if (!geohashesInScopeSet.has(geohash)) {
        const entities = entitiesByGeohash.get(geohash);
        for (const entity of entities || []) {
          entityCatalog.delete(entity);
        }
        entitiesByGeohash.delete(geohash);
      }
    }
    const flattenned: any[] = [];
    for (const layer of layers.values()) {
      flattenned.push(...layer);
    }
    return flattenned;
  }, [layers, viewState?.latitude, viewState?.longitude, viewState?.zoom]);

  return (
    <>
      <DeckGL
        ref={deckRef}
        layers={layersClean}
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
      <div className="absolute top-0 left-0 p-4 bg-white z-10">
        <p>{`Layers rendered: ${layersClean.length}`}</p>
        <p>{`Entities rendered: ${entityCatalog.size}`}</p>
      </div>
    </>
  );
}

function assert(condition: boolean, message = "Assertion failed") {
  if (!condition) {
    console.warn(message);
  }
}
