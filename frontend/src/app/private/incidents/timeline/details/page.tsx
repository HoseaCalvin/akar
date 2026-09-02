"use client";

import TopBar from "@/components/TopBar";
import {
    ChevronLeft,
    CalendarDays,
    CircleDot,
    ExternalLink,
    Atom,
    Info,
    Activity,
} from "lucide-react";

export default function IncidentTImelineDetails() {
    return (
        <main className="main-container min-h-screen px-5 pb-7 pt-4 text-[#17294D] md:px-7 md:pt-5">

            <section className="flex min-h-[72px] items-center justify-between gap-6">
                <div className="flex min-w-0 items-center gap-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        aria-label="Go back"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-white"
                    >
                        <ChevronLeft className="h-8 w-8 text-black" />
                    </button>

                    <div className="flex min-w-0 items-center gap-5">
                        <h1 className="shrink-0 text-2xl font-bold text-black md:text-3xl">
                            INC-4082
                        </h1>

                        <h2 className="truncate text-2xl font-semibold text-black md:text-3xl">
                            Storage & DB Conn Failure
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
                    <span>May 22, 2026 15:15 - 15:41 (26m 14s)</span>
                </div>

                <div className="flex items-center gap-2">
                    <CircleDot className="h-[18px] w-[18px]" />
                    <span>
                        Affected Service:{" "}
                        <strong className="font-bold">pymt-svc</strong>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Activity className="h-[18px] w-[18px]" />
                    <span>
                        Environment:{" "}
                        <strong className="font-bold">production</strong>
                    </span>
                </div>
            </section>

            <section className="mb-4 rounded-[22px] border border-white bg-white/70 px-7 py-5 shadow-[0_5px_25px_rgba(56,76,130,0.05)]">

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr_0.7fr_auto] lg:items-center">

                    <div className="border-b pb-4 lg:border-b-0 lg:border-r lg:pb-0">
                        <h3 className="text-[18px] font-bold">
                            Deployment / Config Change
                        </h3>

                        <p className="mt-2 text-[15px]">
                            3m 34s before first anomaly detected
                        </p>
                    </div>

                    <MetaItem
                        label="Change by"
                        value="Jane Doe"
                    />

                    <MetaItem
                        label="Type"
                        value="Config Change"
                    />

                    <MetaItem
                        label="Resource"
                        value="config/checkout-db.yaml"
                    />

                    <MetaItem
                        label="Change ID"
                        value="CFG-93217"
                    />

                    <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#9dbaff] bg-[#eaf1ff] px-4 text-[14px] font-medium text-[#17294D] transition hover:bg-[#dce8ff]">
                        View Investigation
                        <ExternalLink className="h-4 w-4" />
                    </button>
                </div>

                <p className="mt-5 text-[15px]">
                    Connection pool size changed from 50 → 70 in pymt-svc deployment
                </p>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                <div className="space-y-4">

                    <section className="rounded-[22px] border border-white bg-white/65 p-7 shadow-[0_5px_25px_rgba(56,76,130,0.05)]">
                        <h3 className="mb-3 text-[18px] font-bold">
                            What Changed
                        </h3>

                        <div className="overflow-hidden rounded-xl border border-[#9bc2ff] bg-white">

                            <div className="flex items-center justify-between bg-[#e5f2ff] px-4 py-2.5">
                                <span className="text-[14px]">
                                    config/checkout-db.yaml
                                </span>

                                <button className="flex h-8 items-center gap-2 rounded-lg border border-[#a7c2ff] bg-[#eaf1ff] px-4 text-[13px]">
                                    View Full
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="px-4 py-4 font-mono text-[14px] leading-[2]">
                                <CodeLine number="12">
                                    <span className="text-blue-600">database:</span>
                                </CodeLine>

                                <CodeLine number="13">
                                    <span className="ml-8 text-[#26344d]">
                                        host:
                                    </span>{" "}
                                    <span className="text-[#603b3b]">
                                        postgres-primary.checkout.svc.cluster.local
                                    </span>
                                </CodeLine>

                                <CodeLine number="14">
                                    <span className="ml-8 text-[#26344d]">
                                        port:
                                    </span>{" "}
                                    <span className="text-[#603b3b]">
                                        5432
                                    </span>
                                </CodeLine>

                                <CodeLine number="15">
                                    <span className="ml-8 text-blue-600">
                                        pool:
                                    </span>
                                </CodeLine>

                                <CodeLine number="16">
                                    <span className="ml-16 text-red-500">
                                        maxOpenConns: 75
                                    </span>
                                </CodeLine>

                                <CodeLine number="17">
                                    <span className="ml-16 text-green-500">
                                        maxIdleConns: 20
                                    </span>
                                </CodeLine>

                                <CodeLine number="18">
                                    <span className="ml-16 text-[#603b3b]">
                                        connMaxLifetime: 30m
                                    </span>
                                </CodeLine>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[22px] border border-white bg-white/65 p-4 shadow-[0_5px_25px_rgba(56,76,130,0.05)]">
                        <h3 className="mb-2 px-3 text-[18px] font-bold">
                            Related Signals
                        </h3>

                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">

                            <SignalCard
                                title="Database Connections (active)"
                                value="56"
                                suffix="connections"
                                type="database"
                            />

                            <SignalCard
                                title="Checkout Error Rate"
                                value="0.2%"
                                suffix=""
                                type="error"
                            />

                        </div>
                    </section>
                </div>

                <section className="rounded-[22px] border border-white bg-white/65 p-7 shadow-[0_5px_25px_rgba(56,76,130,0.05)]">

                    <h3 className="mb-3 text-[18px] font-bold">
                        AI Impact Summary
                    </h3>

                    <div className="rounded-[22px] border border-[#b9b7ff] bg-[#e8f3ff] px-5 py-5">
                        <div className="flex gap-4">
                            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173d8f] text-white">
                                <Atom className="h-6 w-6" />
                            </div>

                            <div>
                                <h4 className="text-[18px] font-bold text-[#0b3184]">
                                    This change increased the database connection pool size
                                </h4>

                                <p className="mt-2 text-[16px] leading-6 text-[#0b3184]">
                                    Higher pool size may increase database load and connection
                                    if not matched with database capacity
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 rounded-[20px] bg-[#eef5fc] px-4 py-5">

                        <RiskItem
                            label="Risk Level"
                            value="Medium"
                        />

                        <RiskItem
                            label="Potential Impact"
                            value="Performance Degradation"
                        />

                        <RiskItem
                            label="Likelihood of Impact"
                            value="Possible (42%)"
                        />

                    </div>

                    <div className="mt-5">
                        <h4 className="text-[15px] font-semibold">
                            Why this matters
                        </h4>

                        <p className="mt-2 max-w-[570px] text-[14px] leading-5 text-[#1d2029]">
                            Increasing the connection pool may lead to connection exhaustion,
                            timeouts and cascading failures if the database cannot handle
                            the additional connections
                        </p>
                    </div>

                    <div className="mt-7">

                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-[18px] font-bold">
                                Related Events
                            </h3>

                            <button className="text-[13px] text-[#1670ff]">
                                Full timeline →
                            </button>
                        </div>

                        <TimelineEvent
                            time="15:18:42"
                            title="First Anomaly Detected"
                            color="red"
                            description={
                                <>
                                    PostgreSQL timeout errors increased
                                    <br />
                                    Error rate raised to 2.3% (threshold: 1%)
                                </>
                            }
                            metric="postgresql.timeout"
                        />

                        <TimelineEvent
                            time="15:19:02"
                            title="Downstream Anomalies"
                            color="orange"
                            description={
                                <>
                                    Payment latency increased
                                    <br />
                                    3 Pods affected, error rate 2.8%
                                </>
                            }
                            metric="3"
                            metricLabel="Affected Pods"
                        />

                    </div>
                </section>
            </section>

            <section className="mt-4 flex flex-col gap-4 rounded-[18px] border border-[#9caeff] bg-[#e4f2ff] px-6 py-4 md:flex-row md:items-center">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-[#123e8e] text-[#123e8e]">
                    <Info className="h-6 w-6" />
                </div>

                <p className="flex-1 text-[16px] leading-6 text-[#103b89]">
                    This change occurred 3m 34s before the first anomaly and is correlated
                    with the incidents AKAR identified it as a potential contributing factor
                </p>

                <button className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#a6bfff] bg-[#eaf2ff] px-4 py-2.5 text-[13px] font-medium text-[#17294D]">
                    Ask AI about this change
                    <ExternalLink className="h-4 w-4" />
                </button>

            </section>
        </main>
    );
}

function MetaItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-[13px] text-[#202638]">
                {label}
            </p>

            <p className="mt-2 text-[14px] font-bold">
                {value}
            </p>
        </div>
    );
}

function CodeLine({
    number,
    children,
}: {
    number: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <span className="mr-5 w-4 select-none text-gray-600">
                {number}
            </span>

            <span>{children}</span>
        </div>
    );
}

function RiskItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="px-2">
            <p className="text-[16px] text-gray-500">
                {label}
            </p>

            <p className="mt-5 text-[17px] font-medium text-[#171b23]">
                {value}
            </p>
        </div>
    );
}

function TimelineEvent({
    time,
    title,
    description,
    metric,
    metricLabel,
    color,
}: {
    time: string;
    title: string;
    description: React.ReactNode;
    metric: string;
    metricLabel?: string;
    color: "red" | "orange";
}) {
    const isRed = color === "red";

    return (
        <div className="relative flex gap-4">

            <div className="relative flex w-[138px] shrink-0 items-start">

                <div
                    className={`relative z-10 mt-2 h-10 w-10 shrink-0 rounded-full ${
                        isRed ? "bg-red-500" : "bg-orange-500"
                    }`}
                />

                <div
                    className={`absolute left-[18px] top-0 h-full w-[4px] ${
                        isRed ? "bg-orange-500" : "bg-orange-400"
                    }`}
                />

                <span
                    className={`ml-5 mt-4 whitespace-nowrap text-[12px] font-medium ${
                        isRed ? "text-red-500" : "text-orange-500"
                    }`}
                >
                    {time}
                </span>
            </div>

            <div className="mb-2 flex flex-1 items-center justify-between gap-4 rounded-[15px] bg-[#eef5fc] px-4 py-3">

                <div>
                    <h4
                        className={`text-[12px] font-bold ${
                            isRed ? "text-red-500" : "text-orange-500"
                        }`}
                    >
                        {title}
                    </h4>

                    <p className="mt-1 text-[11px] leading-4 text-[#343942]">
                        {description}
                    </p>
                </div>

                <div className="min-w-[120px] border-l border-gray-300 pl-4">
                    {metricLabel && (
                        <p className="text-[11px] text-gray-600">
                            {metricLabel}
                        </p>
                    )}

                    {!metricLabel && (
                        <p className="text-[11px] text-gray-600">
                            Metric
                        </p>
                    )}

                    <p className="mt-2 text-[11px] font-semibold">
                        {metric}
                    </p>
                </div>

            </div>
        </div>
    );
}

