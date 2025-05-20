import { useCallback } from "react";
import osmtogeojson from "osmtogeojson";

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

export type Bounds = {
  south: number;
  west: number;
  north: number;
  east: number;
};

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

export function useOverpass() {
  //   const [data, setData] = useState<GeoJSON.FeatureCollection | null>(null);
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState<Error | null>(null);

  const callOverpass = useCallback(
    async (
      query: string,
      bounds: Bounds
    ): Promise<GeoJSON.FeatureCollection | null> => {
      const bbox = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
      const formattedQuery = query.replace(/{{bbox}}/g, bbox);
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

      return geojson;
    },
    []
  );

  const fetchCycleways = useCallback(
    async (bounds: Bounds) => callOverpass(cyclewayQuery, bounds),
    [callOverpass]
  );

  const fetchOneways = useCallback(
    async (bounds: Bounds) => callOverpass(onewayQuery, bounds),
    [callOverpass]
  );

  return { fetchCycleways, fetchOneways };
}
