"use client";

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

export default function IncidentTImelineInvestigation() {
    return (
        <main className="min-h-screen text-[#172033]">

            <header className="px-5 pt-4 md:px-7 md:pt-6">
                <div className="flex items-center justify-between gap-6">

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
                            <h1 className="shrink-0 text-[27px] font-bold tracking-[-0.5px] text-black md:text-[30px]">
                                INC-4082
                            </h1>

                            <h2 className="truncate text-[26px] font-medium tracking-[-0.7px] text-black md:text-[30px]">
                                PostgreSQL Connection Timeout Errors
                            </h2>
                        </div>
                    </div>

                    <div className="hidden shrink-0 items-center gap-4 md:flex">
                        <button
                            type="button"
                            className="flex h-12 items-center gap-3 rounded-[15px] border border-[#E2E5EC] bg-white px-6 text-[14px] font-medium text-[#667085] shadow-sm transition hover:bg-gray-50"
                        >
                            <Download className="h-5 w-5" />
                            Export
                        </button>

                        <button
                            type="button"
                            className="flex h-12 items-center gap-3 rounded-[15px] bg-[#7697F4] px-6 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#6689EF]"
                        >
                            <Share2 className="h-5 w-5" />
                            Share
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-[14px] text-[#242936]">

                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="font-medium">Active</span>
                    </div>

                    <span className="text-[#B4BAC4]">•</span>

                    <span className="text-[#5C6370]">
                        Since 15:18 (32m)
                    </span>

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

                    <div className="flex items-center gap-2">
                        <ServerCog className="h-[18px] w-[18px]" />
                        <span>
                            Owner:{" "}
                            <strong className="font-bold">xyz-team</strong>
                        </span>
                    </div>

                </div>
            </header>

            <div className="px-5 pb-8 pt-7 md:px-7">

                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

                    <SummaryCard
                        title="Root Cause Prediction"
                        description="PostgreSQL connection pool exhaustion"
                        value="94%"
                        label="Confidence"
                        progress="94%"
                        progressColor="bg-[#173EFF]"
                    />

                    <SummaryCard
                        title="Impact"
                        description="3 services, 2 pods, 1 datastore"
                        value="95%"
                        label="Critical"
                        progress="95%"
                        progressColor="bg-red-500"
                    />

                    <SummaryCard
                        title="User Impact"
                        description="Payment failures -2.3% requests failed"
                        value="80%"
                        label="Critical"
                        progress="80%"
                        progressColor="bg-red-500"
                    />

                    <SmallSummaryCard
                        title="MTTR"
                        value="12m"
                        label="Ongoing"
                        bottom="Target <30m"
                    />

                    <SmallSummaryCard
                        title="RCA Detection"
                        value="4m 14s"
                        label="Current"
                        bottom="Target <5m"
                    />

                </section>

                <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.02fr_1fr]">

                    <div className="space-y-3">
                        <TopologyCard />
                        <EvidenceCard />
                    </div>

                    <div className="space-y-3">
                        <AIAnalysisCard />
                        <RecommendedAction />
                    </div>

                </section>
            </div>

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
        <div className="min-h-[161px] rounded-[20px] bg-white px-5 py-4 shadow-[0_2px_10px_rgba(20,40,80,0.025)]">

            <h3 className="text-[17px] font-bold leading-5 text-[#182238]">
                {title}
            </h3>

            <p className="mt-1 line-clamp-1 text-[12px] text-[#71809B]">
                {description}
            </p>

            <div className="mt-3">
                <div className="text-[36px] font-bold leading-none tracking-[-1px] text-[#172033]">
                    {value}
                </div>

                <p className="mt-1 text-[12px] text-[#71809B]">
                    {label}
                </p>
            </div>

            <div className="mt-4 h-[6px] overflow-hidden rounded-full bg-[#E2E3E5]">
                <div
                    className={`h-full rounded-full ${progressColor}`}
                    style={{ width: progress }}
                />
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
        <div className="min-h-[161px] rounded-[20px] bg-white px-5 py-4 shadow-[0_2px_10px_rgba(20,40,80,0.025)]">

            <h3 className="text-[17px] font-bold text-[#182238]">
                {title}
            </h3>

            <div className="mt-5 text-[36px] font-bold leading-none tracking-[-1px] text-[#172033]">
                {value}
            </div>

            <p className="mt-1 text-[12px] text-[#71809B]">
                {label}
            </p>

            <p className="mt-3 text-[12px] text-[#71809B]">
                {bottom}
            </p>

        </div>
    );
}

