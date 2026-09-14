"use client";

import TopBar from "@/components/TopBar";
import TopologyDirectory from "@/components/TopologyDirectory";
import { api } from "@/lib/api";

export default function Deployments() {
  return <main className="relative flex min-h-full flex-col px-7 py-5"><TopBar /><TopologyDirectory title="Deployments" loader={api.monitor.deployments} /></main>;
}
