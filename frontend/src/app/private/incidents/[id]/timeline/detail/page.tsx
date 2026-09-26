"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ChevronLeft,
  CalendarDays,
  CircleDot,
  ExternalLink,
  Atom,
  Info,
  Activity,
} from "lucide-react";

import PageState from "@/components/PageState";
import ActBtn from "@/components/ActBtn";

import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export default function IncidentTimelineDetails({
  params,
}: {
  params: Promise<{
    id: string;
    eventId: string;
  }>;
}) {
  const { id, eventId } = use(params);
  const router = useRouter();

  const { data, loading, error } = useApi(`event:${id}:${eventId}`, () =>
    api.incidents.timelineEvent(id, eventId),
  );

  if (!data) {
    return (
      <main className="main-container min-h-screen px-4 pb-6 pt-4 sm:px-5 md:px-7">
        <PageState loading={loading} error={error} />
      </main>
    );
  }

  const { incident, event } = data;

  return (
    <main className="main-container min-h-screen px-4 pb-5 pt-4 text-[#17294D] sm:px-5 md:px-7 lg:px-8">
      <header className="mb-5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.push(`/private/incidents/${id}/timeline`)}
            aria-label="Go back"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6 text-[#17294D]" strokeWidth={2} />
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <h1 className="shrink-0 text-[21px] font-bold leading-none tracking-[-0.025em] text-black sm:text-[22px] md:text-[24px]">
              {incident.code}
            </h1>

            <h2 className="min-w-0 truncate text-[19px] font-medium leading-none tracking-[-0.02em] text-black sm:text-[20px] md:text-[22px]">
              {incident.title}
            </h2>
          </div>
        </div>

        <ActBtn />
      </header>

      <section className="mb-5 flex flex-wrap items-center gap-x-7 gap-y-2 px-1 text-[12px] text-[#202638] sm:text-[13px]">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-[15px] w-[15px]" />

          <span>{data.windowLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          <CircleDot className="h-[15px] w-[15px]" />

          <span>
            Affected Service:{" "}
            <strong className="font-bold">{incident.affectedService}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="h-[15px] w-[15px]" />

          <span>
            Environment:{" "}
            <strong className="font-bold">{incident.environment}</strong>
          </span>
        </div>
      </section>

      <section className="mb-4 rounded-[20px] border border-white/90 bg-white/70 px-5 py-4 shadow-[0_5px_25px_rgba(56,76,130,0.05)] sm:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_.65fr_.75fr_1fr_.7fr_auto] lg:items-center lg:gap-0">
          <div className="border-b pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            <h3 className="text-[15px] font-bold leading-5">{event.title}</h3>

            <p className="mt-1.5 text-[12px] leading-5">{data.leadTimeLabel}</p>
          </div>

          <div className="lg:px-4">
            <MetaItem label="Change by" value={data.changeBy ?? "—"} />
          </div>

          <div className="lg:px-4">
            <MetaItem label="Type" value={data.type ?? event.title} />
          </div>

          <div className="lg:px-4">
            <MetaItem label="Resource" value={data.resource ?? "—"} />
          </div>

          <div className="lg:px-4">
            <MetaItem label="Change ID" value={data.changeId ?? "—"} />
          </div>

          <Link
            href={`/private/incidents/${id}/investigation`}
            className="flex h-9 items-center justify-center gap-2 rounded-lg border border-[#9DBAFF] bg-[#EAF1FF] px-3.5 text-[11px] font-medium whitespace-nowrap text-[#17294D] transition hover:bg-[#DCE8FF]"
          >
            View Investigation
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <p className="mt-4 text-[12px] leading-5 sm:text-[13px]">
          {data.summary}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr] lg:items-stretch">
        <div className="flex min-h-0 flex-col">
          {data.configDiff && (
            <section className="rounded-[20px] border border-white/90 bg-white/65 p-5 shadow-[0_5px_25px_rgba(56,76,130,0.05)] sm:p-6">
              <div className="mb-3">
                <h3 className="text-[16px] font-bold leading-5">
                  What Changed
                </h3>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#8EBBFF] bg-white">
                <div className="flex min-h-[40px] items-center justify-between bg-[#E2F1FF] px-3.5 py-2">
                  <span className="truncate text-[12px] text-[#17294D]">
                    {data.configDiff.file}
                  </span>

                  <button
                    type="button"
                    className="ml-3 flex h-8 shrink-0 items-center gap-2 rounded-lg border border-[#9DBAFF] bg-[#EDF4FF] px-3 text-[11px] font-medium text-[#17294D] transition hover:bg-[#DFEAFF]"
                  >
                    View Full
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto px-3.5 py-3 font-mono text-[11px] leading-[1.9] sm:px-4 sm:text-[12px]">
                  {data.configDiff.lines.map((line) => (
                    <div key={line.number} className="flex min-w-max">
                      <span className="mr-5 w-5 select-none text-gray-500">
                        {line.number}
                      </span>

                      <span
                        className={
                          line.kind === "removed"
                            ? "text-red-500"
                            : line.kind === "added"
                              ? "text-green-500"
                              : line.kind === "key"
                                ? "text-blue-600"
                                : "text-[#26344D]"
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

          <section className="mt-4 flex min-h-0 flex-1 flex-col rounded-[20px] border border-white/90 bg-white/65 px-4 pb-5 pt-5 shadow-[0_5px_25px_rgba(56,76,130,0.05)] sm:px-5">
            <h3 className="mb-4 px-2 text-[16px] font-bold leading-5 text-[#17294D]">
              Related Signals
            </h3>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2">
              {data.signals.map((signal, index) => (
                <SignalCard
                  key={signal.title}
                  title={signal.title}
                  value={signal.value}
                  suffix={signal.suffix}
                  values={signal.sparkline}
                  type={signal.type === "database" ? "database" : "error"}
                  index={index}
                />
              ))}
            </div>
          </section>
        </div>

        <section className="flex min-h-0 flex-col rounded-[20px] border border-white/90 bg-white/65 p-5 shadow-[0_5px_25px_rgba(56,76,130,0.05)] sm:p-6">
          <h3 className="mb-3 text-[16px] font-bold leading-5">
            AI Impact Summary
          </h3>

          <div className="rounded-[18px] border border-[#B9B7FF] bg-[#E5F2FF] px-4 py-4">
            <div className="flex gap-3.5">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173D8F] text-white">
                <Atom className="h-5 w-5" strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h4 className="text-[15px] font-bold leading-5 text-[#0B3184]">
                  {data.aiImpact.headline}
                </h4>

                <p className="mt-2 text-[13px] leading-5 text-[#0B3184]">
                  {data.aiImpact.body}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 rounded-[18px] bg-[#EEF5FC] px-4 py-4 sm:grid-cols-3">
            <RiskItem label="Risk Level" value={data.aiImpact.riskLevel} />

            <RiskItem
              label="Potential Impact"
              value={data.aiImpact.potentialImpact}
            />

            <RiskItem
              label="Likelihood of Impact"
              value={data.aiImpact.likelihood}
            />
          </div>

          <div className="mt-5">
            <h4 className="text-[13px] font-semibold">Why this matters</h4>

            <p className="mt-1.5 text-[12px] leading-5 text-[#1D2029]">
              {data.aiImpact.whyItMatters}
            </p>
          </div>

          <div className="mt-6 flex-1">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[16px] font-bold leading-5">
                Related Events
              </h3>

              <Link
                href={`/private/incidents/${id}/timeline`}
                className="text-[11px] font-medium text-[#1670FF] hover:underline"
              >
                Full timeline →
              </Link>
            </div>

            <div className="relative">
              <div className="absolute bottom-[20px] left-[16px] top-[20px] w-[3px] bg-[#F07824]" />

              {data.relatedEvents.map((related) => (
                <div
                  key={related.id}
                  className="relative mb-2.5 flex gap-3.5 last:mb-0"
                >
                  <div className="relative z-10 flex w-[35px] shrink-0 justify-center">
                    <div
                      className={`mt-2 h-[34px] w-[34px] rounded-full ${
                        related.color === "red"
                          ? "bg-[#F12626]"
                          : "bg-[#F46D25]"
                      }`}
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[14px] bg-[#EEF5FC] px-3 py-2.5 sm:px-3.5">
                    <div className="min-w-0 flex-1">
                      <h4
                        className={`text-[11px] font-bold ${
                          related.color === "red"
                            ? "text-[#F12626]"
                            : "text-[#F46D25]"
                        }`}
                      >
                        {related.time} · {related.title}
                      </h4>

                      <p className="mt-1 whitespace-pre-line text-[10px] leading-4 text-[#343942]">
                        {related.description}
                      </p>
                    </div>

                    <div className="hidden min-w-[100px] shrink-0 border-l border-[#D1D7DF] pl-3 sm:block">
                      <p className="text-[10px] text-gray-600">
                        {related.metricLabel ?? "Metric"}
                      </p>

                      <p className="mt-1.5 text-[10px] font-semibold text-[#17294D]">
                        {related.metric}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>

      <section className="mt-4 flex flex-col gap-3 rounded-[18px] border border-[#9CAEFF] bg-[#E4F2FF] px-4 py-3 sm:px-5 md:flex-row md:items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-[#123E8E] text-[#123E8E]">
          <Info className="h-5 w-5" strokeWidth={2} />
        </div>

        <p className="flex-1 text-[12px] leading-5 text-[#103B89] sm:text-[13px]">
          This change occurred 3m 34s before the first anomaly and is correlated
          with the incidents AKAR identified it as a potential contributing
          factor
        </p>

        <button
          type="button"
          className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#9DBAFF] bg-[#EDF4FF] px-3.5 text-[11px] font-medium whitespace-nowrap text-[#17294D] transition hover:bg-[#DCE8FF] active:scale-[0.98]"
        >
          Ask AI about this change
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </section>
    </main>
  );
}

function SignalCard({
  title,
  value,
  suffix,
  values,
  type,
  index,
}: {
  title: string;
  value: string;
  suffix?: string;
  values: number[];
  type: "database" | "error";
  index: number;
}) {
  return (
    <div className="flex min-h-[260px] h-full flex-col overflow-hidden rounded-[16px] bg-white px-4 pb-3 pt-4 sm:px-5">
      <div className="h-[92px] shrink-0">
        <p className="text-[15px] font-normal leading-5 text-[#17294D]">
          {title}
        </p>

        <p className="mt-1.5 text-[34px] font-bold leading-none tracking-[-0.04em] text-black">
          {value}
        </p>

        <p className="mt-1 text-[12px] leading-4 text-[#30343C]">
          {suffix || "\u00A0"}
        </p>
      </div>

      <div className="mt-1 min-h-0 flex-1">
        <SignalChart values={values} type={type} index={index} />
      </div>
    </div>
  );
}

function SignalChart({
  values,
  type,
  index,
}: {
  values: number[];
  type: "database" | "error";
  index: number;
}) {
  const width = 500;
  const height = 170;

  const left = 34;
  const right = 8;
  const top = 8;
  const bottom = 32;

  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const points = values.map((value, i) => {
    const x = left + (i / Math.max(values.length - 1, 1)) * chartWidth;

    const y = top + chartHeight - (Math.min(value, 75) / 75) * chartHeight;

    return `${x},${y}`;
  });

  const linePoints = points.join(" ");

  const areaPoints = [
    `${left},${top + chartHeight}`,
    ...points,
    `${left + chartWidth},${top + chartHeight}`,
  ].join(" ");

  const stroke = type === "database" ? "#3975FF" : "#FF3F3F";

  const gradientId = `signal-gradient-${type}-${index}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block h-full w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.42" />

          <stop offset="100%" stopColor={stroke} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <line
        x1={left}
        y1={top}
        x2={left}
        y2={top + chartHeight}
        stroke="#8D8D8D"
        strokeWidth="1"
        strokeDasharray="2 2"
      />

      <line
        x1={left}
        y1={top + chartHeight}
        x2={left + chartWidth}
        y2={top + chartHeight}
        stroke="#8D8D8D"
        strokeWidth="1"
        strokeDasharray="2 2"
      />

      <text x="5" y={top + 4} fontSize="11" fill="#414141">
        75
      </text>

      <text x="5" y={top + chartHeight / 3 + 4} fontSize="11" fill="#414141">
        50
      </text>

      <text
        x="5"
        y={top + (chartHeight * 2) / 3 + 4}
        fontSize="11"
        fill="#414141"
      >
        25
      </text>

      <text x="9" y={top + chartHeight + 4} fontSize="11" fill="#414141">
        0
      </text>

      <polygon points={areaPoints} fill={`url(#${gradientId})`} />

      <polyline
        points={linePoints}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text x={left} y={height - 6} fontSize="11" fill="#333333">
        15:06
      </text>

      <text
        x={left + chartWidth * 0.42}
        y={height - 6}
        fontSize="11"
        fill="#333333"
        textAnchor="middle"
      >
        15:15
      </text>

      <text
        x={left + chartWidth * 0.72}
        y={height - 6}
        fontSize="11"
        fill="#333333"
        textAnchor="middle"
      >
        15:25
      </text>
    </svg>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#202638]">{label}</p>

      <p className="mt-1.5 truncate text-[11px] font-bold">{value}</p>
    </div>
  );
}

function RiskItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-1">
      <p className="text-[12px] text-gray-500">{label}</p>

      <p className="mt-2 text-[14px] font-medium leading-5 text-[#171B23]">
        {value}
      </p>
    </div>
  );
}
