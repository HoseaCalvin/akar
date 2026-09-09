"use client";

import { useRef, useState, type Dispatch, type PointerEvent, type SetStateAction, type WheelEvent } from "react";
import { ChevronLeft, Minus, Plus, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import TableDetail from "@/components/TableDetail";
import PageState from "@/components/PageState";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import type { LiveTopologyEdge, LiveTopologyEntity } from "@/lib/types";

const lanes = ["NODE", "DEPLOYMENT", "SERVICE", "POD"];

function presentationEdges(edges: LiveTopologyEdge[]) {
  const byPod = new Map<string, { node?: string; deployment?: string; services: string[] }>();
  for (const edge of edges) {
    const value = byPod.get(edge.target) || { services: [] };
    if (edge.relationship_type === "HOSTS") value.node = edge.source;
    if (edge.relationship_type === "OWNS") value.deployment = edge.source;
    if (edge.relationship_type === "ROUTES_TO") value.services.push(edge.source);
    byPod.set(edge.target, value);
  }
  const visual = new Map<string, LiveTopologyEdge>();
  for (const [pod, value] of byPod) {
    if (value.node && value.deployment) visual.set(`${value.node}-${value.deployment}`, { source: value.node, target: value.deployment, relationship_type: "HOSTS_DEPLOYMENT" });
    if (value.deployment && value.services.length === 0) visual.set(`${value.deployment}-${pod}`, { source: value.deployment, target: pod, relationship_type: "OWNS" });
    for (const service of value.services) {
      if (value.deployment) visual.set(`${value.deployment}-${service}`, { source: value.deployment, target: service, relationship_type: "SERVES" });
      visual.set(`${service}-${pod}`, { source: service, target: pod, relationship_type: "ROUTES_TO" });
    }
  }
  return [...visual.values()];
}

function statusColor(status: string) {
  return status === "HEALTHY" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700";
}

export default function Inventory() {
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<string>();
  const { data, loading, error } = useApi("topology", api.monitor.topology);
  const entities = data?.entities || [];
  const names = new Map<string, string>(entities.map((entity): [string, string] => [entity.id, entity.name]));
  if (data) names.set(data.cluster.id, data.cluster.name);
  const count = (kind: string) => entities.filter((entity) => entity.kind === kind).length;
  const graphEdges = presentationEdges(data?.edges || []);
  const visibleEdges = selected ? graphEdges.filter((edge) => edge.source === selected || edge.target === selected) : graphEdges;

  return (
    <main className="relative flex min-h-full flex-col px-7 py-5 bg-slate-50">
      <TopBar />
      <section className="flex items-center gap-2 pb-8">
        <button 
          onClick={() => router.push("/private/dashboard")} 
          className="p-2 rounded-lg hover:bg-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">Cluster Topology</h1>
      </section>
      <TableDetail counts={{ inventory: entities.length, pods: count("POD"), services: count("SERVICE"), nodes: count("NODE"), deployments: count("DEPLOYMENT"), namespaces: new Set(entities.map((entity) => entity.namespace).filter(Boolean)).size }}>
        <PageState loading={loading} error={error} empty={!loading && entities.length === 0} />
        {data && <section className="mt-6 space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-800">{data.cluster.name}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">{new Date(data.observed_at).toLocaleString()}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">{data.edges.length} relationships</span>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setZoom((value) => Math.max(0.65, value - 0.15))} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><Minus size={16} className="text-slate-600" /></button>
              <span className="w-10 text-center text-sm text-slate-600">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom((value) => Math.min(1.5, value + 0.15))} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><Plus size={16} className="text-slate-600" /></button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button type="button" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); setSelected(undefined); }} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><RotateCcw size={16} className="text-slate-600" /></button>
            </div>
          </header>
          <TopologyGraph entities={entities} edges={graphEdges} selected={selected} zoom={zoom} setZoom={setZoom} pan={pan} setPan={setPan} onSelect={setSelected} />
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-800 mb-1">{selected ? `Connected to ${names.get(selected) || selected}` : "Relationship map"}</h2>
            <p className="text-sm text-slate-500 mb-4">Click an entity to highlight its connections.</p>
            <div className="grid max-h-72 gap-2 overflow-y-auto lg:grid-cols-2">
              {visibleEdges.map((edge) => <div key={`${edge.source}-${edge.target}-${edge.relationship_type}`} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <span className="font-medium text-slate-800">{names.get(edge.source) || edge.source}</span> <span className="text-slate-400 mx-1">→</span> <span className="font-medium text-slate-800">{names.get(edge.target) || edge.target}</span> <span className="ml-2 text-xs text-slate-400 uppercase">{edge.relationship_type}</span>
              </div>)}
            </div>
          </section>
        </section>}
      </TableDetail>
    </main>
  );
}

