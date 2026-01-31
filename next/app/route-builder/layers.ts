import {
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
  Feature,
} from "geojson";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Layer } from "@deck.gl/core";
import { feature } from "@turf/turf";

export default function buildLayers(
  geojson: FeatureCollection<Geometry, GeoJsonProperties>,
  layerCatalog: Set<string>,
  entitiesByGeohash: Map<string, string[]>,
  geohash: string,
): Layer[] {
  console.log("Building layers for geojson:", geojson);
  const out: Layer[] = [];

  const allIds: string[] = [];
  geojson.features = geojson.features.filter((feature) => {
    const id = feature.id?.toString();
    if (!id || layerCatalog.has(id)) {
      return false;
    }
    layerCatalog.add(id);
    allIds.push(id);
    return true;
  });
  if (geojson.features.length === 0) {
    console.warn("No valid features found in geojson for geohash:", geohash);
    return out;
  }
  entitiesByGeohash.set(geohash, allIds);

  const featureGroups: Map<string, Feature<Geometry, GeoJsonProperties>[]> =
    new Map();
  featureGroups.set("bikelanes", []);

  for (const feature of geojson.features) {
    if (
      feature.properties?.highway === "cycleway" ||
      feature.properties?.bicycle === "designated"
    ) {
      featureGroups.get("bikelanes")?.push(feature);
    }
  }

  const bikelaneLayer = buildGeojsonLayer(featureGroups.get("bikelanes"), {
    id: geohash + "-bikelanes",
    stroked: true,
    filled: false,
    getLineColor: [0, 150, 0, 100],
    getLineWidth: 5,
    lineWidthMinPixels: 2,
  });
  if (bikelaneLayer) {
    out.push(bikelaneLayer);
  }

  return out;
}

function buildGeojsonLayer(
  features: Feature<Geometry, GeoJsonProperties>[] | undefined,
  config: any,
): GeoJsonLayer<GeoJsonProperties> | null {
  if (!features || features.length === 0) {
    console.warn("No features provided for GeoJsonLayer");
    return null;
  }
  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: features,
  };
  return new GeoJsonLayer({
    ...config,
    data: geojson,
  });
}
