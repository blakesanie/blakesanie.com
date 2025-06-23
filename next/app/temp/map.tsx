"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Map as MapLibre } from "react-map-gl/maplibre";
import { DeckGL, DeckGLRef } from "@deck.gl/react";
import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import maplibregl from "maplibre-gl";
import type { MapViewState } from "@deck.gl/core";
import {
  lineString,
  length as turfLength,
  along as turfAlong,
} from "@turf/turf";
import Geohash from "ngeohash";

const GEOHASH_PRECISION = 7; // ~76m x 76m — tweak to match ~50m coverage
const seenGeohashes = new Map<string, number[]>();

type ArrowPoint = {
  position: [number, number];
  angle: number;
};

function extractArrowPointsAtIntervals(
  geojson: GeoJSON.FeatureCollection,
  intervalMeters = 10
): ArrowPoint[] {
  const arrows: ArrowPoint[] = [];

  for (const feature of geojson.features) {
    if (
      feature.geometry.type === "LineString" &&
      Array.isArray(feature.geometry.coordinates)
    ) {
      const line = lineString(feature.geometry.coordinates);
      const lineLengthKm = turfLength(line, { units: "kilometers" });

      const startBuffer = 0.01;
      const endBuffer = 0.1; // km
      const intervalKm = intervalMeters / 1000;

      for (
        let dist = startBuffer;
        dist < lineLengthKm - endBuffer || dist == startBuffer;
        dist += intervalKm
      ) {
        const point1 = turfAlong(line, dist, { units: "kilometers" });
        const point2 = turfAlong(line, dist + 0.001, { units: "kilometers" }); // small delta ahead

        const [x0, y0] = point1.geometry.coordinates;
        const [x1, y1] = point2.geometry.coordinates;
        const angle = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;

        const hash = Geohash.encode(y0, x0, GEOHASH_PRECISION);
        const neighbors = Geohash.neighbors(hash);

        const hashesToTry = [hash, ...neighbors];
        let shouldContinue = false;
        for (const hash of hashesToTry) {
          const neighborAngles = seenGeohashes.get(hash);
          if (neighborAngles) {
            for (const neighborAngle of neighborAngles) {
              let angleDiff = Math.abs(angle - neighborAngle);
              angleDiff = Math.min(angleDiff, 360 - angleDiff);
              if (angleDiff < 45) {
                // Too close to another arro
                shouldContinue = true;
                break;
              }
            }
          }
        }
        if (shouldContinue) {
          continue;
        }
        const existing = seenGeohashes.get(hash);
        if (!existing) {
          seenGeohashes.set(hash, [angle]);
        } else {
          existing.push(angle);
        }
        arrows.push({ position: [x0, y0], angle });
      }
    }
  }

  return arrows;
}

const svgArrow = `
<svg width="75" height="44" viewBox="0 0 75 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.49998 38.9971L3.49998 5.00292L62.3818 22L3.49998 38.9971Z" fill="COLOR" stroke="COLOR" stroke-width="7"/>
</svg>
`;

const greenArrow = svgArrow.replaceAll("COLOR", "#00ff00");
const redArrow = svgArrow.replaceAll("COLOR", "#ff0000");

const greenArrow64 = `data:image/svg+xml;base64,${btoa(greenArrow)}`;
const redArrow64 = `data:image/svg+xml;base64,${btoa(redArrow)}`;

