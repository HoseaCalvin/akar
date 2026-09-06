"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import PageState from "@/components/PageState";
import Sparkline from "@/components/Sparkline";
import ActBtn from "@/components/ActBtn";

import {
  ChevronLeft,
  CircleDot,
  Activity,
  Database,
  Globe,
  Network,
  ServerCog,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import type { TopologyKind } from "@/lib/types";

const kindIcon: Record<TopologyKind, typeof Globe> = {
  web: Globe,
  gateway: Network,
  service: ServerCog,
  db: Database,
};

export default function IncidentInvestigation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [showManualPopup, setShowManualPopup] = useState(false);

  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const { data, loading, error } = useApi(`investigation:${id}`, () =>
    api.incidents.investigation(id),
  );

  if (!data) {
    return (
      <main className="flex h-screen flex-col px-7 pt-6">
        <PageState loading={loading} error={error} />
      </main>
    );
  }

  const applyAction = async () => {
    const result = await api.incidents.applyAction(
      id,
      data.recommendedAction.id,
    );

    setShowManualPopup(false);
    setActionMessage(result.message);

    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
  };

  return (
    <main className="flex h-screen min-h-screen flex-col overflow-hidden text-[#172033]">
      <div className="shrink-0 px-5 pb-4 pt-4 md:px-7 md:pt-5">
        <header>
          <div className="flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => router.push(`/private/incidents/${id}/timeline`)}
                aria-label="Go back"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-white"
              >
                <ChevronLeft className="h-7 w-7 text-black" strokeWidth={2} />
              </button>

              <div className="flex min-w-0 items-center gap-4">
                <h1 className="shrink-0 text-[24px] font-bold tracking-[-0.4px] text-black md:text-[26px]">
                  {data.incident.code}
                </h1>

                <h2 className="truncate text-[21px] font-medium tracking-[-0.5px] text-black md:text-[23px]">
                  {data.incident.title}
                </h2>
              </div>
            </div>

            <div className="shrink-0">
              <ActBtn />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[12px] text-[#242936] md:text-[13px]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

              <span className="font-medium">{data.incident.status}</span>
            </div>

            <span className="text-[#B4BAC4]">•</span>

            <span className="text-[#5C6370]">{data.incident.sinceLabel}</span>

            <div className="flex items-center gap-2">
              <CircleDot className="h-4 w-4" />

              <span>
                Affected Service:{" "}
                <strong className="font-bold">
                  {data.incident.affectedService}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />

              <span>
                Environment:{" "}
                <strong className="font-bold">
                  {data.incident.environment}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ServerCog className="h-4 w-4" />

              <span>
                Owner:{" "}
                <strong className="font-bold">{data.incident.owner}</strong>
              </span>
            </div>
          </div>
        </header>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-7 pt-1 md:px-7">
        {actionMessage && (
          <p className="mb-3 rounded-xl bg-green-50 px-4 py-2 text-[12px] text-green-700">
            {actionMessage}
          </p>
        )}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard
            title="Root Cause Prediction"
            description={data.rootCause.prediction}
            value={`${data.rootCause.confidence}%`}
            label="Confidence"
            progress={`${data.rootCause.confidence}%`}
            progressColor="bg-[#173EFF]"
          />

          <SummaryCard
            title="Impact"
            description={data.impact.description}
            value={`${data.impact.percent}%`}
            label={data.impact.label}
            progress={`${data.impact.percent}%`}
            progressColor="bg-red-500"
          />

          <SummaryCard
            title="User Impact"
            description={data.userImpact.description}
            value={`${data.userImpact.percent}%`}
            label={data.userImpact.label}
            progress={`${data.userImpact.percent}%`}
            progressColor="bg-red-500"
          />

          <SmallSummaryCard
            title="MTTR"
            value={data.mttr.value}
            label={data.mttr.label}
            bottom={data.mttr.target}
          />

          <SmallSummaryCard
            title="RCA Detection"
            value={data.rcaDetection.value}
            label={data.rcaDetection.label}
            bottom={data.rcaDetection.target}
          />
        </section>

        <section className="mt-4 grid grid-cols-1 items-stretch gap-3 xl:grid-cols-[1.02fr_1fr]">
          <div className="flex min-h-0 flex-col gap-3">
            <section className="flex min-h-[330px] flex-col rounded-[20px] bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[17px] font-bold text-[#182238]">
                  Affected Topology
                </h3>
              </div>

              <div className="relative mt-4 min-h-[260px] flex-1 w-full">
                <svg
                  className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                  viewBox="0 0 1000 285"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <marker
                      id="topology-arrow-gray"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="5.5"
                      markerHeight="5.5"
                      orient="auto"
                    >
                      <path
                        d="M 1 1 L 8 5 L 1 9"
                        fill="none"
                        stroke="#777777"
                        strokeWidth="1.4"
                      />
                    </marker>

                    <marker
                      id="topology-arrow-red"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="5.5"
                      markerHeight="5.5"
                      orient="auto"
                    >
                      <path
                        d="M 1 1 L 8 5 L 1 9"
                        fill="none"
                        stroke="#FF3D3D"
                        strokeWidth="1.4"
                      />
                    </marker>
                  </defs>

                  {data.topology.edges.map((edge) => (
                    <path
                      key={`${edge.from}-${edge.to}`}
                      d={edge.path}
                      fill="none"
                      stroke={edge.critical ? "#FF3D3D" : "#777777"}
                      strokeWidth={edge.critical ? 1.6 : 1.4}
                      strokeDasharray="3 4"
                      markerEnd={
                        edge.critical
                          ? "url(#topology-arrow-red)"
                          : "url(#topology-arrow-gray)"
                      }
                    />
                  ))}
                </svg>

                {data.topology.nodes.map((node) => {
                  const Icon = kindIcon[node.kind];

                  return (
                    <div
                      key={node.id}
                      style={node.position}
                      className={`absolute z-10 box-border rounded-[12px] border px-2.5 py-2 ${
                        node.critical
                          ? "border-[#FF8F8F] bg-gradient-to-r from-[#FFB3B3] via-[#FFD5D5] to-[#FFF7F7]"
                          : "border-[#AFAFAF] bg-[#FAFAFA]"
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <div
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] ${
                            node.critical
                              ? "bg-[#FFF0F0] text-red-500"
                              : "bg-[#ECECF8]"
                          }`}
                        >
                          <Icon className="h-[15px] w-[15px]" />
                        </div>

                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p className="truncate text-[10px] font-medium leading-[13px]">
                            {node.title}
                          </p>

                          <p
                            className={`mt-[3px] text-[8px] ${
                              node.critical ? "text-red-500" : "text-[#202020]"
                            }`}
                          >
                            {node.status}
                          </p>

                          {node.subtitle && (
                            <p className="mt-[3px] truncate text-[7px]">
                              {node.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="flex min-h-[370px] flex-1 flex-col rounded-[20px] bg-white p-5">
              <h3 className="text-[17px] font-bold">Key Evidence</h3>

              <div className="relative mt-4 flex-1 space-y-3">
                {data.evidence.map((item) => (
                  <div
                    key={item.id}
                    className="relative grid grid-cols-[92px_1fr] gap-3"
                  >
                    <div className="relative pl-5">
                      <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />

                      <p className="text-[11px] font-medium">{item.time}</p>

                      <p className="mt-1.5 text-[10px] text-[#666]">
                        {item.ago}
                      </p>
                    </div>

                    <div className="rounded-[16px] border border-[#D3D3D3] bg-white px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-[13px] font-bold">{item.title}</h4>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${
                              item.type === "Log"
                                ? "bg-[#FFDADA] text-[#F54B4B]"
                                : "bg-[#FFF4BF] text-[#B28A00]"
                            }`}
                          >
                            {item.type}
                          </span>

                          <ChevronRight className="h-3.5 w-3.5 text-[#777]" />
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 text-[10px]">
                        <div>
                          <p className="text-[10px] text-[#666]">Source</p>

                          <p className="mt-1 font-bold">{item.source}</p>
                        </div>

                        <div>
                          <p className="text-[10px] text-[#666]">Component</p>

                          <p className="mt-1 font-bold">{item.component}</p>
                        </div>

                        <div>
                          <p className="text-[10px] text-[#666]">Relevance</p>

                          <p className="mt-1 font-bold text-red-500">
                            {item.relevance}
                          </p>
                        </div>
                      </div>

                      {item.sparkline && (
                        <div className="mt-3 h-[55px]">
                          <Sparkline
                            values={item.sparkline}
                            color={
                              item.sparklineColor === "orange"
                                ? "#FF9B00"
                                : "#FF4B4B"
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="flex min-h-0 flex-col gap-3">
            <section className="flex min-h-[500px] flex-col rounded-[20px] bg-white p-5">
              <h3 className="text-[17px] font-bold text-[#182238]">
                AI Analysis
              </h3>

              <div className="mt-3 flex items-center justify-between gap-4 rounded-[18px] border border-[#B7B5FF] bg-[#E7F3FF] px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-[#17377E]">
                    Root Cause Prediction
                  </p>

                  <p className="mt-1 text-[12px] leading-5 text-[#303946]">
                    {data.rootCause.prediction}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-[12px] bg-[#123B91] px-3.5 py-2 text-white">
                  <span className="text-[20px] font-bold leading-none">
                    {data.rootCause.confidence}%
                  </span>

                  <span className="text-[10px]">Confidence</span>
                </div>
              </div>

              <div className="mt-4 px-3">
                <h4 className="text-[15px] font-bold">
                  Why AKAR thinks this is the root cause?
                </h4>

                <div className="mt-4 space-y-3">
                  {data.analysisReasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex items-center gap-2 text-[12px]"
                    >
                      <CheckCircle2 className="h-[15px] w-[15px] shrink-0 fill-[#55B91B] text-white" />

                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-[18px] bg-[#E4F2FF] px-4 py-4">
                <h4 className="text-[14px] font-medium">
                  Alternative Hypothesis{" "}
                  <span className="font-bold text-[#0D4EA2]">
                    (lower probability)
                  </span>
                </h4>

                <div className="mt-3 space-y-3">
                  {data.alternatives.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between text-[12px]"
                    >
                      <span>• {item.label}</span>

                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex-1" />
            </section>

            <section className="flex min-h-[370px] flex-1 flex-col rounded-[20px] bg-white p-5">
              <h3 className="text-[17px] font-bold">Recommended Action</h3>

              <div className="mt-3 rounded-[18px] bg-gradient-to-r from-[#E6F5FF] to-[#FFFFE9] px-5 py-4">
                <h4 className="text-[15px] font-bold text-[#B07D00]">
                  {data.recommendedAction.title}
                </h4>

                <p className="mt-2 text-[12px] leading-5">
                  {data.recommendedAction.description}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-5 px-3 text-[11px]">
                <div>
                  <p className="text-[10px] text-[#777]">Expected Impact</p>

                  <p className="mt-2">
                    {data.recommendedAction.expectedImpact}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#777]">Confidence</p>

                  <p className="mt-2">{data.recommendedAction.confidence}</p>

                  <p className="mt-4 text-[10px] text-[#777]">Risk Level</p>

                  <p className="mt-2">{data.recommendedAction.riskLevel}</p>
                </div>
              </div>

              <div className="mt-auto pt-5">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowManualPopup(true)}
                    className="h-10 rounded-[10px] border border-[#9EB9FF] bg-[#EAF0FF] text-[12px] font-medium transition hover:bg-[#DDE7FF]"
                  >
                    Apply Action
                  </button>

                  <button
                    type="button"
                    className="h-10 rounded-[10px] border border-[#A9C2FF] bg-white text-[12px] font-medium transition hover:bg-[#F5F7FA]"
                  >
                    Chaos Lab
                  </button>
                </div>

                {data.recommendedAction.manualOnly && (
                  <div className="mt-3 flex items-center gap-2 px-1 text-[11px] text-red-500">
                    <AlertCircle className="h-3.5 w-3.5 fill-red-500 text-white" />

                    <span>Manual Only</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>

      {showManualPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[430px] rounded-[22px] border border-white/80 bg-gradient-to-br from-[#F5F8FA] to-[#DDEEF5] px-7 py-7">
            <h2 className="text-center text-[26px] font-bold">Manual Only!</h2>

            <p className="mx-auto mt-4 text-center text-[14px]">
              Apply this remediation action?
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void applyAction()}
                className="h-11 rounded-[12px] bg-[#E8EEFF] text-[14px]"
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() => setShowManualPopup(false)}
                className="h-11 rounded-[12px] bg-[#AFC7F8] text-[14px]"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  title,
  description,
  value,
  label,
  progress,
  progressColor,
}: {
  title: string;
  description: string;
  value: string;
  label: string;
  progress: string;
  progressColor: string;
}) {
  return (
    <div className="flex min-h-[145px] flex-col rounded-[18px] bg-white px-4 py-3.5">
      <h3 className="text-[15px] font-bold">{title}</h3>

      <p className="mt-1 line-clamp-1 text-[10px] text-[#71809B]">
        {description}
      </p>

      <div className="mt-3 text-[31px] font-bold leading-none">{value}</div>

      <p className="mt-1 text-[10px] text-[#71809B]">{label}</p>

      <div className="mt-auto pt-3">
        <div className="h-[5px] overflow-hidden rounded-full bg-[#E2E3E5]">
          <div
            className={`h-full rounded-full ${progressColor}`}
            style={{ width: progress }}
          />
        </div>
      </div>
    </div>
  );
}

function SmallSummaryCard({
  title,
  value,
  label,
  bottom,
}: {
  title: string;
  value: string;
  label: string;
  bottom: string;
}) {
  return (
    <div className="flex min-h-[145px] flex-col rounded-[18px] bg-white px-4 py-3.5">
      <h3 className="text-[15px] font-bold">{title}</h3>

      <div className="mt-4 text-[31px] font-bold leading-none">{value}</div>

      <p className="mt-1 text-[10px] text-[#71809B]">{label}</p>

      <p className="mt-auto pt-3 text-[10px] text-[#71809B]">{bottom}</p>
    </div>
  );
}