function TopologyCard() {
    return (
        <section className="rounded-[20px] bg-white p-5">

            <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-[#182238]">
                    Affected Topology
                </h3>

                <div className="flex items-center gap-5 text-[12px]">
                    <Legend color="bg-red-500" text="Critical" />
                    <Legend color="bg-orange-500" text="High" />
                    <Legend color="bg-yellow-400" text="Medium" />
                    <Legend color="bg-green-500" text="Low" />
                </div>
            </div>

            <div className="relative mt-7 h-[300px] overflow-hidden">

                <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 700 300"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M 295 82 L 340 82 L 340 150"
                        fill="none"
                        stroke="#777"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                    />

                    <path
                        d="M 165 190 L 250 190"
                        fill="none"
                        stroke="#777"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                    />

                    <path
                        d="M 390 160 C 410 100 435 80 475 72"
                        fill="none"
                        stroke="#FF3D3D"
                        strokeWidth="1.7"
                        strokeDasharray="3 3"
                    />

                    <path
                        d="M 390 205 C 425 250 450 260 480 260"
                        fill="none"
                        stroke="#777"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                    />
                </svg>

                <TopologyNode
                    className="left-[17%] top-[8%]"
                    icon={<Globe className="h-4 w-4" />}
                    title="Web App"
                    status="Healthy"
                />

                <TopologyNode
                    className="left-[2%] top-[50%]"
                    icon={<Network className="h-4 w-4" />}
                    title="API Gtw"
                    status="Healthy"
                />

                <TopologyNode
                    className="left-[32%] top-[46%]"
                    critical
                    icon={<ServerCog className="h-4 w-4" />}
                    title="Payment Service"
                    status="Critical"
                    subtitle="12 pods affected"
                />

                <TopologyNode
                    className="right-[3%] top-[0%]"
                    critical
                    icon={<Database className="h-5 w-5" />}
                    title="PostgreSQL primary"
                    status="Critical"
                    subtitle="Connection pod exhausted"
                />

                <TopologyNode
                    className="right-[3%] bottom-[0%]"
                    icon={<Database className="h-5 w-5" />}
                    title="PostgreSQL replica"
                    status="Healthy"
                />

            </div>

        </section>
    );
}

function TopologyNode({
    className,
    icon,
    title,
    status,
    subtitle,
    critical = false,
}: {
    className?: string;
    icon: React.ReactNode;
    title: string;
    status: string;
    subtitle?: string;
    critical?: boolean;
}) {
    return (
        <div
            className={`absolute ${className} z-10 w-[180px] rounded-[14px] border px-3 py-3 ${
                critical
                    ? "border-red-300 bg-[#FFF4F4] shadow-[0_0_18px_rgba(255,60,60,0.35)]"
                    : "border-[#B9B9B9] bg-[#FAFAFA]"
            }`}
        >
            <div className="flex items-start gap-2">

                <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        critical
                            ? "bg-red-100 text-red-500"
                            : "bg-[#ECECF8] text-[#171B23]"
                    }`}
                >
                    {icon}
                </div>

                <div className="min-w-0">

                    <p className="truncate text-[14px] font-medium text-[#202020]">
                        {title}
                    </p>

                    <p
                        className={`mt-1 text-[11px] ${
                            critical ? "text-red-500" : "text-[#202020]"
                        }`}
                    >
                        {status}
                    </p>

                    {subtitle && (
                        <p className="mt-1 text-[10px] text-[#303030]">
                            {subtitle}
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
}

function Legend({
    color,
    text,
}: {
    color: string;
    text: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${color}`} />
            <span>{text}</span>
        </div>
    );
}

