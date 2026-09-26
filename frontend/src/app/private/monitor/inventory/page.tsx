"use client";

import { useEnvironment } from "@/lib/environment-context";
import ClusterMonitor from "@/components/monitor/ClusterMonitor";
import DatabaseMonitor from "@/components/monitor/DatabaseMonitor";

export default function Inventory() {
  const { environment } = useEnvironment();

  if (environment === "Non-Prod") {
    return <DatabaseMonitor />;
  }

  return <ClusterMonitor />;
}
