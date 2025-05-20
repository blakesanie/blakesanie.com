"use client";

import Map from "./map";
import { useOverpass } from "./useOverpass";

export default function Dashboard() {
  const { fetchCycleways, fetchOneways } = useOverpass();

  return (
    <div>
      <Map fetchCycleways={fetchCycleways} fetchOneways={fetchOneways} />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}
