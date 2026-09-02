"use client";

import TopBar from "@/components/TopBar";
import {
    ChevronLeft,
    ExternalLink,
    CheckCircle2,
} from "lucide-react";

interface TimelineItem {
    time: string;
    title: string;
    description: string[];
    color: string;
    details: {
        label: string;
        value: string;
        valueColor?: string;
    }[];
}

const timelineItems: TimelineItem[] = [
    {
        time: "15:15:08",
        title: "Deployment / Config Change",
        description: [
            "Connection pool size changed",
            "From 50→75 in pymt-svc",
        ],
        color: "#FF0000",
        details: [
            {
                label: "Change by",
                value: "Jane Doe",
            },
            {
                label: "Type",
                value: "Config Change",
            },
            {
                label: "Resource",
                value: "config/checkout-db.yaml",
            },
        ],
    },
    {
        time: "15:18:42",
        title: "First Anomaly Detected",
        description: [
            "PostgreSQL timeout errors increased",
            "Error rate raised to 2.3% (threshold: 1%)",
        ],
        color: "#F1272D",
        details: [
            {
                label: "Metric",
                value: "postgresql.timeout",
            },
            {
                label: "Value",
                value: "2.3%",
            },
            {
                label: "Threshold",
                value: ">1%",
            },
        ],
    },
    {
        time: "15:19:02",
        title: "Downstream Anomalies",
        description: [
            "Payment latency increased",
            "3 Pods affected, error rate 2.8%",
        ],
        color: "#F45B1B",
        details: [
            {
                label: "Affected Pods",
                value: "3",
            },
            {
                label: "Latency",
                value: "3.6s (259%)",
            },
            {
                label: "Error Rate",
                value: "2.8%",
            },
        ],
    },
    {
        time: "15:19:27",
        title: "Incident Detected",
        description: [
            "AKAR detected an incident and",
            "created INC-4082",
        ],
        color: "#F39A18",
        details: [
            {
                label: "Severity",
                value: "Critical",
                valueColor: "text-red-500",
            },
            {
                label: "Impact",
                value: "High",
            },
            {
                label: "Status",
                value: "Open",
            },
        ],
    },
    {
        time: "15:27:13",
        title: "RCA Identified",
        description: [
            "PostgreSQL connection pool exhaustion",
            "confidence 94%",
        ],
        color: "#F2C318",
        details: [
            {
                label: "Root Cause",
                value: "Connection pool exhaustion",
            },
            {
                label: "Confidence",
                value: "94%",
            },
            {
                label: "Signals",
                value: "4 supporting, 1 contradicting",
            },
        ],
    },
    {
        time: "15:30:02",
        title: "Remediation Executed",
        description: [
            "Rollback config change",
            "Connection pool size reverted to 50",
        ],
        color: "#E9EE13",
        details: [
            {
                label: "Action",
                value: "rollback configuration",
            },
            {
                label: "By",
                value: "John Doe",
            },
            {
                label: "Status",
                value: "Success",
                valueColor: "text-green-600",
            },
        ],
    },
    {
        time: "15:41:56",
        title: "Service Recovered",
        description: [
            "Rollback config change",
            "Connection pool size reverted to 50",
        ],
        color: "#36E51F",
        details: [
            {
                label: "Error Rate",
                value: "0%",
            },
            {
                label: "Latency",
                value: "240ms",
            },
            {
                label: "Status",
                value: "Recovered",
                valueColor: "text-green-600",
            },
        ],
    },
];

