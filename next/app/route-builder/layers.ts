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
  geohash: string
): Layer[] {
  console.log("Building layers for geojson:", geojson);
  const out = [];

  geojson.features = geojson.features.filter((feature) => {
    const id = feature.id?.toString();
    if (!id || layerCatalog.has(id)) {
      return false;
    }
    layerCatalog.add(id);
    return true;
  });

  // bike lanes
  //   for (const feature of geojson.features) {
  //     const id = feature.id?.toString();
  //     if (!id || layerCatalog.has(id)) {
  //       console.log("Skipping feature with id:", id);
  //       continue;
  //     }
  //     const layer = new GeoJsonLayer({
  //       id,
  //       data: geojson,
  //       stroked: true,
  //       filled: false,
  //       getLineColor: [0, 150, 0, 100],
  //       getLineWidth: 5,

  //       lineWidthMinPixels: 2,
  //     });
  //     layerCatalog.add(id);
  //     out.push(layer);
  //   }

  const bikelaneFeatures: Feature<Geometry, GeoJsonProperties>[] = [];

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

  // const bikelaneLayer = buildGeojsonLayer(featureGroups.get("bikelanes"), {
  //     id: geohash + "-bikelanes",
  //     stroked: true,
  //     filled: false,
  //     getLineColor: [0, 150, 0, 100],
  //     getLineWidth: 5,
  //     lineWidthMinPixels: 2,
  //   })
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

  //   const bikelaneGeojson: FeatureCollection<Geometry, GeoJsonProperties> = {
  //     type: "FeatureCollection",
  //     features: bikelaneFeatures,
  //   };
  //   const bikelaneLayer = new GeoJsonLayer({
  //     id: geohash + "-bikelanes",
  //     data: bikelaneGeojson,
  //     stroked: true,
  //     filled: false,
  //     getLineColor: [0, 150, 0, 100],
  //     getLineWidth: 5,
  //     lineWidthMinPixels: 2,
  //   });
  //   out.push(bikelaneLayer);

  return out;
}

function buildGeojsonLayer(
  features: Feature<Geometry, GeoJsonProperties>[] | undefined,
  config: any
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
