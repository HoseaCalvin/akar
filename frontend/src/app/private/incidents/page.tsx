"use client";

import { useState } from "react";
import IncidentCard from "@/components/IncidentCard";
import TopBar from "@/components/TopBar";
import PageState from "@/components/PageState";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import type { ResourceKind } from "@/lib/types";

export default function Incidents() {
  const [kind, setKind] = useState<ResourceKind>("pods");
  const [worker, setWorker] = useState<string>("");
  const { data, loading, error } = useApi(`incidents:${kind}:${worker}`, () =>
    api.incidents.list({ kind, worker: worker || undefined }),
  );

  const selectedWorker = worker || data?.selectedWorker || "";

  return (
    <main className="main-container">
      <TopBar />
      <section className="space-y-1 shrink-0">
        <h1 className="font-semibold text-lg">2D Spatial Topology & Incident Queue</h1>
      </section>
      <section className="flex w-full flex-1 min-h-0 py-5">
        <section className="w-1/2">
          <select
            value={selectedWorker}
            onChange={(event) => setWorker(event.target.value)}
            className="bg-white p-1.5"
          >
            {(data?.workers ?? ["worker-01"]).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </section>
        <section className="w-1/2 flex flex-col min-h-0">
          <div className="flex gap-x-2.5 pt-3.5 lg:gap-x-5 shrink-0">
            <button
              type="button"
              onClick={() => setKind("pods")}
              className={`bg-white py-1 px-4 rounded-lg shadow-md cursor-pointer ${kind === "pods" ? "ring-2 ring-blue-400" : ""}`}
            >
              Pods
            </button>
            <button
              type="button"
              onClick={() => setKind("services")}
              className={`bg-white py-1 px-4 rounded-lg shadow-md cursor-pointer ${kind === "services" ? "ring-2 ring-blue-400" : ""}`}
            >
              Services
            </button>
          </div>
          <div className="rounded-2xl flex-1 min-h-0 lg:p-4">
            <div className="flex justify-between">
              <header className="flex items-center gap-x-3">
                <h1 className="font-bold leading-0 lg:text-lg">
                  {kind === "pods" ? "Pods Incidents" : "Service Incidents"}
                </h1>
                <p className="leading-0 text-sm">{data?.activeCount ?? 0} Active Incidents</p>
              </header>
            </div>
            <div className="lg:py-3 lg:space-y-3">
              <PageState
                loading={loading}
                error={error}
                empty={!loading && (data?.incidents.length ?? 0) === 0}
                emptyLabel="No incidents"
              />
              {data?.incidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
            {data?.preview && (
              <div className="bg-white rounded-lg lg:px-3 lg:py-2 lg:mt-5 lg:rounded-2xl">
                <section className="flex lg:gap-x-3">
                  <h1 className="p-2">Details</h1>
                </section>
                <section className="space-y-2">
                  <div className="flex items-center w-full gap-x-3 lg:gap-x-5">
                    <h1 className="text-sm font-bold">{data.preview.name}</h1>
                    {data.preview.isActive && (
                      <h2 className="text-xs font-semibold px-2 py-1 rounded-xl bg-warning-critical/10 text-warning-critical">
                        Active Incident
                      </h2>
                    )}
                  </div>
                  <PreviewRow label="Namespace:" value={data.preview.namespace} />
                  <PreviewRow label="Node:" value={data.preview.node} />
                  <PreviewRow label="Created:" value={data.preview.createdAt} />
                </section>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center lg:gap-x-1">
      <div className="flex items-center lg:gap-x-2">
        <figure className="w-2 h-2 bg-gray-400 rounded-full" />
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <span className="text-sm text-gray-600">{value}</span>
    </div>
  );
}