export default function IncidentTimeline() {
    return (
        <main className="main-container min-h-screen px-7 pb-8 pt-5 text-[#17294D]">
            <section className="flex min-h-[72px] items-center justify-between gap-6">
                <div className="flex min-w-0 items-center gap-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        aria-label="Go back"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-white/60"
                    >
                        <ChevronLeft className="h-8 w-8" />
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

            <section className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-3 xl:grid-cols-6">
                <div>
                    <p className="text-sm font-bold text-black">Status</p>

                    <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#55B91B]">
                        <CheckCircle2 className="h-3.5 w-3.5 fill-[#55B91B] text-white" />
                        Recovered
                    </p>
                </div>

                <div>
                    <p className="text-sm font-bold text-black">Severity</p>

                    <p className="mt-3 text-sm font-medium text-red-500">
                        Critical
                    </p>
                </div>

                <div>
                    <p className="text-sm font-bold text-black">Duration</p>

                    <p className="mt-3 text-sm font-medium text-black">
                        23m 14s
                    </p>
                </div>

                <div>
                    <p className="text-sm font-bold text-black">Start Time</p>

                    <p className="mt-3 text-sm font-medium text-black">
                        Aug 22, 2026 15:15:08
                    </p>
                </div>

                <div>
                    <p className="text-sm font-bold text-black">End Time</p>

                    <p className="mt-3 text-sm font-medium text-black">
                        Aug 22, 2026 15:41:56
                    </p>
                </div>

                <div>
                    <p className="text-sm font-bold text-black">
                        Affected Service
                    </p>

                    <p className="mt-3 text-sm font-medium text-black">
                        pymt-svc
                    </p>
                </div>
            </section>

            <section className="mt-7 rounded-[26px] bg-gradient-to-r from-white via-white to-transparent px-7 py-6 md:px-8">
                <div className="mb-6">
                    <h2 className="text-lg font-bold md:text-xl">
                        Incidents Timeline
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 md:text-sm">
                        Chronological causal event playback, state transitions,
                        and recovery tracking
                    </p>
                </div>

                <div className="relative">
                    <div className="hidden md:block">
                        <div className="absolute bottom-[32px] left-[139px] top-[32px] w-[5px] overflow-hidden rounded-full">
                            <div className="h-full w-full bg-gradient-to-b from-[#FF0000] via-[#F39A18] via-[#F2C318] to-[#36E51F]" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        {timelineItems.map((item) => (
                            <div
                                key={`${item.time}-${item.title}`}
                                className="grid grid-cols-1 gap-3 md:grid-cols-[180px_24px_minmax(0,1fr)] md:gap-0"
                            >
                                <div className="relative flex min-h-[92px] items-center">
                                    <span
                                        className="text-sm font-bold md:absolute md:right-[88px]"
                                        style={{
                                            color: item.color,
                                        }}
                                    >
                                        {item.time}
                                    </span>

                                    <span
                                        className="absolute left-[107px] top-1/2 hidden h-[64px] w-[64px] -translate-y-1/2 rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.12)] md:block"
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                    />
                                </div>
                                <div className="hidden md:block" />

                                <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_3px_12px_rgba(40,64,110,0.04)] md:min-h-[92px] md:px-6">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1.45fr_auto] lg:items-center lg:gap-5">
                                        <div className="min-w-0">
                                            <h3
                                                className="text-sm font-bold md:text-base"
                                                style={{
                                                    color: item.color,
                                                }}
                                            >
                                                {item.title}
                                            </h3>

                                            <div className="mt-1.5 space-y-0.5 text-[11px] leading-[1.35rem] text-[#26334D] md:text-xs">
                                                {item.description.map((description) => (
                                                    <p key={description}>
                                                        {description}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 border-l-0 border-slate-200 sm:grid-cols-3 lg:border-l lg:pl-5">
                                            {item.details.map((detail) => (
                                                <div
                                                    key={detail.label}
                                                    className="min-w-0"
                                                >
                                                    <p className="text-[11px] text-[#26334D] md:text-xs">
                                                        {detail.label}
                                                    </p>

                                                    <p
                                                        className={`mt-2 break-words text-[11px] font-bold leading-4 md:text-xs ${
                                                            detail.valueColor ??
                                                            "text-[#1D2942]"
                                                        }`}
                                                    >
                                                        {detail.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className="flex w-fit items-center gap-2 rounded-xl border border-[#9DBCF5] bg-[#EDF4FF] px-4 py-2.5 text-[11px] font-medium text-[#253856] transition hover:bg-[#E2EDFF] lg:ml-auto"
                                        >
                                            View Details
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}