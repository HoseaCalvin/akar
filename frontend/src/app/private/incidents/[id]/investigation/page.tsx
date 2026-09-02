"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import PageState from "@/components/PageState";
import Sparkline from "@/components/Sparkline";
import {
  ChevronLeft,
  CircleDot,
  Activity,
  Database,
  Globe,
  Network,
  ServerCog,
  CheckCircle2,
  Download,
  Share2,
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
    const result = await api.incidents.applyAction(id, data.recommendedAction.id);
    setShowManualPopup(false);
    setActionMessage(result.message);
    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
  };

  return (
    <main className="flex h-screen min-h-screen flex-col overflow-hidden text-[#172033]">
      <div className="shrink-0 px-5 pb-5 pt-4 md:px-7 md:pt-6">
        <header>
          <div className="flex items-center justify-between gap-6">
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
                <h1 className="shrink-0 text-[27px] font-bold tracking-[-0.5px] text-black md:text-[30px]">
                  {data.incident.code}
                </h1>
                <h2 className="truncate text-[25px] font-medium tracking-[-0.7px] text-black md:text-[30px]">
                  {data.incident.title}
                </h2>
              </div>
            </div>
            <div className="hidden shrink-0 items-center gap-4 md:flex">
              <button type="button" className="flex h-12 items-center gap-3 rounded-[15px] border border-[#E2E5EC] bg-white px-6 text-[14px] font-medium text-[#667085] shadow-sm">
                <Download className="h-5 w-5" />
                Export
              </button>
              <button type="button" className="flex h-12 items-center gap-3 rounded-[15px] bg-[#7697F4] px-6 text-[14px] font-semibold text-white shadow-sm">
                <Share2 className="h-5 w-5" />
                Share
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-[14px] text-[#242936]">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="font-medium">{data.incident.status}</span>
            </div>
            <span className="text-[#B4BAC4]">•</span>
            <span className="text-[#5C6370]">{data.incident.sinceLabel}</span>
            <div className="flex items-center gap-2">
              <CircleDot className="h-[18px] w-[18px]" />
              <span>
                Affected Service: <strong className="font-bold">{data.incident.affectedService}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-[18px] w-[18px]" />
              <span>
                Environment: <strong className="font-bold">{data.incident.environment}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ServerCog className="h-[18px] w-[18px]" />
              <span>
                Owner: <strong className="font-bold">{data.incident.owner}</strong>
              </span>
            </div>
          </div>
        </header>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-2 md:px-7">
        {actionMessage && (
          <p className="mb-3 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">
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
          <SmallSummaryCard title="MTTR" value={data.mttr.value} label={data.mttr.label} bottom={data.mttr.target} />
          <SmallSummaryCard title="RCA Detection" value={data.rcaDetection.value} label={data.rcaDetection.label} bottom={data.rcaDetection.target} />
        </section>

        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.02fr_1fr]">
          <div className="space-y-3">
            <section className="rounded-[20px] bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[18px] font-bold text-[#182238]">Affected Topology</h3>
              </div>
              <div className="relative mt-5 h-[285px] w-full">
                <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox="0 0 1000 285" preserveAspectRatio="none">
                  <defs>
                    <marker id="topology-arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
                      <path d="M 1 1 L 8 5 L 1 9" fill="none" stroke="#777777" strokeWidth="1.4" />
                    </marker>
                    <marker id="topology-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
                      <path d="M 1 1 L 8 5 L 1 9" fill="none" stroke="#FF3D3D" strokeWidth="1.4" />
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
                      markerEnd={edge.critical ? "url(#topology-arrow-red)" : "url(#topology-arrow-gray)"}
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
                        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] ${node.critical ? "bg-[#FFF0F0] text-red-500" : "bg-[#ECECF8]"}`}>
                          <Icon className="h-[15px] w-[15px]" />
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p className="truncate text-[11px] font-medium leading-[13px]">{node.title}</p>
                          <p className={`mt-[3px] text-[9px] ${node.critical ? "text-red-500" : "text-[#202020]"}`}>{node.status}</p>
                          {node.subtitle && <p className="mt-[3px] truncate text-[8px]">{node.subtitle}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[20px] bg-white p-5">
              <h3 className="text-[18px] font-bold">Key Evidence</h3>
              <div className="relative mt-5 space-y-4">
                {data.evidence.map((item) => (
                  <div key={item.id} className="relative grid grid-cols-[110px_1fr] gap-3">
                    <div className="relative pl-6">
                      <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-red-500" />
                      <p className="text-[12px] font-medium">{item.time}</p>
                      <p className="mt-2 text-[11px] text-[#666]">{item.ago}</p>
                    </div>
                    <div className="rounded-[18px] border border-[#D3D3D3] bg-white px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-[15px] font-bold">{item.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-[10px] font-medium ${item.type === "Log" ? "bg-[#FFDADA] text-[#F54B4B]" : "bg-[#FFF4BF] text-[#B28A00]"}`}>
                            {item.type}
                          </span>
                          <ChevronRight className="h-4 w-4 text-[#777]" />
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-4 text-[12px]">
                        <div>
                          <p className="text-[11px] text-[#666]">Source</p>
                          <p className="mt-1 font-bold">{item.source}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#666]">Component</p>
                          <p className="mt-1 font-bold">{item.component}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#666]">Relevance</p>
                          <p className="mt-1 font-bold text-red-500">{item.relevance}</p>
                        </div>
                      </div>
                      {item.sparkline && (
                        <div className="mt-4 h-[65px]">
                          <Sparkline
                            values={item.sparkline}
                            color={item.sparklineColor === "orange" ? "#FF9B00" : "#FF4B4B"}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-3">
            <section className="rounded-[20px] bg-white p-5">
              <h3 className="text-[18px] font-bold text-[#182238]">AI Analysis</h3>
              <div className="mt-3 flex items-center justify-between rounded-[18px] border border-[#B7B5FF] bg-[#E7F3FF] px-5 py-3">
                <div>
                  <p className="text-[17px] font-bold text-[#17377E]">Root Cause Prediction</p>
                  <p className="mt-1 text-[14px] text-[#303946]">{data.rootCause.prediction}</p>
                </div>
                <div className="flex items-center gap-3 rounded-[13px] bg-[#123B91] px-5 py-2 text-white">
                  <span className="text-[24px] font-bold leading-none">{data.rootCause.confidence}%</span>
                  <span className="text-[13px]">Confidence</span>
                </div>
              </div>
              <div className="mt-5 px-5">
                <h4 className="text-[17px] font-bold">Why AKAR thinks this is the root cause?</h4>
                <div className="mt-5 space-y-4">
                  {data.analysisReasons.map((reason) => (
                    <div key={reason} className="flex items-center gap-2 text-[15px]">
                      <CheckCircle2 className="h-[16px] w-[16px] shrink-0 fill-[#55B91B] text-white" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-[20px] bg-[#E4F2FF] px-5 py-5">
                <h4 className="text-[17px] font-medium">
                  Alternative Hypothesis <span className="font-bold text-[#0D4EA2]">(lower probability)</span>
                </h4>
                <div className="mt-4 space-y-4">
                  {data.alternatives.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-[15px]">
                      <span>• {item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[20px] bg-white p-5">
              <h3 className="text-[18px] font-bold">Recommended Action</h3>
              <div className="mt-3 rounded-[20px] bg-gradient-to-r from-[#E6F5FF] to-[#FFFFE9] px-6 py-5">
                <h4 className="text-[17px] font-bold text-[#B07D00]">{data.recommendedAction.title}</h4>
                <p className="mt-3 text-[14px] leading-5">{data.recommendedAction.description}</p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-6 px-5 text-[13px]">
                <div>
                  <p className="text-[12px] text-[#777]">Expected Impact</p>
                  <p className="mt-3">{data.recommendedAction.expectedImpact}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#777]">Confidence</p>
                  <p className="mt-3">{data.recommendedAction.confidence}</p>
                  <p className="mt-6 text-[12px] text-[#777]">Risk Level</p>
                  <p className="mt-3">{data.recommendedAction.riskLevel}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShowManualPopup(true)}
                  className="h-12 rounded-[10px] border border-[#9EB9FF] bg-[#EAF0FF] text-[17px] font-medium"
                >
                  Apply Action
                </button>
                <button type="button" className="h-12 rounded-[10px] border border-[#A9C2FF] bg-white text-[17px] font-medium">
                  Chaos Lab
                </button>
              </div>
              {data.recommendedAction.manualOnly && (
                <div className="mt-3 flex items-center gap-2 px-1 text-[12px] text-red-500">
                  <AlertCircle className="h-4 w-4 fill-red-500 text-white" />
                  <span>Manual Only</span>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>

      {showManualPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[470px] rounded-[26px] border border-white/80 bg-gradient-to-br from-[#F5F8FA] to-[#DDEEF5] px-8 py-8">
            <h2 className="text-center text-[32px] font-bold">Manual Only!</h2>
            <p className="mx-auto mt-6 text-center text-[18px]">Apply this remediation action?</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button type="button" onClick={() => void applyAction()} className="h-14 rounded-[15px] bg-[#E8EEFF] text-[18px]">
                Yes
              </button>
              <button type="button" onClick={() => setShowManualPopup(false)} className="h-14 rounded-[15px] bg-[#AFC7F8] text-[18px]">
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
    <div className="min-h-[161px] rounded-[20px] bg-white px-5 py-4">
      <h3 className="text-[17px] font-bold">{title}</h3>
      <p className="mt-1 line-clamp-1 text-[12px] text-[#71809B]">{description}</p>
      <div className="mt-3 text-[36px] font-bold leading-none">{value}</div>
      <p className="mt-1 text-[12px] text-[#71809B]">{label}</p>
      <div className="mt-4 h-[6px] overflow-hidden rounded-full bg-[#E2E3E5]">
        <div className={`h-full rounded-full ${progressColor}`} style={{ width: progress }} />
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
    <div className="min-h-[161px] rounded-[20px] bg-white px-5 py-4">
      <h3 className="text-[17px] font-bold">{title}</h3>
      <div className="mt-5 text-[36px] font-bold leading-none">{value}</div>
      <p className="mt-1 text-[12px] text-[#71809B]">{label}</p>
      <p className="mt-3 text-[12px] text-[#71809B]">{bottom}</p>
    </div>
  );
}
