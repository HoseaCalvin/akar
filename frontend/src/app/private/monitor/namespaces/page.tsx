"use client";

import TopBar from "@/components/TopBar";
import TopologyDirectory from "@/components/TopologyDirectory";
import { api } from "@/lib/api";

export default function Namespaces() {
  return <main className="relative flex min-h-full flex-col px-7 py-5"><TopBar /><TopologyDirectory title="Namespaces" loader={api.monitor.namespaces} /></main>;
}
