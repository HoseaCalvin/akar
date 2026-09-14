"use client";

import { useEffect, useState, useCallback } from "react";
import IncidentCard from "@/components/IncidentCard";
import TopBar from "@/components/TopBar";
import PageState from "@/components/PageState";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import type { IncidentHeader, ResourceKind } from "@/lib/types";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { endpoint } from "@/lib/endpoint";

export default function Incidents() {
  const initialNodes = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Pod 1' } },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Pod 2' } },
    { id: 'n3', position: { x: -150, y: 180 }, data: { label: 'Pod 3' } },
    { id: 'n4', position: { x: 150, y: 180 }, data: { label: 'Pod 4' } },
    { id: 'n5', position: { x: 0, y: 280 }, data: { label: 'Pod 5' } },
   ];
  const initialEdges = [
    { id: 'n1-n2', source: 'n1', target: 'n2' },
    { id: 'n1-n3', source: 'n2', target: 'n3' },
    { id: 'n2-n4', source: 'n2', target: 'n4' },
    { id: 'n3-n5', source: 'n3', target: 'n5' },
    { id: 'n4-n5', source: 'n4', target: 'n5' },
  ];

  const [type, setType] = useState<ResourceKind>("pods");
  const [worker, setWorker] = useState<string>("");
  const [incidentHeader, setIncidentHeader] = useState<IncidentHeader[] | null>(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onNodesChange = useCallback((changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
  const onConnect = useCallback((params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);
 
  const { data } = useApi(`incidents:${type}:${worker}`, () =>
    api.incidents.list({ kind: type, worker: worker || undefined }),
  );

  useEffect(() => {
    const fetchIncidentHeaders = async () => {
      const incidentHeader = await endpoint.get<IncidentHeader[]>(`/api/incident/header/all/get/6477801f-7386-4758-aad2-cc3c53c69605`);;
      
      setIncidentHeader(incidentHeader.data);
    }

    fetchIncidentHeaders();
  }, []);

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
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodesDraggable={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            nodesConnectable={false}
          />
        </section>
        <section className="w-1/2 flex flex-col min-h-0">
          <div className="flex gap-x-2.5 pt-3.5 lg:gap-x-5 shrink-0">
            <button
              type="button"
              onClick={() => setType("pods")}
              className={`bg-white py-1 px-4 rounded-lg shadow-md cursor-pointer ${type === "pods" ? "ring-2 ring-blue-400" : ""}`}
            >
              Pods
            </button>
            <button
              type="button"
              onClick={() => setType("services")}
              className={`bg-white py-1 px-4 rounded-lg shadow-md cursor-pointer ${type === "services" ? "ring-2 ring-blue-400" : ""}`}
            >
              Services
            </button>
          </div>
          <div className="rounded-2xl flex-1 min-h-0 p-2 lg:space-y-1 lg:mt-4 lg:p-3">
            <div className="flex justify-between py-2 lg:py-3.5">
              <header className="flex items-center gap-x-3">
                <h1 className="font-bold leading-0 lg:text-lg">
                  {type === "pods" ? "Pods Incidents" : "Service Incidents"}
                </h1>
                <p className="leading-0 text-sm font-semibold">{incidentHeader?.length ?? 0} Active Incidents</p>
              </header>
            </div>
            <div className="overflow-y-auto h-full space-y-4 lg:max-h-[700px] lg:py-3 lg:space-y-6">
              {incidentHeader?.map((incident) => (
                <IncidentCard 
                  key={incident.id}
                  id={incident.id} 
                  code={incident.code}
                  title={incident.title}
                  namespace={incident.namespace}
                  severity={incident.severity}
                  status={incident.status}
                  cause={incident.cause}
                  cpu_usage={incident.cpu_usage}
                  memory_usage={incident.memory_usage}
                  restart_count={incident.restart_count}
                  confidence={incident.confidence}
                  start_time={incident.start_time}
                  end_time={incident.end_time}
                  affected_service={incident.affected_service} 
                />
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
