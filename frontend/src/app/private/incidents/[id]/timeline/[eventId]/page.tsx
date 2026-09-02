"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import PageState from "@/components/PageState";
import Sparkline from "@/components/Sparkline";
import {
  ChevronLeft,
  CalendarDays,
  CircleDot,
  ExternalLink,
  Atom,
  Info,
  Activity,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export default function IncidentTimelineDetails({
  params,
}: {
  params: Promise<{ id: string; eventId: string }>;
}) {
  const { id, eventId } = use(params);
  const router = useRouter();
  const { data, loading, error } = useApi(`event:${id}:${eventId}`, () =>
    api.incidents.timelineEvent(id, eventId),
  );

  if (!data) {
    return (
      <main className="main-container min-h-screen px-5 pb-7 pt-4">
        <TopBar />
        <PageState loading={loading} error={error} />
      </main>
    );
  }

  const { incident, event } = data;

  return (
    <main className="main-container min-h-screen px-5 pb-7 pt-4 text-[#17294D] md:px-7 md:pt-5">
      <section className="flex min-h-[72px] items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => router.push(`/private/incidents/${id}/timeline`)}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-white"
          >
            <ChevronLeft className="h-8 w-8 text-black" />
          </button>
          <div className="flex min-w-0 items-center gap-5">
            <h1 className="shrink-0 text-2xl font-bold text-black md:text-3xl">
              {incident.code}
            </h1>
            <h2 className="truncate text-2xl font-semibold text-black md:text-3xl">
              {incident.title}
            </h2>
          </div>
        </div>
        <div className="shrink-0">
          <TopBar />
        </div>
      </section>

      <section className="mb-5 flex flex-wrap items-center gap-x-10 gap-y-3 px-1 text-[15px] text-[#202638]">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-[18px] w-[18px]" />
          <span>{data.windowLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleDot className="h-[18px] w-[18px]" />
          <span>
            Affected Service: <strong className="font-bold">{incident.affectedService}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-[18px] w-[18px]" />
          <span>
            Environment: <strong className="font-bold">{incident.environment}</strong>
          </span>
        </div>
      </section>

      <section className="mb-4 rounded-[22px] border border-white bg-white/70 px-7 py-5 shadow-[0_5px_25px_rgba(56,76,130,0.05)]">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr_0.7fr_auto] lg:items-center">
          <div className="border-b pb-4 lg:border-b-0 lg:border-r lg:pb-0">
            <h3 className="text-[18px] font-bold">{event.title}</h3>
            <p className="mt-2 text-[15px]">{data.leadTimeLabel}</p>
          </div>
          <MetaItem label="Change by" value={data.changeBy ?? "—"} />
          <MetaItem label="Type" value={data.type ?? event.title} />
          <MetaItem label="Resource" value={data.resource ?? "—"} />
          <MetaItem label="Change ID" value={data.changeId ?? "—"} />
          <Link
            href={`/private/incidents/${id}/investigation`}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#9dbaff] bg-[#eaf1ff] px-4 text-[14px] font-medium text-[#17294D] transition hover:bg-[#dce8ff]"
          >
            View Investigation
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-5 text-[15px]">{data.summary}</p>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          {data.configDiff && (
            <section className="rounded-[22px] border border-white bg-white/65 p-7 shadow-[0_5px_25px_rgba(56,76,130,0.05)]">
              <h3 className="mb-3 text-[18px] font-bold">What Changed</h3>
              <div className="overflow-hidden rounded-xl border border-[#9bc2ff] bg-white">
                <div className="flex items-center justify-between bg-[#e5f2ff] px-4 py-2.5">
                  <span className="text-[14px]">{data.configDiff.file}</span>
                </div>
                <div className="px-4 py-4 font-mono text-[14px] leading-[2]">
                  {data.configDiff.lines.map((line) => (
                    <div key={line.number} className="flex">
                      <span className="mr-5 w-4 select-none text-gray-600">{line.number}</span>
                      <span
                        className={
                          line.kind === "removed"
                            ? "text-red-500"
                            : line.kind === "added"
                              ? "text-green-500"
                              : line.kind === "key"
                                ? "text-blue-600"
                                : "text-[#26344d]"
                        }
                      >
                        {line.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="rounded-[22px] border border-white bg-white/65 p-4 shadow-[0_5px_25px_rgba(56,76,130,0.05)]">
            <h3 className="mb-2 px-3 text-[18px] font-bold">Related Signals</h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {data.signals.map((signal) => (
                <div key={signal.title} className="rounded-xl bg-white px-3 py-2">
                  <p className="text-[13px]">{signal.title}</p>
                  <p className="mt-1 text-[28px] font-bold leading-none text-black">
                    {signal.value}
                  </p>
                  {signal.suffix && (
                    <p className="text-[10px] text-gray-500">{signal.suffix}</p>
                  )}
                  <div className="mt-2 h-[80px] overflow-hidden">
                    <Sparkline
                      values={signal.sparkline}
                      color={signal.type === "database" ? "#527BFF" : "#FF5B5B"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[22px] border border-white bg-white/65 p-7 shadow-[0_5px_25px_rgba(56,76,130,0.05)]">
          <h3 className="mb-3 text-[18px] font-bold">AI Impact Summary</h3>
          <div className="rounded-[22px] border border-[#b9b7ff] bg-[#e8f3ff] px-5 py-5">
            <div className="flex gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173d8f] text-white">
                <Atom className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-[#0b3184]">
                  {data.aiImpact.headline}
                </h4>
                <p className="mt-2 text-[16px] leading-6 text-[#0b3184]">
                  {data.aiImpact.body}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 rounded-[20px] bg-[#eef5fc] px-4 py-5">
            <RiskItem label="Risk Level" value={data.aiImpact.riskLevel} />
            <RiskItem label="Potential Impact" value={data.aiImpact.potentialImpact} />
            <RiskItem label="Likelihood of Impact" value={data.aiImpact.likelihood} />
          </div>
          <div className="mt-5">
            <h4 className="text-[15px] font-semibold">Why this matters</h4>
            <p className="mt-2 max-w-[570px] text-[14px] leading-5 text-[#1d2029]">
              {data.aiImpact.whyItMatters}
            </p>
          </div>
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[18px] font-bold">Related Events</h3>
              <Link href={`/private/incidents/${id}/timeline`} className="text-[13px] text-[#1670ff]">
                Full timeline →
              </Link>
            </div>
            {data.relatedEvents.map((related) => (
              <div key={related.id} className="mb-2 flex items-center justify-between gap-4 rounded-[15px] bg-[#eef5fc] px-4 py-3">
                <div>
                  <h4 className={`text-[12px] font-bold ${related.color === "red" ? "text-red-500" : "text-orange-500"}`}>
                    {related.time} · {related.title}
                  </h4>
                  <p className="mt-1 whitespace-pre-line text-[11px] leading-4 text-[#343942]">
                    {related.description}
                  </p>
                </div>
                <div className="min-w-[120px] border-l border-gray-300 pl-4">
                  <p className="text-[11px] text-gray-600">{related.metricLabel ?? "Metric"}</p>
                  <p className="mt-2 text-[11px] font-semibold">{related.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="mt-4 flex flex-col gap-4 rounded-[18px] border border-[#9caeff] bg-[#e4f2ff] px-6 py-4 md:flex-row md:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-[#123e8e] text-[#123e8e]">
          <Info className="h-6 w-6" />
        </div>
        <p className="flex-1 text-[16px] leading-6 text-[#103b89]">{data.correlationNote}</p>
      </section>
    </main>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] text-[#202638]">{label}</p>
      <p className="mt-2 text-[14px] font-bold">{value}</p>
    </div>
  );
}

function RiskItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2">
      <p className="text-[16px] text-gray-500">{label}</p>
      <p className="mt-5 text-[17px] font-medium text-[#171b23]">{value}</p>
    </div>
  );
}
