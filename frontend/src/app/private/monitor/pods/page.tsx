"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import HighlightBox from "@/components/HighlightBox";
import TableDetail from "@/components/TableDetail";
import PageState from "@/components/PageState";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  CircleDot,
  Container,
  Cpu,
  RefreshCw,
  Server,
} from "lucide-react";
import {
  getDescriptionColor,
  getRowBackgroundColor,
  getBadgeColor,
  getBadgeTextColor,
} from "@/utils/row-style";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export default function Pods() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data, loading, error } = useApi(`pods:${search}`, () =>
    api.monitor.pods(search || undefined),
  );

  const items = data?.items ?? [];

  const statusSummary = useMemo(() => {
    const summary = new Map<string, number>();

    items.forEach((item) => {
      const status = item.status || "UNKNOWN";
      summary.set(status, (summary.get(status) || 0) + 1);
    });

    return Array.from(summary.entries()).sort((a, b) => b[1] - a[1]);
  }, [items]);

  const healthyCount = useMemo(() => {
    return items.filter((item) => {
      const status = item.status?.toUpperCase();

      return (
        status === "HEALTHY" ||
        status === "RUNNING" ||
        status === "READY" ||
        status === "ACTIVE"
      );
    }).length;
  }, [items]);

  const attentionCount = Math.max(items.length - healthyCount, 0);

  const healthPercentage =
    items.length > 0
      ? Math.round((healthyCount / items.length) * 100)
      : 0;

  return (
    <main className="relative flex min-h-full flex-col bg-[#F8FAFC] px-6 py-5 lg:px-8 xl:px-10 2xl:px-14 text-[#243654]">
      <TopBar />

      <section className="flex flex-col gap-5 pb-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Back to inventory"
            onClick={() =>
              router.push("/private/monitor/inventory")
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white bg-white text-[#0F214B] shadow-sm transition hover:-translate-x-0.5 hover:shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 shadow-sm">
              <Container className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#0F214B]">
                  Pods Directory
                </h1>

                <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-400">
                Monitor pod health, workload placement and resource usage
              </p>
            </div>
          </div>
        </div>

        {data && (
          <div className="flex items-center gap-3 rounded-xl border border-white bg-white/80 px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <Activity className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pod Inventory
              </p>

              <p className="mt-0.5 text-sm font-bold text-[#243654]">
                {items.length} active resources
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="flex w-full flex-wrap gap-4">
        {data?.highlights.map((item) => (
          <HighlightBox
            key={item.title}
            title={item.title}
            value={item.value}
            description={item.description}
            tone={item.tone}
          />
        ))}
      </section>

      {data && (
        <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <section className="rounded-2xl border border-white bg-white/80 p-5 shadow-[0_6px_24px_rgba(42,72,140,0.06)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-500" />

                  <h2 className="font-bold text-[#243654]">
                    Pod Fleet Overview
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Current distribution of pods across the cluster
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                  {items.length} total
                </span>

                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                  {healthPercentage}% healthy
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[160px_1fr] md:items-center">
              <div className="flex justify-center">
                <HealthRing
                  percentage={healthPercentage}
                  healthy={healthyCount}
                />
              </div>

              <div className="space-y-3">
                {statusSummary.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-xs text-slate-400">
                    No pod status data available
                  </div>
                ) : (
                  statusSummary.slice(0, 4).map(([status, count]) => {
                    const percentage =
                      items.length > 0
                        ? Math.round((count / items.length) * 100)
                        : 0;

                    const healthy = isHealthyStatus(status);

                    return (
                      <div
                        key={status}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                healthy
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />

                            <span className="truncate text-xs font-bold text-slate-600">
                              {status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#243654]">
                              {count}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              {percentage}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              healthy
                                ? "bg-emerald-400"
                                : "bg-amber-400"
                            }`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white bg-white/80 p-5 shadow-[0_6px_24px_rgba(42,72,140,0.06)]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />

              <h2 className="font-bold text-[#243654]">
                Pod Attention
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Resources that may require investigation
            </p>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Attention
                </p>

                <p className="mt-1 text-3xl font-bold text-[#243654]">
                  {attentionCount}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  pods requiring review
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-start gap-3">
                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

                <div>
                  <p className="text-xs font-bold text-blue-700">
                    Monitoring continuously
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-blue-600/70">
                    Use the directory below to inspect individual pod
                    placement, resources and runtime status.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      )}

      <section className="mt-5">
        <TableDetail
          counts={data?.counts}
          search={search}
          onSearchChange={setSearch}
        >
          <section className="w-full space-y-3 overflow-y-auto lg:mt-5">
            <div className="sticky top-0 z-20 grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] rounded-xl border border-slate-200/80 bg-white/95 px-5 py-3.5 text-sm shadow-sm backdrop-blur *:text-slate-500 *:font-semibold">
              <div className="flex items-center gap-2">
                <Container className="h-4 w-4 text-sky-500" />
                <h1>POD NAME</h1>
              </div>

              <div className="flex items-center">
                <h1>NODE HOST</h1>
              </div>

              <div className="flex items-center">
                <h1>NAMESPACE</h1>
              </div>

              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-slate-400" />
                <h1>RESTARTS</h1>
              </div>

              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-slate-400" />
                <h1>RESOURCES</h1>
              </div>

              <div className="flex items-center">
                <h1>STATUS</h1>
              </div>

              <div className="flex items-center">
                <h1>ACTION</h1>
              </div>
            </div>

            <PageState
              loading={loading}
              error={error}
              empty={
                !loading &&
                (data?.items.length ?? 0) === 0
              }
            />

            {data?.items.map((item) => {
              const healthy = isHealthyStatus(item.status);
              const restartCount = Number(item.restarts) || 0;

              return (
                <div
                  key={item.id}
                  className={`group grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(42,72,140,0.10)] ${getRowBackgroundColor(
                    item.status,
                  )} lg:px-5 lg:py-4`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        healthy
                          ? "border-emerald-100 bg-emerald-50 text-emerald-500"
                          : "border-amber-100 bg-amber-50 text-amber-500"
                      }`}
                    >
                      <Container className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0 md:space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-[#243654]">
                          {item.name}
                        </span>

                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            healthy
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                      </div>

                      <span
                        className={`block truncate text-xs ${getDescriptionColor(
                          item.status,
                        )}`}
                      >
                        {item.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col justify-center">
                    <span className="truncate text-xs font-medium text-slate-500">
                      {item.nodeHost}
                    </span>

                    <span className="mt-1 text-[10px] text-slate-400">
                      Worker node
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-col justify-center">
                    <span className="truncate text-xs font-medium text-slate-500">
                      {item.namespace}
                    </span>

                    <span className="mt-1 text-[10px] text-slate-400">
                      Namespace
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${
                        restartCount > 0
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />

                      <span className="text-sm font-bold">
                        {item.restarts}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-center">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                        <span className="truncate text-xs font-bold text-slate-600">
                          {item.cpuRam}
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-[62%] rounded-full bg-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 shadow-sm ${getBadgeColor(
                        item.status,
                      )}`}
                    >
                      {healthy ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <CircleDot className="h-3.5 w-3.5" />
                      )}

                      <span
                        className={`text-xs font-bold ${getBadgeTextColor(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Link
                      href={`/private/monitor/resources/${item.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-blue-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      Inspect
                      <Activity className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        </TableDetail>
      </section>
    </main>
  );
}

function isHealthyStatus(status: string) {
  const normalized = status?.toUpperCase();

  return (
    normalized === "HEALTHY" ||
    normalized === "RUNNING" ||
    normalized === "READY" ||
    normalized === "ACTIVE"
  );
}

function HealthRing({
  percentage,
  healthy,
}: {
  percentage: number;
  healthy: number;
}) {
  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            #34d399 0% ${percentage}%,
            #E2E8F0 ${percentage}% 100%
          )`,
        }}
      />

      <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-sm">
        <span className="text-3xl font-bold text-[#243654]">
          {percentage}%
        </span>

        <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
          Healthy
        </span>

        <span className="mt-0.5 text-[9px] text-slate-400">
          {healthy} pods
        </span>
      </div>
    </div>
  );
}