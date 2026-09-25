"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import PageState from "@/components/PageState";
import { ChevronLeft, ExternalLink, CheckCircle2, Download, Share2 } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { useEnvironment } from "@/lib/environment-context";
import type { IncidentTimeline } from "@/lib/types";

// ─── DB-specific mock overlay ─────────────────────────────────────────────────
// When environment=Database, we show a MongoDB timeline instead of the default
// Cluster (PostgreSQL) one. In production, this would come from the API.

const DB_INCIDENT_OVERRIDES: Record<string, Partial<IncidentTimeline["incident"]>> = {
  "inc-db-3020": {
    id: "inc-db-3020",
    code: "INC-3020",
    title: "MongoDB Memory Usage Spike",
    severity: "Critical",
    status: "Recovered",
    duration: "23m 14s",
    startTime: "Aug 22, 2026 15:24:11",
    endTime: "Aug 22, 2026 15:41:56",
    affectedService: "pymt-svc",
  },
};

const DB_EVENTS_OVERRIDE = [
  {
    id: "db-evt-1",
    time: "15:15:08",
    title: "Memory Usage Spike",
    description: ["Memory utilization spiked creating pressure", "From 60% → 97% in mongodb-core"],
    color: "#FF0000",
    details: [
      { label: "Change by", value: "Jane Doe" },
      { label: "Type", value: "Query Anomaly" },
      { label: "Resource", value: "mongodb/core-cluster" },
    ],
  },
  {
    id: "db-evt-2",
    time: "15:18:42",
    title: "First Anomaly Detected",
    description: ["RAM usage > 95%, critical memory threshold breached", "Error rate raised to 97% (treshold: < 70%)"],
    color: "#F1272D",
    details: [
      { label: "Metric", value: "mongod.mem.usage" },
      { label: "Value", value: "97%" },
      { label: "Treshold", value: "<70%" },
    ],
  },
  {
    id: "db-evt-3",
    time: "15:19:02",
    title: "OOM Killer Triggered",
    description: ["Kernel killed mongod process, pod crashed", "OS-level OOM killer initiated due to extreme memory pressure"],
    color: "#F45B1B",
    details: [
      { label: "Affected Pods", value: "2" },
      { label: "Latency", value: "12.1s (440%)" },
      { label: "Error Rate", value: "34%" },
    ],
  },
  {
    id: "db-evt-4",
    time: "15:19:27",
    title: "Incident Detected",
    description: ["AKAR detected an incident and", "created INC-3020"],
    color: "#F39A18",
    details: [
      { label: "Severity", value: "Critical", valueColor: "text-red-500" },
      { label: "Impact", value: "High" },
      { label: "Status", value: "Open" },
    ],
  },
  {
    id: "db-evt-5",
    time: "15:27:13",
    title: "RCA Identified",
    description: ["Excessive MongoDB memory consumption", "confidence 94%"],
    color: "#F2C318",
    details: [
      { label: "Root Cause", value: "Cache build up" },
      { label: "Confidence", value: "94%" },
      { label: "Signals", value: "4 supporting, 1 contradicting" },
    ],
  },
  {
    id: "db-evt-6",
    time: "15:30:02",
    title: "Remediation Executed",
    description: ["Pod restarted with increased memory limits", "Rollback config change, increase memory limit to 35GB"],
    color: "#E9EE13",
    details: [
      { label: "Action", value: "restart pod + config update" },
      { label: "By", value: "John Doe" },
      { label: "Status", value: "Success", valueColor: "text-green-600" },
    ],
  },
  {
    id: "db-evt-7",
    time: "15:41:56",
    title: "Service Recovered",
    description: ["MongoDB pod stable and healthy", "Service health restored, memory limits increased"],
    color: "#36E51F",
    details: [
      { label: "Error Rate", value: "0%" },
      { label: "Latency", value: "240ms" },
      { label: "Status", value: "Recovered", valueColor: "text-green-600" },
    ],
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function statusStyle(status: string) {
  const s = status?.toLowerCase();
  if (s === "recovered" || s === "resolved") return { color: "text-emerald-600", icon: true };
  if (s === "in progress")                   return { color: "text-blue-600",    icon: false };
  if (s === "open")                          return { color: "text-orange-500",  icon: false };
  return { color: "text-slate-600", icon: false };
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function IncidentTimeline({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { environment } = useEnvironment();
  const isDb = environment === "Database";

  const { data, loading, error } = useApi(`timeline:${id}`, () =>
    api.incidents.timeline(id),
  );

  if (!data) {
    return (
      <main className="relative min-h-screen bg-slate-50 px-5 pb-8 pt-5 sm:px-7">
        <TopBar />
        <PageState loading={loading} error={error} />
      </main>
    );
  }

  // DB override: swap incident header + events if navigating from a DB incident
  const dbOverride = isDb ? DB_INCIDENT_OVERRIDES[id] : null;
  const incident = dbOverride
    ? { ...data.incident, ...dbOverride }
    : data.incident;
  const events = isDb && DB_INCIDENT_OVERRIDES[id] ? DB_EVENTS_OVERRIDE : data.events;

  const { color: statusColor, icon: showStatusIcon } = statusStyle(incident.status);

  return (
    <main className="relative min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#E8EDF9_45%,#CAD6F4_100%)] px-5 pb-10 pt-5 text-[#17294D] sm:px-7">
      <TopBar />

      {/* ── Header ── */}
      <header className="flex min-h-[56px] items-center justify-between gap-4 mb-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/private/incidents")}
            aria-label="Back to incidents"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <h1 className="shrink-0 text-xl font-bold text-slate-800 sm:text-2xl">
            {incident.code}
          </h1>
          <h2 className="min-w-0 truncate text-lg font-medium text-slate-700 sm:text-xl">
            {incident.title}
          </h2>
        </div>
        {/* Export + Share */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl bg-[#7B9AF2] px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#6F90EB] transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </header>

      {/* ── Meta bar ── */}
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm sm:grid-cols-3 xl:grid-cols-6">
        {/* Status */}
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Status</p>
          <p className={`flex items-center gap-1.5 text-sm font-semibold ${statusColor}`}>
            {showStatusIcon && <CheckCircle2 className="h-3.5 w-3.5 fill-current text-white" style={{ color: "#55B91B" }} />}
            <span className={statusColor}>{incident.status}</span>
          </p>
        </div>
        <MetaCell label="Severity" value={incident.severity} valueClass="text-red-500" />
        <MetaCell label="Duration"  value={incident.duration} />
        <MetaCell label="Start Time" value={incident.startTime} />
        <MetaCell label="End Time"  value={incident.endTime ?? "—"} />
        <MetaCell label="Affected Service" value={incident.affectedService} />
      </div>

      {/* ── Timeline section ── */}
      <div className="rounded-2xl border border-slate-100 bg-white px-5 py-6 shadow-sm sm:px-7">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">Incidents Timeline</h2>
          <p className="mt-1 text-xs text-slate-500">
            Chronological causal event playback, state transitions, and recovery tracking
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-[143px] top-[44px] hidden w-[5px] overflow-hidden rounded-full md:block"
            style={{ bottom: 44 }}>
            <div className="h-full w-full bg-gradient-to-b from-[#FF0000] via-[#F39A18] via-50% via-[#F2C318] to-[#36E51F]" />
          </div>

          <div className="space-y-4">
            {events.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 gap-3 md:grid-cols-[184px_20px_1fr] md:gap-0"
              >
                {/* Time + dot column */}
                <div className="relative hidden min-h-[88px] items-center md:flex">
                  <span
                    className="absolute right-[80px] text-sm font-bold"
                    style={{ color: item.color }}
                  >
                    {item.time}
                  </span>
                  <span
                    className="absolute left-[111px] top-1/2 h-[60px] w-[60px] -translate-y-1/2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                    style={{ backgroundColor: item.color }}
                  />
                </div>

                {/* Mobile time */}
                <div className="flex items-center gap-2 md:hidden">
                  <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.time}</span>
                </div>

                <div className="hidden md:block" />

                {/* Card */}
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_2px_10px_rgba(40,64,110,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(40,64,110,0.10)] md:min-h-[88px]">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1.5fr_auto] lg:items-center lg:gap-5">
                    {/* Title + description */}
                    <div className="min-w-0">
                      <h3
                        className="text-sm font-bold leading-5"
                        style={{ color: item.color }}
                      >
                        {item.title}
                      </h3>
                      <div className="mt-1.5 space-y-0.5 text-[11px] leading-5 text-slate-600">
                        {item.description.map((d) => (
                          <p key={d}>{d}</p>
                        ))}
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 gap-2 border-slate-200 sm:grid-cols-3 lg:border-l lg:pl-5">
                      {item.details.map((detail) => (
                        <div key={detail.label} className="min-w-0">
                          <p className="text-[10px] text-slate-400">{detail.label}</p>
                          <p className={`mt-1.5 break-words text-xs font-bold leading-4 ${detail.valueColor ?? "text-slate-800"}`}>
                            {detail.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* View Details */}
                    <Link
                      href={`/private/incidents/${id}/timeline/${item.id}`}
                      className="flex w-fit items-center gap-1.5 rounded-xl border border-[#9DBCF5] bg-[#EDF4FF] px-3.5 py-2 text-[11px] font-medium text-[#253856] transition hover:bg-[#E2EDFF] lg:ml-auto"
                    >
                      View Details
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function MetaCell({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 mb-1.5">{label}</p>
      <p className={`text-sm font-semibold ${valueClass ?? "text-slate-800"}`}>{value}</p>
    </div>
  );
}