function SignalCard({
    title,
    value,
    suffix,
    type,
}: {
    title: string;
    value: string;
    suffix: string;
    type: "database" | "error";
}) {
    return (
        <div className="rounded-xl bg-white px-3 py-2">

            <p className="text-[13px]">
                {title}
            </p>

            <p className="mt-1 text-[28px] font-bold leading-none text-black">
                {value}
            </p>

            {suffix && (
                <p className="text-[10px] text-gray-500">
                    {suffix}
                </p>
            )}

            <div className="mt-2 h-[80px] overflow-hidden">
                <svg
                    viewBox="0 0 300 90"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                >
                    <defs>
                        <linearGradient
                            id={`${type}-gradient`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor={type === "database" ? "#527BFF" : "#FF5B5B"}
                                stopOpacity="0.35"
                            />

                            <stop
                                offset="100%"
                                stopColor={type === "database" ? "#527BFF" : "#FF5B5B"}
                                stopOpacity="0"
                            />
                        </linearGradient>
                    </defs>

                    <path
                        d={
                            type === "database"
                                ? "M0 82 L15 75 L30 82 L45 65 L60 74 L75 57 L90 45 L105 50 L120 20 L135 38 L150 18 L165 42 L180 38 L195 40 L210 27 L225 18 L240 35 L255 25 L270 38 L285 20 L300 20 L300 90 L0 90 Z"
                                : "M0 82 L15 76 L30 80 L45 62 L60 75 L75 55 L90 43 L105 49 L120 20 L135 27 L150 38 L165 15 L180 40 L195 18 L210 42 L225 40 L240 30 L255 42 L270 30 L285 15 L300 15 L300 90 L0 90 Z"
                        }
                        fill={`url(#${type}-gradient)`}
                    />

                    <path
                        d={
                            type === "database"
                                ? "M0 82 L15 75 L30 82 L45 65 L60 74 L75 57 L90 45 L105 50 L120 20 L135 38 L150 18 L165 42 L180 38 L195 40 L210 27 L225 18 L240 35 L255 25 L270 38 L285 20 L300 20"
                                : "M0 82 L15 76 L30 80 L45 62 L60 75 L75 55 L90 43 L105 49 L120 20 L135 27 L150 38 L165 15 L180 40 L195 18 L210 42 L225 40 L240 30 L255 42 L270 30 L285 15 L300 15"
                        }
                        fill="none"
                        stroke={type === "database" ? "#527BFF" : "#ff4b4b"}
                        strokeWidth="2"
                    />
                </svg>
            </div>

            <div className="flex justify-between text-[8px] text-gray-500">
                <span>15:06</span>
                <span>15:15</span>
                <span>15:25</span>
            </div>
        </div>
    );
}