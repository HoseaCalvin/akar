"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import EvidenceAlert from "@/components/EvidenceAlert";

import TopBar from "@/components/TopBar";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import type { RemediationItem } from "@/lib/types";

export default function RemediationPage() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { data, loading, error, reload } = useApi(
    "remediation:center",
    () => api.remediation.list({}),
  );

  const items = data?.items ?? [];

  const primary =
    items[0] ??
    ({
      id: "demo-1",
      incidentId: "INC-4082",
      incidentCode: "INC-4082",
      title: "ROLLBACK_DEPLOYMENT",
      description:
        "Rollback pymt-svc to the previous stable deployment version.",
      status: "Recommended",
      confidence: "84%",
      riskLevel: "High",
      expectedImpact: "Connection Errors should drop significantly",
      manualOnly: true,
    } as RemediationItem);

  const second =
    items[1] ??
    ({
      id: "demo-2",
      incidentId: primary.incidentId,
      incidentCode: primary.incidentCode,
      title: "SCALE_UP_WORKLOAD",
      description: "Incase replica count for pymt-svc deployment.",
      status: "Recommended",
      confidence: "62%",
      riskLevel: "Medium",
      expectedImpact: "Improve connection availability",
      manualOnly: false,
    } as RemediationItem);

  const third =
    items[2] ??
    ({
      id: "demo-3",
      incidentId: primary.incidentId,
      incidentCode: primary.incidentCode,
      title: "UPDATE_WORKLOAD_RESOURCES",
      description: "Incase CPU and memory limits for pymt-svc.",
      status: "Recommended",
      confidence: "41%",
      riskLevel: "Medium",
      expectedImpact: "Improve workload stability",
      manualOnly: false,
    } as RemediationItem);

  const visibleItems = [primary, second, third];

  const pending =
    visibleItems.find((item) => item.id === pendingId) ?? null;

  const apply = async (item: RemediationItem) => {
    const result = await api.incidents.applyAction(item.incidentId, item.id);

    setPendingId(null);
    setMessage(result.message);

    await reload();
  };

  return (
    <main className="min-h-screen overflow-y-auto  text-[#172033]">
      <TopBar />

    <section className="mt-6 shrink-0 px-6">
      <div className="flex min-w-0 items-start gap-50">
        <div className="min-w-0 shrink-0">
          <h1 className="text-[26px] font-semibold leading-[31px] tracking-[-0.5px] text-[#111111]">
            Remediation Center
          </h1>

          <p className="mt-[6px] text-[13px] leading-[19px] text-[#687B9B]">
            Review, simulate and approve remediation actions for this incidents
          </p>
        </div>

        <EvidenceAlert />
      </div>
    </section>

      <section className="mx-6 mt-4 rounded-[13px] border border-[#E2E7F2] bg-white px-5 py-3 shadow-[0_6px_18px_rgba(51,77,140,0.12)]">
        <div className="flex h-[68px] items-center">
          <div className="min-w-0 flex-[1.55] border-r border-[#D4D7DE] pr-5">
            <div className="flex items-center gap-4">
              <span className="shrink-0 rounded-[5px] bg-[#FFE1E1] px-3 py-1.5 text-[10px] font-bold uppercase text-[#EF3E3E]">
                Critical
              </span>

              <span className="truncate text-[15px] font-bold">
                INC-4082: PostgreSQL Connection Timeout Errors
              </span>
            </div>

            <p className="mt-2.5 text-[12px] text-[#687895]">
              Detected 15:19:27 • Active for 15m 42s
            </p>
          </div>

          <div className="min-w-0 flex-1 border-r border-[#D4D7DE] px-4">
            <p className="text-[15px] font-medium">Root Cause</p>

            <p className="mt-2.5 truncate text-[12px]">
              PostgreSQL connection pool exhaustion
            </p>
          </div>

          <div className="w-[28%] px-4">
            <p className="text-[15px] font-medium">Affected Service</p>

            <p className="mt-2.5 text-[12px]">pymt-svc</p>
          </div>
        </div>
      </section>

      <section className="grid items-stretch grid-cols-[475px_minmax(0,1fr)] gap-5 px-6 pb-4 pt-4">
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-[22px] bg-white px-5 py-4 max-h-[725px]">
          <div className="flex shrink-0 items-center gap-3">
            <h2 className="text-[27px] font-semibold tracking-[-0.7px]">
              Proposed Remediation
            </h2>

            <span className="rounded-[6px] bg-[#E8F5FC] px-2.5 py-1 text-[16px] font-semibold">
              3
            </span>
          </div>

          <p className="mt-4 shrink-0 text-[13px] text-[#333]">
            Actions are ranked by AI confidence and expected impact
          </p>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
            <div className="space-y-4 pb-2">
              <RemediationCard
                number="1"
                item={primary}
                recommended
                onApply={() => setPendingId(primary.id)}
              />

              <RemediationCard
                number="2"
                item={second}
                onApply={() => setPendingId(second.id)}
              />

              <RemediationCard
                number="3"
                item={third}
                onApply={() => setPendingId(third.id)}
              />

              <RemediationCard
                number="4"
                item={{
                  ...primary,
                  id: "demo-4",
                  title: "RESTART_PODS",
                  description: "Restart all pods to clear connection pool",
                  confidence: "55%",
                  riskLevel: "Low",
                  manualOnly: false,
                }}
                onApply={() => {}}
              />

              <RemediationCard
                number="5"
                item={{
                  ...primary,
                  id: "demo-5",
                  title: "INCREASE_TIMEOUT",
                  description: "Increase connection timeout settings",
                  confidence: "38%",
                  riskLevel: "Low",
                  manualOnly: false,
                }}
                onApply={() => {}}
              />
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-3">
          <section className="rounded-[22px] bg-white p-4 shadow-[0_2px_10px_rgba(60,80,120,0.03)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[11px] bg-[#FFF0F0]">
                  <RotateCcw
                    className="h-9 w-9 text-[#F00000]"
                    strokeWidth={3}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-4">
                    <h2 className="truncate text-[22px] font-semibold tracking-[-0.4px] text-[#F00000]">
                      ROLLBACK_DEPLOYMENT
                    </h2>

                    <span className="shrink-0 rounded-[6px] border border-[#FF9696] bg-[#FFF8F8] px-3 py-1.5 text-[11px] text-[#F00000]">
                      Manual Only
                    </span>
                  </div>

                  <p className="mt-3 truncate text-[13px]">
                    Rollback pymt-svc to the previous stable deployment version.
                  </p>
                </div>
              </div>

              <div className="flex min-w-[250px] shrink-0 rounded-[6px] border border-[#FF9292] bg-[#FFF8F8]">
                <div className="px-4 py-2.5">
                  <p className="text-[10px]">Risk Level</p>

                  <p className="mt-0.5 text-[20px] font-medium text-[#FF0000]">
                    HIGH
                  </p>
                </div>

                <div className="border-l border-[#FFB0B0] px-3 py-2.5 text-[8px] leading-[1.35]">
                  This action will change application
                  <br />
                  state and may impact users
                </div>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-[19px] bg-[#F6FBFD] shadow-[0_3px_15px_rgba(67,94,115,0.10)]">
                <div className="flex items-center gap-3 border-b border-[#C9D0D5] px-4 py-2.5">
                  <h3 className="text-[16px] font-medium">
                    Affected Resources
                  </h3>

                  <span className="rounded-[6px] bg-[#E5F4FC] px-2 py-0.5 text-[14px] font-semibold">
                    3
                  </span>
                </div>

                <ResourceRow
                  a="Deployment"
                  b="Namespace"
                  c="Replicas"
                  av="pymt-svc"
                  bv="payments"
                  cv="12"
                />

                <ResourceRow
                  a="Pods"
                  b="Current"
                  c="To be restarted"
                  av="pymt-svc"
                  bv="12 pods"
                  cv="12 pods"
                />

                <ResourceRow
                  a="Service"
                  b="Type"
                  c="Port"
                  av="pymt-svc"
                  bv="ClusterIP"
                  cv="8080"
                  last
                />
              </div>

              <div className="overflow-hidden rounded-[19px] bg-[#F6FBFD] shadow-[0_3px_15px_rgba(67,94,115,0.10)]">
                <div className="border-b border-[#C9D0D5] px-4 py-2.5">
                  <h3 className="text-[16px] font-medium">
                    Expected Impact
                  </h3>
                </div>

                <div className="space-y-2.5 px-4 py-3">
                  <ImpactRow>
                    Connection Errors should drop significantly within
                    <br />
                    2-5 minutes
                  </ImpactRow>

                  <ImpactRow>
                    Checkout success rate should return to normal
                  </ImpactRow>

                  <ImpactRow>No data loss expected</ImpactRow>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#D6DBDF] px-4 py-3 text-[11px]">
                  <span>Estimated recovery time</span>
                  <span>2-5 mins</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[22px] bg-white p-3.5">
            <div className="flex items-center justify-between border-b border-[#E2E5E8]">
              <div className="flex gap-8">
                <button
                  type="button"
                  className="border-b-2 border-blue-600 px-2 pb-2.5 text-[14px] font-medium text-blue-600"
                >
                  Simulation (Dry Run)
                </button>

                <button
                  type="button"
                  className="pb-2.5 text-[14px]"
                >
                  Details (YAML)
                </button>
              </div>

              <span className="pb-2.5 text-[9px] text-[#444]">
                ▣ &nbsp; May 22, 2026 15:15 - 15:41
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-[10px] bg-[#DFFBDD] px-3.5 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4EAD00]">
                <Check
                  className="h-[18px] w-[18px] text-white"
                  strokeWidth={3}
                />
              </div>

              <div>
                <p className="text-[14px] font-medium text-[#219600]">
                  Simulation Completed
                </p>

                <p className="text-[9px] text-[#222]">
                  Dry run finished successfully
                </p>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-4 gap-2.5">
              <MetricBox
                label="Affected Pods"
                value="12"
                detail="Pods will be restarted"
              />

              <MetricBox
                label="Unavailable Time"
                value="12s"
                detail="Estimated downtime"
              />

              <MetricBox
                label="Error Rate (peak)"
                value="82%"
                detail="Expected Improvement"
                green
                down
              />

              <MetricBox
                label="Success Rate"
                value="87%"
                detail="Expected after recovery"
                green
              />
            </div>
          </section>

          <div className="grid grid-cols-[1.55fr_0.9fr] gap-3">
            <section className="rounded-[22px] bg-white px-4 py-3">
              <h3 className="text-[15px] font-medium">
                Simulation Steps
              </h3>

              <div className="relative mt-5">
                <div className="absolute left-[6%] right-[6%] top-[6px] h-[2px] bg-[#5FB000]" />

                <div className="relative grid grid-cols-5">
                  {[
                    "Validate Prerequisites",
                    "Drain Connections",
                    "Rollback Deployment",
                    "Pods Restart",
                    "Readiness Check",
                  ].map((label, index) => (
                    <div key={label} className="text-center">
                      <div className="mx-auto flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#5FB000]">
                        <Check
                          className="h-2.5 w-2.5 text-white"
                          strokeWidth={3}
                        />
                      </div>

                      <p className="mt-2 px-1 text-[8px] leading-[11px]">
                        {index + 1}. {label}
                      </p>

                      <p className="mt-1.5 text-[8px] text-[#5EAD00]">
                        Passed
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[22px] bg-white px-4 py-3">
              <h3 className="text-[15px] font-medium">
                What will change
              </h3>

              <div className="mt-3 font-mono text-[8px] leading-[1.45]">
                <p>Deployment: pymt-svc</p>

                <p className="text-red-500">
                  - image: checkout-service:1.9.0
                </p>

                <p className="text-green-500">
                  + image: checkout-service:1.8.3
                </p>

                <p className="text-red-500">
                  - config.pool.maxOpenConns: 75
                </p>

                <p className="text-green-500">
                  + config.pool.maxOpenConns: 50
                </p>

                <p>replicas: 12</p>
              </div>
            </section>
          </div>
        </div>
      </section>

      {loading && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-white px-4 py-3 text-xs shadow-lg">
          Loading remediation...
        </div>
      )}

      {error && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 shadow-lg">
          Failed to load remediation data.
        </div>
      )}

      {message && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-green-50 px-4 py-3 text-xs text-green-700 shadow-lg">
          {message}
        </div>
      )}

      {pending && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[430px] rounded-[22px] border border-white/80 bg-gradient-to-br from-[#F5F8FA] to-[#DDEEF5] px-7 py-7 shadow-xl">
            <h2 className="text-center text-[25px] font-bold">
              {pending.manualOnly ? "Manual Only!" : "Apply Action"}
            </h2>

            <p className="mx-auto mt-4 text-center text-[13px]">
              Apply “{pending.title}” for {pending.incidentCode}?
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void apply(pending)}
                className="h-11 rounded-[12px] bg-[#E8EEFF] text-[13px] transition hover:bg-[#D8E2FF]"
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() => setPendingId(null)}
                className="h-11 rounded-[12px] bg-[#AFC7F8] text-[13px] transition hover:bg-[#9DB9EF]"
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

function RemediationCard({
  number,
  item,
  recommended = false,
}: {
  number: string;
  item: RemediationItem;
  recommended?: boolean;
  onApply: () => void;
}) {
  const isHigh = item.riskLevel === "High";

  const reason =
    number === "1"
      ? "Connection issues started right after config change and new deployment rollout."
      : number === "2"
        ? "High connection pool utilization > 95%"
        : "Resource saturation may contribute to connection timeouts";

  return (
    <article
      className={`rounded-[20px] border px-4 py-3.5 ${
        recommended
          ? "border-[#FF2929] bg-[#FFF7F7]"
          : isHigh
            ? "border-[#FF2929] bg-[#FFF9F9]"
            : "border-[#FF9900] bg-[#FFFAF4]"
      }`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border text-[15px] ${
              recommended
                ? "border-[#FF2929] text-[#FF0000]"
                : "border-[#FF9900] text-[#FF9900]"
            }`}
          >
            {number}
          </span>

          <span
            className={`min-w-0 text-[13px] font-medium leading-[17px] ${
              recommended ? "text-[#F00000]" : "text-[#FF9700]"
            }`}
          >
            {item.title}
          </span>
        </div>

        <span
          className={`shrink-0 rounded-[6px] border px-2.5 py-1 text-[9px] ${
            recommended
              ? "border-[#FF9B9B] text-[#F00000]"
              : "border-[#FFBF83] text-[#FF9700]"
          }`}
        >
          {item.manualOnly ? "Manual Only" : "Approval Required"}
        </span>
      </div>

      <p className="mt-3 text-[12px] leading-[18px]">
        {item.description}
      </p>

      <h4 className="mt-4 text-[12px] font-medium">
        Why recommended
      </h4>

      <div className="mt-1.5 flex gap-2 text-[11px] leading-[17px]">
        <span>•</span>

        <span>{reason}</span>
      </div>

      <div className="mt-4 border-t border-[#D9D0D0] pt-3">
        <div className="flex items-center justify-between text-[12px]">
          <span>
            Confidence{" "}
            <strong
              className={
                recommended
                  ? "ml-2 text-[#F00000]"
                  : "ml-2 text-[#FF9700]"
              }
            >
              {item.confidence}
            </strong>
          </span>

          <span>
            Risk{" "}
            <strong
              className={`ml-2 ${
                item.riskLevel === "High"
                  ? "text-[#F00000]"
                  : "text-[#FF9700]"
              }`}
            >
              {item.riskLevel}
            </strong>
          </span>
        </div>
      </div>
    </article>
  );
}

function ResourceRow({
  a,
  b,
  c,
  av,
  bv,
  cv,
  last = false,
}: {
  a: string;
  b: string;
  c: string;
  av: string;
  bv: string;
  cv: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-3 px-4 py-2.5 ${
        !last ? "border-b border-[#D8E0E4]" : ""
      }`}
    >
      <div>
        <p className="text-[10px]">{a}</p>

        <p className="mt-1 text-[12px] font-medium">
          {av}
        </p>
      </div>

      <div>
        <p className="text-[10px]">{b}</p>

        <p className="mt-1 text-[12px] font-medium">
          {bv}
        </p>
      </div>

      <div>
        <p className="text-[10px]">{c}</p>

        <p className="mt-1 text-[12px] font-medium">
          {cv}
        </p>
      </div>
    </div>
  );
}

function ImpactRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2 text-[11px] leading-[17px]">
      <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#5CB800]">
        <Check
          className="h-2.5 w-2.5 text-white"
          strokeWidth={4}
        />
      </span>

      <span>{children}</span>
    </div>
  );
}

function MetricBox({
  label,
  value,
  detail,
  green = false,
  down = false,
}: {
  label: string;
  value: string;
  detail: string;
  green?: boolean;
  down?: boolean;
}) {
  return (
    <div className="rounded-[15px] border border-[#BFC2C5] px-3 py-2.5">
      <p className="text-[10px] text-[#333]">
        {label}
      </p>

      <p
        className={`mt-1.5 text-[19px] font-semibold ${
          green ? "text-[#00A800]" : "text-[#111]"
        }`}
      >
        {green && (
          <span className="mr-1 text-[18px]">
            {down ? "↓" : "↑"}
          </span>
        )}

        {value}
      </p>

      <p className="mt-0.5 text-[9px] text-[#555]">
        {detail}
      </p>
    </div>
  );
}