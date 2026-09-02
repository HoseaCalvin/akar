"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import PageState from "@/components/PageState";
import Sparkline from "@/components/Sparkline";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import type { LogLevel } from "@/lib/types";

const logClass: Record<LogLevel, string> = {
  info: "text-[#B6A98B]",
  error: "text-[#FF6565]",
  warn: "text-slate-400",
  debug: "text-[#61B7E8]",
};

const toneClass = {
  critical: "text-[#D94A43]",
  ok: "text-[#258B73]",
  muted: "text-slate-500",
};

export default function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useApi(`resource:${id}`, () =>
    api.monitor.resource(id),
  );

  if (!data) {
    return (
      <main className="relative min-h-screen px-7 pb-8 pt-5">
        <TopBar />
        <PageState loading={loading} error={error} />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-7 pb-8 pt-5 text-[#243654]">
      <section className="flex min-h-[72px] items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/private/monitor/inventory")}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0F214B] transition hover:bg-white/70"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="truncate text-2xl font-bold tracking-tight text-[#0F214B] md:text-3xl">
            {data.name}
          </h1>
        </div>
        <div className="shrink-0">
          <TopBar />
        </div>
      </section>

      <section className="mt-7 rounded-2xl border border-white/70 bg-white/65 px-8 py-4 shadow-[0_8px_20px_rgba(42,72,140,0.12)]">
        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 xl:grid-cols-5">
          <InfoBlock label="NAMESPACE" title={data.namespace} subtitle={`Cluster: ${data.cluster}`} />
          <InfoBlock label="NODE HOST" title={data.nodeHost} subtitle={`IP: ${data.ip}`} />
          <InfoBlock label="IMAGE / VERSION" title={data.image} subtitle={`Uptime: ${data.uptime}`} />
          <div>
            <p className="text-xs font-bold tracking-wider text-slate-500">ACTIVE INCIDENTS</p>
            {data.linkedIncident ? (
              <>
                <h3 className="mt-3 font-bold text-[#D94A43]">1 Incident Linked</h3>
                <p className="mt-2 text-sm text-[#B84A45]">
                  {data.linkedIncident.code} ({data.linkedIncident.label})
                </p>
              </>
            ) : (
              <h3 className="mt-3 font-bold">None</h3>
            )}
          </div>
          {data.linkedIncident && (
            <div className="flex justify-start xl:justify-end">
              <Link
                href={`/private/incidents/${data.linkedIncident.id}/investigation`}
                className="rounded-xl border border-[#9CB8E8] bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                View Investigation ↗
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-[#243654]">Live Resource Metrics & Anomalies</h2>
        <div className="w-fit rounded-2xl border border-slate-200 bg-white/70 px-7 py-4 text-sm text-slate-500">
          Window: {data.window}
        </div>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-5">
          {data.metrics.map((metric) => (
            <section key={metric.id} className="min-h-[250px] overflow-hidden rounded-[28px] border border-white bg-white/80 p-7">
              <div className="flex flex-col gap-2 border-b border-dashed pb-2 md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-medium md:text-xl">{metric.title}</h2>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  {metric.centerText && (
                    <span className="text-sm text-[#C64A40] md:text-base">{metric.centerText}</span>
                  )}
                  <span className={`text-sm font-bold md:text-base ${toneClass[metric.tone]}`}>
                    {metric.status}
                  </span>
                </div>
              </div>
              <div className="relative h-[150px] overflow-hidden">
                <Sparkline values={metric.sparkline} color={metric.color} />
              </div>
            </section>
          ))}
        </div>
        <div className="space-y-5">
          <section className="rounded-[28px] border border-white bg-white/80 p-8">
            <h2 className="mb-6 text-xl font-bold md:text-2xl">Recent Container Logs</h2>
            <div className="overflow-hidden rounded-xl bg-[#07090C] p-5 font-mono text-sm leading-7">
              {data.logs.map((log) => (
                <p key={`${log.time}-${log.message}`} className={`mt-2 first:mt-0 ${logClass[log.level]}`}>
                  [{log.time}] {log.message}
                </p>
              ))}
            </div>
          </section>
          <section className="rounded-[28px] border border-white bg-white/80 p-8">
            <h2 className="mb-5 text-xl font-bold md:text-2xl">Distributed Traces</h2>
            <div className="space-y-4">
              {data.traces.map((trace) => (
                <div
                  key={trace.id}
                  className={`rounded-xl border p-4 ${trace.ok ? "border-slate-300 bg-slate-50" : "border-red-200 bg-red-50/50"}`}
                >
                  <p className={`font-bold ${trace.ok ? "text-[#243654]" : "text-[#B8423B]"}`}>
                    Trace: #{trace.id} ({trace.name})
                  </p>
                  <p className={`mt-1 text-sm ${trace.ok ? "text-[#258B73]" : "text-slate-500"}`}>
                    Duration: {trace.duration} • Status: {trace.status}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold tracking-wider text-slate-500">{label}</p>
      <h3 className="mt-3 font-bold text-[#243654]">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