function TopologyGraph({ entities, edges, selected, zoom, setZoom, pan, setPan, onSelect }: { entities: LiveTopologyEntity[]; edges: LiveTopologyEdge[]; selected?: string; zoom: number; setZoom: Dispatch<SetStateAction<number>>; pan: { x: number; y: number }; setPan: Dispatch<SetStateAction<{ x: number; y: number }>>; onSelect: (id?: string) => void }) {
  const drag = useRef<{ x: number; y: number } | undefined>(undefined);
  const grouped = lanes.map((kind) => entities.filter((entity) => entity.kind === kind));
  const height = Math.max(620, Math.max(...grouped.map((items) => items.length)) * 82 + 130);
  const positions = new Map<string, { x: number; y: number; lane: number }>();
  grouped.forEach((items, lane) => items.forEach((entity, index) => positions.set(entity.id, { x: 130 + lane * 300, y: 100 + index * 82, lane })));
  const related = new Set(edges.filter((edge) => !selected || edge.source === selected || edge.target === selected).flatMap((edge) => [edge.source, edge.target]));
  const drawable = edges.filter((edge) => positions.has(edge.source) && positions.has(edge.target));
  const color = (relationship: string) => relationship === "ROUTES_TO" ? "#7C3AED" : relationship === "SERVES" || relationship === "OWNS" ? "#16A34A" : "#2563EB";
  const dash = (relationship: string) => relationship === "SERVES" ? "6 4" : relationship === "HOSTS_DEPLOYMENT" ? "2 4" : undefined;
  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY };
    onSelect();
  };
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const previous = drag.current;
    drag.current = { x: event.clientX, y: event.clientY };
    setPan((value) => ({ x: value.x + event.clientX - previous.x, y: value.y + event.clientY - previous.y }));
  };
  const endDrag = () => { drag.current = undefined; };
  const wheelZoom = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoom((value) => Math.min(1.5, Math.max(0.65, value + (event.deltaY < 0 ? 0.1 : -0.1))));
  };

  return <section onWheel={wheelZoom} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} className="select-none overflow-hidden rounded-xl border border-slate-200 bg-white p-6 touch-none cursor-grab active:cursor-grabbing">
    <div className="min-w-[1100px] origin-top-left transition-transform" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, width: `${100 / zoom}%` }}>
      <div className="mx-auto mb-4 w-fit rounded-lg border border-slate-200 bg-slate-50 px-5 py-2 text-center text-xs text-slate-600">Cluster topology</div>
      <div className="grid grid-cols-4 text-center text-xs font-medium uppercase tracking-wide text-slate-400 mb-3">{lanes.map((lane, index) => <span key={lane}>{lane.toLowerCase()}s ({grouped[index].length})</span>)}</div>
      <div className="relative" style={{ height }}>
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 1160 ${height}`} preserveAspectRatio="none">
          <defs><marker id="topology-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 1 1 L 8 5 L 1 9" fill="none" stroke="context-stroke" strokeWidth="1.5" /></marker><filter id="topology-glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          {drawable.map((edge) => {
            const source = positions.get(edge.source)!; const target = positions.get(edge.target)!;
            const active = !selected || edge.source === selected || edge.target === selected;
            const direction = Math.sign(target.x - source.x) || 1;
            const startX = source.x + direction * 104; const endX = target.x - direction * 104; const curve = Math.abs(endX - startX) / 2;
            return <path key={`${edge.source}-${edge.target}-${edge.relationship_type}`} d={`M ${startX} ${source.y} C ${startX + direction * curve} ${source.y}, ${endX - direction * curve} ${target.y}, ${endX} ${target.y}`} stroke={color(edge.relationship_type)} strokeDasharray={dash(edge.relationship_type)} strokeWidth={active ? 2 : 1} opacity={active ? 0.8 : 0.1} fill="none" markerEnd="url(#topology-arrow)" filter={selected && active ? "url(#topology-glow)" : undefined} />;
          })}
        </svg>
        {grouped.flatMap((items) => items).map((entity) => {
          const position = positions.get(entity.id)!;
          return <button type="button" key={entity.id} onClick={() => onSelect(entity.id)} style={{ left: `${(position.x / 1160) * 100}%`, top: position.y - 28 }} className={`absolute w-52 -translate-x-1/2 rounded-lg border px-3 py-2 text-left text-sm transition-shadow ${statusColor(entity.status)} ${selected === entity.id ? "ring-2 ring-blue-400 shadow-md" : selected && related.has(entity.id) ? "ring-1 ring-blue-300" : selected ? "opacity-30" : "hover:shadow-md"}`}>
            <div className="truncate font-medium">{entity.name}</div><div className="mt-0.5 truncate text-xs opacity-70">{entity.namespace || "cluster"} | {entity.status}</div>
          </button>;
        })}
      </div>
    </div>
  </section>;
}
