"use client";

import { useState, useMemo, type CSSProperties } from "react";
import Link from "next/link";
import PageState from "@/components/PageState";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { useEnvironment } from "@/lib/environment-context";
import type { IncidentListItem, ResourceKind } from "@/lib/types";
import {
  ChevronDown,
  CheckCircle2,
  Clock,
  RefreshCw,
  TriangleAlert,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";


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

function Cube3({ colour = "blue", size = 90, platform = true }: { colour?: CubeColour; size?: number; platform?: boolean }) {
  const r = size / 130;
  return (
    <div style={{ position: "relative", width: 380 * r, height: 300 * r, perspective: 1000 }}>
      {platform && <Platform w={300 * r} h={54 * r} top={170 * r} left={40 * r} />}
      <CubeUnit colour={colour} size={130 * r} top={0} left={105 * r} z={2} />
      <CubeUnit colour={colour} size={130 * r} top={95 * r} left={5 * r} z={3} />
      <CubeUnit colour={colour} size={130 * r} top={95 * r} left={225 * r} z={3} />
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


const CLUSTER_INCIDENTS: IncidentListItem[] = [
  {
    id: "inc-4082",
    code: "INC-4082",
    title: "Storage & DB Conn Failure",
    namespace: "postgresql-primary (Root Cause)",
    rootCauseLabel: "postgresql-primary",
    severity: "Critical",
    status: "In Progress",
    isActive: true,
    summary: "High error rate and pod restarts detected",
    occurredAgo: "4 mins ago",
    metrics: { cpu: 92, memory: 87, restarts: 6, confidence: 94 },
    workflowStatus: "In Progress",
  },
  {
    id: "inc-user",
    code: "",
    title: "user-svc-4a2b1",
    namespace: "postgresql-primary (Root Cause)",
    rootCauseLabel: "postgresql-primary",
    severity: "High",
    status: "Open",
    isActive: true,
    summary: "High latency from upstream service",
    occurredAgo: "4 mins ago",
    metrics: { cpu: 76, memory: 68, restarts: 2, confidence: 87 },
    workflowStatus: "Not Started",
  },
  {
    id: "inc-auth",
    code: "",
    title: "auth-svc-9c1d2",
    namespace: "default",
    rootCauseLabel: "default",
    severity: "Low",
    status: "Resolved",
    isActive: false,
    summary: "Running normally",
    occurredAgo: "1 hour ago",
    metrics: { cpu: 54, memory: 62, restarts: 0, confidence: 96 },
    workflowStatus: "Completed",
  },
  {
    id: "inc-inv",
    code: "",
    title: "inventory-svc-9c1d2",
    namespace: "default",
    rootCauseLabel: "default",
    severity: "Low",
    status: "Resolved",
    isActive: false,
    summary: "Running normally",
    occurredAgo: "1 hour ago",
    metrics: { cpu: 54, memory: 62, restarts: 0, confidence: 96 },
    workflowStatus: "Completed",
  },
];

const DB_INCIDENTS: IncidentListItem[] = [
  {
    id: "inc-db-4082",
    code: "INC-4082",
    title: "Storage & DB Conn Failure",
    namespace: "postgresql-primary (Root Cause)",
    rootCauseLabel: "postgresql-primary",
    severity: "Critical",
    status: "In Progress",
    isActive: true,
    summary: "High error rate and database error detected",
    occurredAgo: "4 mins ago",
    metrics: { cpu: 92, memory: 87, restarts: 6, confidence: 94 },
    workflowStatus: "In Progress",
  },
  {
    id: "inc-db-3020",
    code: "INC-3020",
    title: "mongod-1 Out of Memory",
    namespace: "mongo-1 (Root Cause)",
    rootCauseLabel: "mongo-1",
    severity: "Critical",
    status: "In Progress",
    isActive: true,
    summary: "High error rate and database error detected",
    occurredAgo: "30 mins ago",
    metrics: { cpu: 90, memory: 97, restarts: 4, confidence: 94 },
    workflowStatus: "In Progress",
  },
  {
    id: "inc-db-user",
    code: "",
    title: "user-svc-4a2b1",
    namespace: "postgresql-primary (Root Cause)",
    rootCauseLabel: "postgresql-primary",
    severity: "High",
    status: "Open",
    isActive: true,
    summary: "High latency from upstream service",
    occurredAgo: "4 mins ago",
    metrics: { cpu: 76, memory: 68, restarts: 2, confidence: 87 },
    workflowStatus: "Not Started",
  },
  {
    id: "inc-db-inv",
    code: "",
    title: "inventory-svc-9c1d2",
    namespace: "default",
    rootCauseLabel: "default",
    severity: "Low",
    status: "Resolved",
    isActive: false,
    summary: "Running normally",
    occurredAgo: "1 hour ago",
    metrics: { cpu: 54, memory: 62, restarts: 0, confidence: 96 },
    workflowStatus: "Completed",
  },
];

const DB_EXTRA_INCIDENTS = [
  {
    id: "db-mongo-mem",
    title: "MongoDB – Memory Usage Spike",
    description: "CPU usage on primary node has been consistantly above 90% for 15 minutes",
    severity: "Critical",
    db: "MongoDB-prod",
    role: "Primary",
    ago: "4 mins ago",
    status: "Active",
    workflow: "Progress",
  },
  {
    id: "db-psql-conn",
    title: "PostgreSQL – Connection Timeout Errors",
    description: "The database is unable to handle incoming connections because of connection errors",
    severity: "Critical",
    db: "MongoDB-prod",
    role: "Primary",
    ago: "4 mins ago",
    status: "Active",
    workflow: "Progress",
  },
  {
    id: "db-mongo-rep",
    title: "MongoDB – Replication Log",
    description: "Secondary node lagging behind primary by 5+ minutes",
    severity: "Medium",
    db: "MongoDB-prod",
    role: "Secondary",
    ago: "17 mins ago",
    status: "Active",
    workflow: "Not Started",
  },
];


function severityStyle(s: string) {
  if (s === "Critical") return { border: "border-red-400",    accent: "bg-red-500",    soft: "bg-red-50",    text: "text-red-600",    badgeBg: "bg-red-500 text-white" };
  if (s === "High")     return { border: "border-orange-400", accent: "bg-orange-400", soft: "bg-orange-50", text: "text-orange-600", badgeBg: "bg-orange-400 text-white" };
  return                       { border: "border-lime-500",   accent: "bg-lime-500",   soft: "bg-lime-50",   text: "text-lime-600",   badgeBg: "bg-lime-500 text-white" };
}

function cubeColourFromSeverity(s: string): CubeColour {
  if (s === "Critical") return "red";
  if (s === "High")     return "orange";
  return "green";
}


function WorkerDropdown({ workers, selected, onChange }: { workers: string[]; selected: string; onChange: (w: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative z-40 w-fit">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 min-w-[136px] items-center justify-between gap-4 rounded-xl border border-white/90 bg-white/85 px-4 text-[12px] font-semibold text-slate-800 shadow-[0_8px_25px_rgba(75,90,150,0.08)] backdrop-blur-md transition hover:bg-white"
      >
        {selected}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
          {workers.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => { onChange(w); setOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-[12px] transition hover:bg-slate-50 ${w === selected ? "bg-indigo-50 font-semibold text-indigo-600" : "text-slate-700"}`}
            >
              {w}
            </button>
          ))}
        </div>
      )}
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
    <div className="relative h-[260px] w-full select-none overflow-hidden sm:h-[280px]">
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


function MetricBar({ label, value, type }: { label: string; value: number; type: "red" | "orange" | "green" }) {
  const bar  = type === "red" ? "bg-red-500" : type === "orange" ? "bg-orange-400" : "bg-lime-500";
  const text = type === "red" ? "text-red-600" : type === "orange" ? "text-orange-500" : "text-lime-600";
  return (
    <div className="min-w-0">
      <p className="truncate text-[8px] text-slate-400">{label}</p>
      <p className={`text-[10px] font-bold ${text}`}>{value}%</p>
      <div className="mt-0.5 h-[3px] rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function workflowBadge(ws: string) {
  if (ws === "In Progress" || ws === "Progress") return "bg-indigo-100 text-indigo-600";
  if (ws === "Completed")  return "bg-lime-100 text-lime-600";
  return "bg-slate-100 text-slate-500";
}

function IncidentCard({ incident }: { incident: IncidentListItem }) {
  const style  = severityStyle(incident.severity);
  const colour = cubeColourFromSeverity(incident.severity);
  return (
    <Link
      href={`/private/incidents/${incident.id}`}
      className={`group flex min-h-[130px] overflow-hidden rounded-[18px] border-2 bg-white/90 shadow-[0_7px_22px_rgba(66,82,135,0.07)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(66,82,135,0.12)] ${style.border}`}
    >
      <div className={`w-2.5 flex-shrink-0 ${style.accent}`} />

      <div className={`flex w-[105px] flex-shrink-0 items-center justify-center overflow-visible ${style.soft}`}>
        <Cube3 colour={colour} size={26} platform={false} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[12px] font-bold text-[#17264a]">
              {incident.code ? `${incident.code}: ` : ""}{incident.title}
            </h3>
            <p className="mt-0.5 truncate text-[9px] text-slate-400">
              Namespace: <span className="font-semibold text-red-500">{incident.namespace}</span>
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
            <span className={`rounded-full px-3 py-1 text-[8px] font-bold ${incident.isActive ? "bg-indigo-50 text-indigo-600" : "bg-lime-100 text-lime-600"}`}>
              {incident.isActive ? "Active" : "Resolved"}
            </span>
            <span className="flex items-center gap-1 text-[8px] text-slate-400">
              <Clock className="h-2.5 w-2.5" />{incident.occurredAgo}
            </span>
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold ${style.soft} ${style.text}`}>
            {incident.severity.toUpperCase()}
          </span>
          <span className="truncate text-[9px] text-slate-500">{incident.summary}</span>
        </div>

        <div className="mt-2.5 grid grid-cols-4 gap-2">
          <MetricBar label="CPU Usage"    value={incident.metrics.cpu}        type="red"    />
          <MetricBar label="Memory Usage" value={incident.metrics.memory}     type="orange" />
          <div className="min-w-0">
            <p className="text-[8px] text-slate-400">Restarts</p>
            <p className="text-[10px] font-bold text-slate-700">{incident.metrics.restarts}</p>
          </div>
          <MetricBar label="Confidence"   value={incident.metrics.confidence} type="green"  />
        </div>
      </div>

      <div className="flex flex-shrink-0 items-end px-2 pb-3">
        <span className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[8px] font-bold ${workflowBadge(incident.workflowStatus)}`}>
          {incident.workflowStatus === "Completed"  && <CheckCircle2 className="h-2.5 w-2.5" />}
          {incident.workflowStatus === "In Progress"&& <RefreshCw   className="h-2.5 w-2.5" />}
          {incident.workflowStatus === "In Progress" ? "Progress" : incident.workflowStatus}
        </span>
      </div>
    </Link>
  );
}

function DbExtraCard({ inc }: { inc: typeof DB_EXTRA_INCIDENTS[0] }) {
  const isCrit   = inc.severity === "Critical";
  const isMedium = inc.severity === "Medium";
  const border   = isCrit ? "border-red-300" : isMedium ? "border-amber-300" : "border-slate-200";
  const softBg   = isCrit ? "bg-red-50" : isMedium ? "bg-amber-50" : "bg-slate-50";
  const badgeCls = isCrit ? "bg-red-500 text-white" : isMedium ? "bg-amber-400 text-white" : "bg-slate-400 text-white";
  const colour: CubeColour = isCrit ? "red" : isMedium ? "orange" : "blue";
  const workflowCls = inc.workflow === "Progress" ? "bg-indigo-100 text-indigo-600" : inc.workflow === "Not Started" ? "bg-slate-100 text-slate-500" : "bg-lime-100 text-lime-600";
  return (
    <div className={`flex overflow-hidden rounded-[18px] border-2 bg-white/90 shadow-[0_7px_22px_rgba(66,82,135,0.07)] backdrop-blur-sm ${border}`}>
      <div className={`flex w-[95px] flex-shrink-0 items-center justify-center overflow-hidden ${softBg}`}>
        <Cube1 colour={colour} size={36} platform={false} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[11px] font-bold text-[#17264a]">{inc.title}</h3>
            <p className="mt-0.5 truncate text-[9px] text-slate-400">{inc.description}</p>
          </div>
          <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[8px] font-bold ${inc.status === "Active" ? "bg-indigo-50 text-indigo-600" : "bg-lime-100 text-lime-600"}`}>
            {inc.status}
          </span>
        </div>
        <div className="mt-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold ${badgeCls}`}>
            {inc.severity.toUpperCase()}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[8px] text-slate-400">
            <span>⊡ {inc.db}</span>
            <span>⊙ {inc.role}</span>
            <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{inc.ago}</span>
          </div>
          <span className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[8px] font-bold ${workflowCls}`}>
            {inc.workflow === "Progress" && <RefreshCw className="h-2.5 w-2.5"/>}
            {inc.workflow === "Progress" ? "▶ Progress" : inc.workflow === "Not Started" ? "▶ Not Started" : inc.workflow}
          </span>
        </div>
      </div>
    </div>
  );
}


function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 120, h = 28;
  const max = Math.max(...points), min = Math.min(...points);
  const norm = (v: number) => h - ((v - min) / (max - min || 1)) * h;
  const d = points.map((p, i) => `${(i / (points.length - 1)) * w},${norm(p)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


function DatabaseStatusCard() {
  const items = [
    { label: "Critical", count: 1, pct: 25, dot: "bg-red-500",    text: "text-red-500" },
    { label: "Degraded", count: 1, pct: 25, dot: "bg-orange-400", text: "text-orange-400" },
    { label: "Healthy",  count: 2, pct: 50, dot: "bg-blue-600",   text: "text-blue-600" },
  ];
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/90 p-6 shadow-[0_7px_22px_rgba(66,82,135,0.07)] backdrop-blur-sm">
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
            <Sparkline points={r.points} color={r.color} />
          </div>
        ))}
      </div>
    </div>
  );
}


type ResourceTab = "Pods" | "Services" | "Databases" | "Cluster";

export default function IncidentsPage() {
  const { environment } = useEnvironment();
  const isDb = environment === "Database";

  const [worker, setWorker] = useState<string>("worker-01");
  const [activeTab, setActiveTab] = useState<ResourceTab>(isDb ? "Databases" : "Pods");
  const [kind] = useState<ResourceKind>("pods");

  const { data, loading, error } = useApi(
    `incidents:${worker}:${kind}`,
    () => api.incidents.list({ worker, kind }),
  );

  const baseIncidents = useMemo(() => data?.incidents ?? [], [data?.incidents]);
  const workers       = useMemo(() => data?.workers ?? ["worker-01", "worker-02"], [data?.workers]);
  const activeCount   = useMemo(() => baseIncidents.filter((i) => i.isActive).length, [baseIncidents]);
  const displayIncidents: IncidentListItem[] = useMemo(
    () => (isDb ? DB_INCIDENTS : (baseIncidents.length ? baseIncidents : CLUSTER_INCIDENTS)),
    [isDb, baseIncidents],
  );

  const TABS: { key: ResourceTab; count: number }[] = [
    { key: "Pods",      count: isDb ? 4 : (baseIncidents.length || CLUSTER_INCIDENTS.length) },
    { key: "Services",  count: 3 },
    { key: "Databases", count: 4 },
    { key: "Cluster",   count: 2 },
  ];

  const incidentLabel = isDb ? "Database Incidents" : `${activeTab} Incidents`;
  const shownActive   = isDb ? 2 : activeCount;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#E8EDF9_45%,#CAD6F4_100%)] text-[#17264a]">

      <div className="px-5 pb-8 pt-4 lg:px-8 lg:pt-5 xl:px-10">
        <h1 className="text-[21px] font-bold tracking-[-0.025em] text-[#111827] sm:text-[22px]">
          3D Spatial Topology &amp; Incident Queue
        </h1>

        <div className="mt-4 grid grid-cols-1 items-center gap-4 xl:grid-cols-[minmax(460px,0.9fr)_minmax(540px,1.1fr)] xl:gap-8">
          <div>
            <WorkerDropdown workers={workers} selected={worker} onChange={setWorker} />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex h-9 flex-shrink-0 items-center rounded-full px-4 text-[10px] font-semibold transition sm:px-5 sm:text-[11px] ${
                    active
                      ? "bg-blue-600 text-white shadow-[0_6px_18px_rgba(37,99,235,0.25)]"
                      : "border border-white/80 bg-white/85 text-slate-600 shadow-sm hover:border-blue-200 hover:bg-white"
                  }`}
                >
                  {tab.key} ({tab.count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(460px,0.9fr)_minmax(540px,1.1fr)] xl:gap-8">
          <section className="min-w-0 space-y-6">
            {isDb ? <DatabaseTopology /> : <ClusterTopology />}
            {isDb && <DatabaseStatusCard />}
          </section>

          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold text-[#17264a] sm:text-[17px]">{incidentLabel}</h2>
                <span className="flex items-center gap-1.5 text-[9px] font-semibold text-red-500 sm:text-[10px]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  {shownActive} Active Incidents
                </span>
              </div>
              <button type="button" className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-700 sm:text-[11px]">
                View More <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <PageState loading={loading} error={error} empty={false} />

            {!isDb && (
              <div className="space-y-3">
                {displayIncidents.map((inc) => <IncidentCard key={inc.id} incident={inc} />)}
              </div>
            )}

            {isDb && (
              <div className="space-y-3">
                {DB_EXTRA_INCIDENTS.map((inc) => <DbExtraCard key={inc.id} inc={inc} />)}
              </div>
            )}
          </section>
        </div>

      
        {isDb && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
      </div>
    </main>
  );
}