function AIAnalysisCard() {
    return (
        <section className="rounded-[20px] bg-white p-5">

            <h3 className="text-[18px] font-bold text-[#182238]">
                AI Analysis
            </h3>

            <div className="mt-3 flex items-center justify-between rounded-[18px] border border-[#B7B5FF] bg-[#E7F3FF] px-5 py-3">

                <div>
                    <p className="text-[17px] font-bold text-[#17377E]">
                        Root Cause Prediction
                    </p>

                    <p className="mt-1 text-[14px] text-[#303946]">
                        PostgreSQL connection pool exhaustion
                    </p>
                </div>

                <div className="flex items-center gap-3 rounded-[13px] bg-[#123B91] px-5 py-2 text-white">

                    <span className="text-[24px] font-bold leading-none">
                        94%
                    </span>

                    <span className="text-[13px]">
                        Confidence
                    </span>

                </div>

            </div>

            <div className="mt-5 px-5">

                <h4 className="text-[17px] font-bold text-[#161616]">
                    Why AKAR thinks this is the root cause?
                </h4>

                <div className="mt-5 space-y-4">

                    <EvidenceReason>
                        Connection pool utilization &gt; 95% for 4m
                    </EvidenceReason>

                    <EvidenceReason>
                        Spike in connection timeout errors (2.3k/min)
                    </EvidenceReason>

                    <EvidenceReason>
                        Checkout service errors correlated (r = 0.92)
                    </EvidenceReason>

                    <EvidenceReason>
                        Started right after pool size change (50 → 75)
                    </EvidenceReason>

                    <EvidenceReason>
                        No abnormality in network, CPU, or memory
                    </EvidenceReason>

                </div>
            </div>

            <div className="mt-5 rounded-[20px] bg-[#E4F2FF] px-5 py-5">

                <h4 className="text-[17px] font-medium">
                    Alternative Hypothesis{" "}
                    <span className="font-bold text-[#0D4EA2]">
                        (lower probability)
                    </span>
                </h4>

                <div className="mt-4 space-y-4">

                    <ProbabilityRow
                        label="Database slow query"
                        value="18%"
                    />

                    <ProbabilityRow
                        label="Network latency to DB"
                        value="8%"
                    />

                    <ProbabilityRow
                        label="Pod resource exhaustion"
                        value="5%"
                    />

                </div>

            </div>

        </section>
    );
}

function EvidenceReason({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-2 text-[15px]">

            <CheckCircle2 className="h-[16px] w-[16px] shrink-0 fill-[#55B91B] text-white" />

            <span>{children}</span>

        </div>
    );
}

function ProbabilityRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between text-[15px]">

            <div className="flex items-center gap-3">
                <span className="text-[18px]">•</span>
                <span>{label}</span>
            </div>

            <span>{value}</span>

        </div>
    );
}

function EvidenceCard() {
    return (
        <section className="rounded-[20px] bg-white p-5">

            <div className="flex items-center justify-between">

                <h3 className="text-[18px] font-bold">
                    Key Evidence
                </h3>

                <button className="text-[13px] text-[#007AFF]">
                    Full Evidence →
                </button>

            </div>

            <div className="relative mt-5">

                <div className="absolute bottom-5 left-[5px] top-2 w-px bg-[#BFC2C7]" />

                <div className="space-y-4">

                    <TimelineEvidence
                        time="15:24:10"
                        ago="4 mins ago"
                        title="Database Connection Errors Spiked"
                        type="Metric"
                        relevance="98%"
                        source="Prometheus"
                        component="postgresql-primary"
                        chart="red"
                        dot="bg-red-500"
                    />

                    <TimelineEvidence
                        time="15:24:05"
                        ago="4 mins ago"
                        title="PostgreSQL Connection Timeout Errors"
                        type="Log"
                        relevance="95%"
                        source="app-logs"
                        component="pymt-svc"
                        dot="bg-red-500"
                    />

                    <TimelineEvidence
                        time="15:23:58"
                        ago="5 mins ago"
                        title="Database Response Time Increased"
                        type="Metric"
                        relevance="90%"
                        source="Prometheus"
                        component="postgresql-primary"
                        chart="orange"
                        dot="bg-orange-500"
                    />

                </div>

            </div>

        </section>
    );
}