export default function BikeMap({
  fetchCycleways,
  fetchOneways,
}: {
  fetchCycleways: (bounds: {
    south: number;
    west: number;
    north: number;
    east: number;
  }) => Promise<GeoJSON.FeatureCollection | null>;
  fetchOneways: (bounds: {
    south: number;
    west: number;
    north: number;
    east: number;
  }) => Promise<GeoJSON.FeatureCollection | null>;
}) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const deckRef = useRef<DeckGLRef | null>(null);
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: -87.623177,
    latitude: 41.8781,
    zoom: 10,
    pitch: 0,
    bearing: 0,
  });
  const [layers, setLayers] = useState<any[]>([]);

  const addLayersForGeoJson = useCallback(
    (
      geojson: GeoJSON.FeatureCollection,
      geojsonLayerConfig: any,
      iconLayerConfig: any
    ) => {
      const newLayers: (GeoJsonLayer<any> | IconLayer<any>)[] = [];

      if (geojsonLayerConfig) {
        const geoLayer = new GeoJsonLayer(geojsonLayerConfig);
        newLayers.push(geoLayer);
      }

      if (iconLayerConfig) {
        const arrowPoints = extractArrowPointsAtIntervals(geojson, 200);
        const iconLayer = new IconLayer({
          ...iconLayerConfig,
          data: arrowPoints,
        });
        newLayers.push(iconLayer);
      }

      setLayers((layers) => [...layers, ...newLayers]);
    },
    [setLayers]
  );

  const load = useCallback(async () => {
    // debugger;
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    const queryBounds = {
      south: bounds.getSouth(),
      west: bounds.getWest(),
      north: bounds.getNorth(),
      east: bounds.getEast(),
    };

    // const cycleways = await fetchCycleways(queryBounds);
    // const oneways = await fetchOneways(queryBounds);

    const layerPromises = [
      fetchCycleways(queryBounds).then((geojson) => {
        if (!geojson) return null;
        addLayersForGeoJson(
          geojson,
          {
            id: "bike-lanes",
            data: geojson,
            stroked: true,
            filled: false,
            getLineColor: [0, 150, 0, 100],
            getLineWidth: 5,

            lineWidthMinPixels: 2,
          },
          {
            id: "bike-lane-arrows",
            getPosition: (d: any) => d.position,
            getAngle: (d: any) => d.angle,
            getSize: 14,
            sizeUnits: "meters",
            iconAtlas: redArrow64,
            getColor: [0, 150, 0, 200],
            iconMapping: {
              arrow: {
                x: 0,
                y: 0,
                width: 75,
                height: 44,
                anchorX: 0 / 2, // center horizontally
                anchorY: 44 / 2, // center vertically
                mask: true,
              },
            },
            getIcon: () => "arrow",
          }
        );
      }),
      fetchOneways(queryBounds).then((geojson) => {
        if (!geojson) return null;
        addLayersForGeoJson(
          geojson,
          {
            id: "oneways",
            data: geojson,
            stroked: true,
            filled: false,
            getLineColor: [0, 90, 200, 100],
            getLineWidth: 5,
            lineWidthMinPixels: 2,
          },
          {
            id: "oneway-arrows",
            getPosition: (d: any) => d.position,
            getAngle: (d: any) => d.angle,
            getSize: 14,
            getColor: [0, 0, 255, 200],
            sizeUnits: "meters",
            iconAtlas: greenArrow64,
            iconMapping: {
              arrow: {
                x: 0,
                y: 0,
                width: 75,
                height: 44,
                anchorX: 0 / 2, // center horizontally
                anchorY: 44 / 2, // center vertically
                mask: true,
              },
            },
            getIcon: () => "arrow",
          }
        );
      }),
    ];

    Promise.all(layerPromises);
  }, [fetchCycleways, fetchOneways, addLayersForGeoJson]);

  const map = useMemo(
    () => (
      <MapLibre
        ref={(instance) => {
          if (instance) mapRef.current = instance.getMap();
        }}
        mapLib={maplibregl}
        mapStyle="/mapstyle.json" // or your own style
        onLoad={load}
      />
    ),
    [load]
  );

  return (
    <DeckGL
      ref={deckRef}
      layers={layers}
      initialViewState={viewState}
      onViewStateChange={function handleViewStateChange(evt) {
        if ("viewState" in evt) {
          //   console.log("viewState", evt.viewState);
          setViewState(evt.viewState as MapViewState);
        }
      }}
      controller={true}
    >
      {map}
    </DeckGL>
  );
}
