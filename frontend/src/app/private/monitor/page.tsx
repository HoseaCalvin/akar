"use client";

import type { ReactNode } from "react";
import TopBar from "@/components/TopBar";

interface MetricCardProps {
    title: string;
    centerText?: string;
    status: string;
    statusColor: string;
    lineColor: string;
    graph: ReactNode;
}

export default function Monitor() {
    return (
        <main className="relative min-h-screen px-7 pb-8 pt-5 text-[#243654]">
            <section className="flex min-h-[72px] items-center justify-between gap-6">
                <div className="flex min-w-0 items-center gap-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        aria-label="Go back"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0F214B] transition hover:bg-white/70"
                    >
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15 18L9 12L15 6"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <h1 className="truncate text-2xl font-bold tracking-tight text-[#0F214B] md:text-3xl">
                        postgresql-primary (StatefulSet DB)
                    </h1>
                </div>

                <div className="shrink-0">
                    <TopBar />
                </div>
            </section>

            <section className="mt-7 rounded-2xl border border-white/70 bg-white/65 px-8 py-4 shadow-[0_8px_20px_rgba(42,72,140,0.12)] backdrop-blur-md">
                <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 xl:grid-cols-5">
                    <div>
                        <p className="text-xs font-bold tracking-wider text-slate-500">
                            NAMESPACE
                        </p>

                        <h3 className="mt-3 font-bold text-[#243654]">
                            production-db
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Cluster: k8s-prod-01
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-bold tracking-wider text-slate-500">
                            NODE HOST
                        </p>

                        <h3 className="mt-3 font-bold text-[#243654]">
                            worker-node-02
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            IP: 10.244.2.18
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-bold tracking-wider text-slate-500">
                            IMAGE / VERSION
                        </p>

                        <h3 className="mt-3 font-bold text-[#243654]">
                            postgres:15.3-alpine
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Uptime: 14d 6h
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-bold tracking-wider text-slate-500">
                            ACTIVE INCIDENTS
                        </p>

                        <h3 className="mt-3 font-bold text-[#D94A43]">
                            1 Incident Linked
                        </h3>

                        <p className="mt-2 text-sm text-[#B84A45]">
                            INC-0482 (Root Cause)
                        </p>
                    </div>

                    <div className="flex justify-start xl:justify-end">
                        <button
                            type="button"
                            className="rounded-xl border border-[#9CB8E8] bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white hover:shadow-md"
                        >
                            View Investigation ↗
                        </button>
                    </div>
                </div>
            </section>

            <section className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-bold text-[#243654]">
                    Live Resource Metrics & Anomalies
                </h2>

                <div className="w-fit rounded-2xl border border-slate-200 bg-white/70 px-7 py-4 text-sm text-slate-500 shadow-sm">
                    Window: Last 30m
                </div>
            </section>

            <section className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
                <div className="space-y-5">
                    <MetricCard
                        title="Active Connections vs Max Limit"
                        centerText="Max Limit: 100 conns"
                        status="99.8% (Exhausted)"
                        statusColor="text-[#D94A43]"
                        lineColor="border-[#E85B5B]"
                        graph={
                            <div className="relative h-[150px] overflow-hidden">
                                <svg
                                    viewBox="0 0 700 160"
                                    preserveAspectRatio="none"
                                    className="absolute inset-0 h-full w-full"
                                >
                                    <defs>
                                        <linearGradient
                                            id="redGradient"
                                            x1="0"
                                            x2="0"
                                            y1="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#FF7A7A"
                                                stopOpacity="0.8"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#FF7A7A"
                                                stopOpacity="0.05"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <path
                                        d="M0 145 L150 140 L330 137 L460 132 L540 65 Q600 10 650 25 Q680 32 700 55 L700 150 L0 150 Z"
                                        fill="url(#redGradient)"
                                    />

                                    <path
                                        d="M0 145 L150 140 L330 137 L460 132 L540 65 Q600 10 650 25 Q680 32 700 55"
                                        fill="none"
                                        stroke="#FF3B3B"
                                        strokeWidth="3"
                                    />
                                </svg>
                            </div>
                        }
                    />

                    <MetricCard
                        title="CPU Usage & Memory Allocation"
                        status="CPU 42% • RAM 68%"
                        statusColor="text-[#258B73]"
                        lineColor="border-[#6DB6A3]"
                        graph={
                            <div className="relative h-[145px] overflow-hidden">
                                <svg
                                    viewBox="0 0 700 160"
                                    preserveAspectRatio="none"
                                    className="absolute inset-0 h-full w-full"
                                >
                                    <defs>
                                        <linearGradient
                                            id="greenGradient"
                                            x1="0"
                                            x2="0"
                                            y1="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#57B99E"
                                                stopOpacity="0.85"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#57B99E"
                                                stopOpacity="0.08"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <path
                                        d="M0 100 C100 100 180 95 270 92 C350 88 420 82 470 90 C550 94 580 75 700 72 L700 150 L0 150 Z"
                                        fill="url(#greenGradient)"
                                    />

                                    <path
                                        d="M0 100 C100 100 180 95 270 92 C350 88 420 82 470 90 C550 94 580 75 700 72"
                                        fill="none"
                                        stroke="#2D9B81"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                        }
                    />

                    <MetricCard
                        title="Disk Read/Write Latency (ms)"
                        status="Avg. 3.4ms"
                        statusColor="text-slate-500"
                        lineColor="border-[#7DB8A8]"
                        graph={
                            <div className="relative h-[145px] overflow-hidden">
                                <svg
                                    viewBox="0 0 700 160"
                                    preserveAspectRatio="none"
                                    className="absolute inset-0 h-full w-full"
                                >
                                    <defs>
                                        <linearGradient
                                            id="purpleGradient"
                                            x1="0"
                                            x2="0"
                                            y1="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#6D45D6"
                                                stopOpacity="0.9"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#6D45D6"
                                                stopOpacity="0.1"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <path
                                        d="M0 75 L220 75 Q300 75 410 70 Q450 68 470 85 Q500 105 540 80 Q620 25 700 55 L700 150 L0 150 Z"
                                        fill="url(#purpleGradient)"
                                    />

                                    <path
                                        d="M0 75 L220 75 Q300 75 410 70 Q450 68 470 85 Q500 105 540 80 Q620 25 700 55"
                                        fill="none"
                                        stroke="#6E42D5"
                                        strokeWidth="3"
                                    />
                                </svg>
                            </div>
                        }
                    />
                </div>

                <div className="space-y-5">
                    <section className="rounded-[28px] border border-white bg-white/80 p-8 shadow-[0_10px_25px_rgba(42,72,140,0.12)]">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <h2 className="text-xl font-bold text-[#243654] md:text-2xl">
                                📄 Recent Container Logs (Loki)
                            </h2>

                            <span className="shrink-0 font-semibold text-slate-500">
                                Live Tail
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-xl bg-[#07090C] p-5 font-mono text-sm leading-7 shadow-inner">
                            <p className="text-[#B6A98B]">
                                [14:07:20] LOG: database system is ready
                            </p>

                            <p className="mt-2 text-[#FF6565]">
                                [14:07:22] FATAL: remaining connection slots are
                                reserved for non-superuser connections
                            </p>

                            <p className="mt-2 text-slate-400">
                                [14:07:24] pg_stat_activity: active=99, idle=1
                            </p>

                            <p className="mt-2 text-[#FF6565]">
                                [14:07:26] ERROR: conn pool rejected client
                            </p>

                            <p className="mt-2 text-[#61B7E8]">
                                [14:07:29] otel-collector: metric pushed
                            </p>

                            <p className="mt-2 text-slate-400">
                                [14:07:35] healthcheck probe failed: 500 error
                            </p>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-white bg-white/80 p-8 shadow-[0_10px_25px_rgba(42,72,140,0.12)]">
                        <h2 className="mb-5 text-xl font-bold text-[#243654] md:text-2xl">
                            Distributed Traces (Tempo)
                        </h2>

                        <div className="space-y-4">
                            <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                                <p className="font-bold text-[#B8423B]">
                                    Trace: #8f21bc90a (POST /checkout)
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Duration: 4,821ms • Status: 504 Timeout
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
                                <p className="font-bold text-[#243654]">
                                    Trace: #2a77cc01d (GET /inventory)
                                </p>

                                <p className="mt-1 text-sm text-[#258B73]">
                                    Duration: 34ms • Status: 200 OK
                                </p>
                            </div>

                            <button
                                type="button"
                                className="w-full rounded-xl border border-[#AAB7CB] bg-[#E9EEF7] py-5 font-bold text-[#365996] transition hover:bg-[#DCE6F5] hover:shadow-sm"
                            >
                                Inspect Full Span Cascade →
                            </button>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}

function MetricCard({
    title,
    centerText,
    status,
    statusColor,
    lineColor,
    graph,
}: MetricCardProps) {
    return (
        <section className="min-h-[250px] overflow-hidden rounded-[28px] border border-white bg-white/80 p-7 shadow-[0_10px_25px_rgba(42,72,140,0.12)]">
            <div
                className={`flex flex-col gap-2 border-b border-dashed pb-2 ${lineColor} md:flex-row md:items-center md:justify-between`}
            >
                <h2 className="text-lg font-medium text-[#243654] md:text-xl">
                    {title}
                </h2>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    {centerText && (
                        <span className="text-sm text-[#C64A40] md:text-base">
                            {centerText}
                        </span>
                    )}

                    <span
                        className={`text-sm font-bold md:text-base ${statusColor}`}
                    >
                        {status}
                    </span>
                </div>
            </div>

            {graph}
        </section>
    );
}