function TimelineEvidence({
    time,
    ago,
    title,
    type,
    relevance,
    source,
    component,
    chart,
    dot,
}: {
    time: string;
    ago: string;
    title: string;
    type: string;
    relevance: string;
    source: string;
    component: string;
    chart?: "red" | "orange";
    dot: string;
}) {
    return (
        <div className="relative grid grid-cols-[110px_1fr] gap-3">

            <div className="relative pl-6">

                <span
                    className={`absolute left-0 top-2 h-3 w-3 rounded-full ${dot}`}
                />

                <p className="text-[12px] font-medium text-[#151515]">
                    {time}
                </p>

                <p className="mt-2 text-[11px] text-[#666]">
                    {ago}
                </p>

            </div>

            <div className="rounded-[18px] border border-[#D3D3D3] bg-white px-5 py-4">

                <div className="flex items-start justify-between gap-3">

                    <h4 className="text-[15px] font-bold text-[#171717]">
                        {title}
                    </h4>

                    <div className="flex items-center gap-3">

                        <span
                            className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                                type === "Log"
                                    ? "bg-[#FFDADA] text-[#F54B4B]"
                                    : "bg-[#FFF4BF] text-[#B28A00]"
                            }`}
                        >
                            {type}
                        </span>

                        <ChevronRight className="h-4 w-4 text-[#777]" />

                    </div>

                </div>

                <div className="mt-5 grid grid-cols-3 gap-4">

                    <div>
                        <p className="text-[11px] text-[#666]">
                            Source
                        </p>
                        <p className="mt-1 text-[12px] font-bold">
                            {source}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] text-[#666]">
                            Component
                        </p>
                        <p className="mt-1 text-[12px] font-bold">
                            {component}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] text-[#666]">
                            Relevance
                        </p>
                        <p className="mt-1 text-[12px] font-bold text-red-500">
                            {relevance}
                        </p>
                    </div>

                </div>

                {chart && <MiniChart type={chart} />}

            </div>

        </div>
    );
}

function MiniChart({
    type,
}: {
    type: "red" | "orange";
}) {
    const gradientId = `chart-${type}`;

    const path =
        type === "red"
            ? "M0 78 L20 72 L40 80 L60 62 L80 70 L100 55 L120 43 L140 48 L160 18 L180 35 L200 16 L220 40 L240 38 L260 41 L280 28 L300 20"
            : "M0 78 L20 74 L40 74 L60 65 L80 58 L100 48 L120 40 L140 45 L160 20 L180 38 L200 18 L220 42 L240 39 L260 52 L280 64 L300 60";

    const stroke =
        type === "red"
            ? "#FF4B4B"
            : "#FF9B00";

    return (
        <div className="mt-4 h-[65px] overflow-hidden">

            <svg
                viewBox="0 0 300 90"
                preserveAspectRatio="none"
                className="h-full w-full"
            >

                <defs>
                    <linearGradient
                        id={gradientId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor={stroke}
                            stopOpacity="0.38"
                        />

                        <stop
                            offset="100%"
                            stopColor={stroke}
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>

                <path
                    d={`${path} L300 90 L0 90 Z`}
                    fill={`url(#${gradientId})`}
                />

                <path
                    d={path}
                    fill="none"
                    stroke={stroke}
                    strokeWidth="2"
                />

            </svg>

        </div>
    );
}

function RecommendedAction() {
    return (
        <section className="rounded-[20px] bg-white p-5">

            <div className="flex items-center justify-between">

                <h3 className="text-[18px] font-bold">
                    Recommended Action
                </h3>

                <button className="text-[13px] text-[#007AFF]">
                    Full Actions →
                </button>

            </div>

            <div className="mt-3 rounded-[20px] bg-gradient-to-r from-[#E6F5FF] to-[#FFFFE9] px-6 py-5">

                <h4 className="text-[17px] font-bold text-[#B07D00]">
                    Increase connection pool size
                </h4>

                <p className="mt-3 max-w-[650px] text-[14px] leading-5 text-[#1C1C1C]">
                    Increase PostgreSQL connection pool size to 100 or{" "}
                    <strong>rollback</strong> to previous configuration.
                </p>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-6 px-5">

                <div>

                    <p className="text-[12px] text-[#777]">
                        Expected Impact
                    </p>

                    <p className="mt-3 text-[13px] leading-5">
                        Restore connections and reduce timeout errors
                    </p>

                </div>

                <div>

                    <p className="text-[12px] text-[#777]">
                        Confidence
                    </p>

                    <p className="mt-3 text-[13px]">
                        High (91%)
                    </p>

                    <p className="mt-6 text-[12px] text-[#777]">
                        Risk Level
                    </p>

                    <p className="mt-3 text-[13px]">
                        Medium
                    </p>

                </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

                <button
                    type="button"
                    className="h-12 rounded-[10px] border border-[#9EB9FF] bg-[#EAF0FF] text-[17px] font-medium transition hover:bg-[#DFE8FF]"
                >
                    Apply Action
                </button>

                <button
                    type="button"
                    className="h-12 rounded-[10px] border border-[#A9C2FF] bg-white text-[17px] font-medium transition hover:bg-[#F5F8FF]"
                >
                    Chaos Lab
                </button>

            </div>

            <div className="mt-3 flex items-center gap-2 px-1 text-[12px] text-red-500">

                <AlertCircle className="h-4 w-4 fill-red-500 text-white" />

                <span>Manual Only</span>

            </div>

        </section>
    );
}