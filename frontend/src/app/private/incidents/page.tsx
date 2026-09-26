"use client";

import { useEffect, useState, useCallback, CSSProperties } from "react";
import IncidentCard from "@/components/IncidentCard";
import TopBar from "@/components/TopBar";
import type { IncidentHeader, ResourceKind } from "@/lib/types";
import '@xyflow/react/dist/style.css';
import { endpoint } from "@/lib/endpoint";
import { AlertCircle, ArrowRight, ShieldCheck, TriangleAlert } from "lucide-react";
import { useEnvironment } from "@/lib/environment-context";

export default function Incidents() {
  const { environment } = useEnvironment();
  const isDb = environment === "Database";
  const [type, setType] = useState<ResourceKind>("pods");
  const [incidentHeader, setIncidentHeader] = useState<IncidentHeader[] | null>(null);

  useEffect(() => {
    const fetchIncidentHeaders = async () => {
      const incidentHeader = await endpoint.get<IncidentHeader[]>(`/api/incident/header/all/get/6477801f-7386-4758-aad2-cc3c53c69605`);;
      
      setIncidentHeader(incidentHeader.data);
    }

    fetchIncidentHeaders();
  }, []);

  const resourceLabels: Record<ResourceKind, string> = {
    pods: "Pods Incidents",
    services: "Service Incidents",
    databases: "Database Incidents",
    clusters: "Cluster Incidents",
  };

  return (
    <main className="main-container">
      <TopBar />
      <section className="space-y-1 shrink-0">
        <h1 className="font-semibold text-lg">2D Spatial Topology & Incident Queue</h1>
      </section>
      <section className="flex w-full flex-1 min-h-0 pt-5 pb-2">
        <section className="w-1/2">
            {isDb ? <DatabaseTopology /> : <ClusterTopology />}
            {isDb && <DatabaseStatusCard />}
        </section>
        <section className="w-1/2 flex flex-col min-h-0">
          <div className="flex gap-x-2.5 pt-3.5 lg:gap-x-5 shrink-0">
            <button
              type="button"
              onClick={() => setType("pods")}
              className={`py-1 px-4 rounded-lg shadow-md cursor-pointer ${type === "pods" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
            >
              Pods
            </button>
            <button
              type="button"
              onClick={() => setType("services")}
              className={`py-1 px-4 rounded-lg shadow-md cursor-pointer ${type === "services" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => setType("databases")}
              className={`py-1 px-4 rounded-lg shadow-md cursor-pointer ${type === "databases" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
            >
              Databases
            </button>
            <button
              type="button"
              onClick={() => setType("clusters")}
              className={`py-1 px-4 rounded-lg shadow-md cursor-pointer ${type === "clusters" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
            >
              Clusters
            </button>
          </div>
          <div className="rounded-2xl flex-1 min-h-0 p-2 lg:space-y-1 lg:mt-4 lg:p-3">
            <div className="flex justify-between py-2 lg:py-3.5">
              <header className="flex items-center gap-x-3">
                <h1 className="font-bold leading-0 lg:text-lg">
                  {resourceLabels[type]}
                </h1>
                <p className="leading-0 text-sm font-semibold">{incidentHeader?.length ?? 0} Active Incidents</p>
              </header>
            </div>
            <div className={`overflow-y-auto h-full space-y-4 ${isDb ? 'lg:max-h-[450px]' : 'lg:max-h-[700px]'} lg:pt-3 lg:space-y-6`}>
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
      {isDb && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <HealthCard
            title="MongoDB Health"
            metrics={[
              { label: "CPU Usage",    value: "92%",    pct: 92, color: "red" },
              { label: "Memory Usage", value: "94%",    pct: 94, color: "red" },
              { label: "Query Rate",   value: "1.8k/s", pct: 60, color: "orange" },
              { label: "Avg Latency",  value: "42ms",   pct: 40, color: "red" },
            ]}
          />
          <HealthCard
            title="PosgreSQL Health"
            metrics={[
              { label: "CPU Usage",    value: "38%",   pct: 38, color: "green" },
              { label: "Memory Usage", value: "51%",   pct: 51, color: "green" },
              { label: "Query Rate",   value: "620/s", pct: 45, color: "green" },
              { label: "Avg Latency",  value: "12ms",  pct: 15, color: "green" },
            ]}
          />
          <AIInsightCard />
          <PerformanceCard />
        </div>
      )}
    </main>
  );
}

function DatabaseStatusCard() {
  const items = [
    { label: "Critical", count: 1, pct: 25, dot: "bg-red-500",    text: "text-red-500" },
    { label: "Degraded", count: 1, pct: 25, dot: "bg-orange-400", text: "text-orange-400" },
    { label: "Healthy",  count: 2, pct: 50, dot: "bg-blue-600",   text: "text-blue-600" },
  ];
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/90 p-6 shadow-[0_7px_22px_rgba(66,82,135,0.07)] backdrop-blur-sm w-fit mx-auto">
      <h3 className="text-[20px] font-bold text-[#111827]">Database Status</h3>
      <div className="mt-5 flex items-center">
        {items.map((it, i) => (
          <div key={it.label} className="flex items-center">
            <div className="flex items-center gap-3 px-2 sm:px-4">
              <span className={`h-6 w-6 flex-shrink-0 rounded-full ${it.dot}`} />
              <div>
                <p className="whitespace-nowrap text-[17px] font-bold text-[#111827]">
                  <span className={it.text}>{it.count}</span> {it.label}
                </p>
                <p className="mt-0.5 text-[13px] text-slate-400">{it.pct}%</p>
              </div>
            </div>
            {i < items.length - 1 && (
              <span className="mx-1 h-10 w-px flex-shrink-0 bg-slate-200 sm:mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const CUBE_FACES: Record<string, { top: string; front: string; right: string }> = {
  blue:   { top: "#cfe0ff,#9fb8f5", front: "#5c7de0,#3a56c4", right: "#3a56c4,#22348f" },
  red:    { top: "#ffc2bf,#f28b86", front: "#e2534d,#c23430", right: "#b93330,#8a1f1d" },
  orange: { top: "#fff3c4,#ffd27a", front: "#ffb347,#ff8a1e", right: "#ff9d33,#e6720f" },
  green:  { top: "#ddf7c4,#b3ea7c", front: "#8cd94a,#63b829", right: "#4f9c1e,#3a7415" },
  purple: { top: "#e6d9ff,#c6a8fb", front: "#a072e6,#7d49cf", right: "#7140b8,#54308f" },
};

const CUBE_GLOW_RGB: Record<string, string> = {
  blue: "150,170,255",
  red: "255,120,110",
  orange: "255,175,60",
  green: "140,230,110",
  purple: "190,140,255",
};

type CubeColour = keyof typeof CUBE_FACES;

function CubeUnit({
  colour = "blue",
  size = 80,
  top = 0,
  left = 0,
  z = 2,
  glow = false,
}: {
  colour?: CubeColour;
  size?: number;
  top?: number;
  left?: number;
  z?: number;
  glow?: boolean;
}) {
  const c = CUBE_FACES[colour] ?? CUBE_FACES.blue;
  const half = size / 2;
  const glowShadow = glow
    ? `0 0 ${size * 0.35}px ${size * 0.09}px rgba(${CUBE_GLOW_RGB[colour] ?? CUBE_GLOW_RGB.blue},.55)`
    : "none";

  const face: CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    boxShadow: glowShadow,
  };

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        transformStyle: "preserve-3d",
        transform: "rotateX(-30deg) rotateY(-45deg)",
        zIndex: z,
      }}
    >
      <div
        style={{
          ...face,
          transform: `rotateX(90deg) translateZ(${half}px)`,
          background: `linear-gradient(135deg, ${c.top})`,
          borderRadius: size * 0.04,
        }}
      />
      <div
        style={{
          ...face,
          transform: `translateZ(${half}px)`,
          background: `linear-gradient(180deg, ${c.front})`,
        }}
      />
      <div
        style={{
          ...face,
          transform: `rotateY(90deg) translateZ(${half}px)`,
          background: `linear-gradient(180deg, ${c.right})`,
        }}
      />
    </div>
  );
}


function Platform({
  w,
  h,
  top,
  left,
}: {
  w: number;
  h: number;
  top: number;
  left: number;
}) {
  const topFaceOffset = -(w - h) / 2;
  const ringInset = Math.max(4, w * 0.045);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: w,
        height: h,
        transformStyle: "preserve-3d",
        transform: "rotateX(-30deg) rotateY(-45deg)",
        zIndex: 1,
      }}
    >


      <div
        style={{
          position: "absolute",
          top: topFaceOffset,
          left: 0,
          width: w,
          height: w,
          transform: `rotateX(90deg) translateZ(${h / 2}px)`,
          borderRadius: w * 0.18,
          background: "linear-gradient(155deg,#5a78e6 0%, #2c3fae 55%, #1c2a86 100%)",
          boxShadow: "0 0 0 1px rgba(255,255,255,.06) inset",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: ringInset,
            borderRadius: w * 0.15,
            border: `${Math.max(1.5, w * 0.013)}px solid rgba(210,225,255,.9)`,
            boxShadow: `0 0 ${w * 0.04}px ${w * 0.008}px rgba(160,190,255,.9), 0 0 ${w * 0.09}px ${w * 0.03}px rgba(150,120,255,.5)`,
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
}


function Cube1({ colour = "blue", size = 80, platform = true }: { colour?: CubeColour; size?: number; platform?: boolean }) {
  const r = size / 150;
  return (
    <div style={{ position: "relative", width: 320 * r, height: 340 * r, perspective: 1200 }}>
      {platform && <Platform w={300 * r} h={900 * r} top={130 * r} left={20 * r} />}
      <CubeUnit colour={colour} size={180 * r} top={20 * r} left={85 * r} z={3} glow />
    </div>
  );
}

function Cube4({ colour = "blue", size = 110, platform = true }: { colour?: CubeColour; size?: number; platform?: boolean }) {
  const r = size / 150;
  return (
    <div style={{ position: "relative", width: 480 * r, height: 480 * r, perspective: 1400 }}>
      {platform && <Platform w={380 * r} h={60 * r} top={300 * r} left={50 * r} />}
      <CubeUnit colour={colour} size={150 * r} top={0} left={165 * r} z={2} />
      <CubeUnit colour={colour} size={150 * r} top={120 * r} left={35 * r} z={3} />
      <CubeUnit colour={colour} size={150 * r} top={120 * r} left={295 * r} z={3} />
      <CubeUnit colour="orange" size={150 * r} top={210 * r} left={165 * r} z={5} glow />
    </div>
  );
}

function StatusBubble({
  label, sub, type,
}: { label: string; sub: string; type: "healthy" | "warning" | "critical" }) {
  const base = "relative rounded-[14px] border px-4 py-2.5 text-center shadow-[0_10px_24px_rgba(56,78,145,0.13)] backdrop-blur-md";

  const borderColour =
    type === "critical" ? "border-red-300" : type === "warning" ? "border-orange-200" : "border-indigo-100";

  const tailEl = (
    <span
      className={`absolute left-1/2 top-full -mt-[7px] h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-b border-r bg-white/92 ${borderColour}`}
      style={{ borderTopColor: "transparent", borderLeftColor: "transparent" }}
    />
  );

  if (type === "critical") return (
    <div className={`${base} border-red-300 bg-white/92`}>
      <div className="flex items-center justify-center gap-1.5">
        <IconBadge type="critical" />
        <span className="text-[10px] font-bold text-red-600">{label}</span>
      </div>
      <p className="mt-0.5 text-[9px] text-red-500">{sub}</p>
      {tailEl}
    </div>
  );
  if (type === "warning") return (
    <div className={`${base} border-orange-200 bg-white/92`}>
      <div className="flex items-center justify-center gap-1.5">
        <IconBadge type="warning" />
        <span className="text-[10px] font-bold text-orange-600">{label}</span>
      </div>
      <p className="mt-0.5 text-[9px] text-orange-500">{sub}</p>
      {tailEl}
    </div>
  );
  return (
    <div className={`${base} border-indigo-100 bg-white/92`}>
      <div className="flex items-center justify-center gap-1.5">
        <IconBadge type="healthy" />
        <span className="text-[10px] font-bold text-blue-600">{label}</span>
      </div>
      <p className="mt-0.5 text-[9px] text-blue-500">{sub}</p>
      {tailEl}
    </div>
  );
}

function IconBadge({
  type,
  size = 20,
}: {
  type: "healthy" | "warning" | "critical";
  size?: number;
}) {
  const bg = type === "critical" ? "bg-red-500" : type === "warning" ? "bg-orange-500" : "bg-blue-600";
  const Icon = type === "critical" ? AlertCircle : type === "warning" ? TriangleAlert : ShieldCheck;

  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center rounded-full ${bg} shadow-[0_2px_6px_rgba(0,0,0,0.18)]`}
      style={{ width: size, height: size }}
    >
      <Icon
        className="text-white"
        style={{ width: size * 0.62, height: size * 0.62 }}
        strokeWidth={2.75}
        fill="white"
        fillOpacity={0.18}
      />
    </span>
  );
}

function ClusterTopology() {
  return (
    <div className="relative h-[760px] w-full select-none overflow-hidden lg:h-[780px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 100 560 760" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="warnGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
          </linearGradient>

          <filter id="lineGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d="M320 124 C100 362 150 412 76 470" fill="none" stroke="#94a3b8" strokeWidth="5" strokeDasharray="14 12" strokeLinecap="round" opacity="0.85" filter="url(#lineGlow)"/>
        <path d="M280 194 C530 392 410 412 484 470" fill="none" stroke="#94a3b8" strokeWidth="5" strokeDasharray="14 12" strokeLinecap="round" opacity="0.85" filter="url(#lineGlow)"/>
      </svg>

      <div className="absolute left-1/2 top-[48px] -translate-x-1/2">
        <Cube4 colour="blue" size={55} />
      </div>

      <div className="absolute left-1/2 top-[240px] -translate-x-1/2">
        <StatusBubble label="Pod: user-svc-4a2b1" sub="High Active Incident" type="warning" />
      </div>

      <div className="absolute left-[4px] top-[274px]">
        <StatusBubble label="Pod: user-svc-4a400" sub="Healthy" type="healthy" />
      </div>
      <div className="absolute right-[2px] top-[274px]">
        <StatusBubble label="Pod: auth-svc-9c1d2" sub="Healthy" type="healthy" />
      </div>

      <div className="absolute left-[26px] top-[386px]">
        <Cube4 colour="blue" size={30} />
      </div>
      <div className="absolute left-1/2 top-[326px] -translate-x-1/2">
        <Cube4 colour="blue" size={48} />
      </div>
      <div className="absolute right-[26px] top-[386px]">
        <Cube4 colour="blue" size={30} />
      </div>

      <div
        className="absolute left-1/2 top-[478px] h-[82px] w-[5px] -translate-x-1/2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, #94a3b8 0px, #94a3b8 14px, transparent 14px, transparent 26px)",
          borderRadius: "9999px",
          filter: "drop-shadow(0 0 4px rgba(148,163,184,0.5))",
        }}
      />

      <div className="absolute left-1/2 top-[560px] -translate-x-1/2">
        <Cube1 colour="orange" size={40} />
      </div>

      <div className="absolute bottom-[70px] left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="relative rounded-[14px] border border-orange-200 bg-white/92 px-5 py-2.5 text-center shadow-[0_10px_25px_rgba(249,115,22,0.18)] backdrop-blur-md">
          <div className="flex items-center justify-center gap-1.5">
            <IconBadge type="warning" />
            <span className="text-[10px] font-bold text-orange-600">Service: user-svc</span>
          </div>
          <p className="mt-0.5 text-[9px] text-orange-500">attention</p>
          <span
            className="absolute left-1/2 -top-[7px] h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-l border-t border-orange-200 bg-white/92"
          />
        </div>
      </div>
    </div>
  );
}


function DatabaseTopology() {
  return (
    <div className="mt-30 relative h-[260px] w-full select-none overflow-hidden sm:h-[280px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl" />

      <div className="absolute left-[18%] top-[20px]">
        <Cube1 colour="red" size={64} />
      </div>
      <div className="absolute right-[18%] top-[20px]">
        <Cube1 colour="blue" size={64} />
      </div>

      <div className="absolute left-[6%] top-[160px]">
        <div className="relative rounded-[18px] border border-red-300 bg-white/92 px-5 py-3.5 text-center shadow-lg backdrop-blur-md">
          <span className="absolute left-1/2 -top-[8px] h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-red-300 bg-white/92" />
          <div className="flex items-center gap-2">
            <IconBadge type="critical" size={24} />
            <span className="text-[13px] font-bold text-red-600">MongoDB</span>
          </div>
          <p className="mt-0.5 text-[11px] text-red-500">Critical Active Incident</p>
        </div>
      </div>
      <div className="absolute right-[6%] top-[160px]">
        <div className="relative rounded-[18px] border border-indigo-100 bg-white/92 px-5 py-3.5 text-center shadow-lg backdrop-blur-md">
          <span className="absolute left-1/2 -top-[8px] h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-indigo-100 bg-white/92" />
          <div className="flex items-center gap-2">
            <IconBadge type="healthy" size={24} />
            <span className="text-[13px] font-bold text-blue-600">PostgreSQL</span>
          </div>
          <p className="mt-0.5 text-[11px] text-blue-500">Healthy</p>
        </div>
      </div>
    </div>
  );
}

function HealthCard({
  title, metrics,
}: {
  title: string;
  metrics: { label: string; value: string; pct?: number; color: "red" | "green" | "orange" }[];
}) {
  const barCls = { red: "bg-red-500", green: "bg-lime-500", orange: "bg-orange-400" };
  return (
    <div className="rounded-[18px] border border-white/80 bg-white/90 p-5 shadow-[0_7px_22px_rgba(66,82,135,0.07)] backdrop-blur-sm">
      <h3 className="text-[13px] font-bold text-[#17264a]">{title}</h3>
      <div className="mt-3 space-y-3">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">{m.label}</span>
              <span className="text-[11px] font-bold text-slate-700">{m.value}</span>
            </div>
            {m.pct !== undefined && (
              <div className="mt-1 h-[3px] rounded-full bg-slate-200">
                <div className={`h-full rounded-full ${barCls[m.color]}`} style={{ width: `${m.pct}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


function AIInsightCard() {
  const chain = ["Memory Spike", "Cache Pressure", "Slow Queries"];
  return (
    <div className="rounded-[18px] border border-white/80 bg-white/90 p-5 shadow-[0_7px_22px_rgba(66,82,135,0.07)] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-[#17264a]">AKAR AI Insight</h3>
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[9px] font-bold text-indigo-600">
          High Confidence 93%
        </span>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
        <span className="font-bold text-red-600">MongoDB-prod is experiencing 2 correlated incidents.</span>{" "}
        High memory usage is likely contributing to increase query latency.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {chain.map((c, i) => (
          <span key={c} className="flex items-center gap-1.5">
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-bold text-red-500">{c}</span>
            {i < chain.length - 1 && <ArrowRight className="h-3 w-3 text-slate-300" />}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 w-full rounded-xl bg-[#17264a] px-4 py-2 text-[11px] font-bold text-white transition hover:bg-[#233761]"
      >
        View Investigation →
      </button>
    </div>
  );
}


function PerformanceCard() {
  const [tab, setTab] = useState("Overview");
  const rows = [
    { label: "Queries/sec",  value: "1.8k/s", color: "#ef4444", points: [4, 6, 5, 7, 8, 7, 9, 10] },
    { label: "Latency (ms)", value: "42ms",   color: "#f97316", points: [3, 4, 4, 5, 4, 6, 5, 6]  },
    { label: "Connections",  value: "312",    color: "#3b82f6", points: [2, 3, 3, 2, 4, 5, 5, 6]  },
  ];
  return (
    <div className="rounded-[18px] border border-white/80 bg-white/90 p-5 shadow-[0_7px_22px_rgba(66,82,135,0.07)] backdrop-blur-sm">
      <h3 className="text-[13px] font-bold text-[#17264a]">Database Performance</h3>
      <div className="mt-3 flex gap-1 rounded-lg bg-slate-100 p-1">
        {["Overview", "Queries", "Connections", "Resources"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-2 py-1 text-[9px] font-semibold transition ${
              tab === t ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400">{r.label}</p>
              <p className="text-[13px] font-bold" style={{ color: r.color }}>{r.value} ↗</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}