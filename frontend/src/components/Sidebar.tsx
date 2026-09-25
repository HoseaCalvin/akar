"use client";

import AkarLogo from "../../public/akar.png";

import { Box, ChartNoAxesCombined, ChevronDown, Database, FileClock, Home, Server, Syringe, TriangleAlert } from "lucide-react";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useEnvironment, type EnvironmentType } from "@/lib/environment-context";

const ENV_OPTIONS: { label: EnvironmentType; icon: React.ReactNode }[] = [
    { label: "Cluster", icon: <Server className="w-3.5 h-3.5" /> },
    { label: "Database", icon: <Database className="w-3.5 h-3.5" /> },
];

export default function Sidebar() {
    const path = usePathname();
    const { environment, setEnvironment } = useEnvironment();
    const [envOpen, setEnvOpen] = useState(false);

    const DASHBOARD_URL = `/private/dashboard`;
    const MONITOR_URL = `/private/monitor`;
    const INCIDENTS_URL = `/private/incidents`;
    const EVIDENCE_URL = `/private/evidence`;
    const REMEDIATION_URL = `/private/remediation`;
    const AI_ANALYTICS_URL = `/private/ai-analytics`;

    function handleSelect(env: EnvironmentType) {
        setEnvironment(env);
        setEnvOpen(false);
    }

    return (
        <nav className="sticky top-0 flex flex-col justify-between items-center min-h-full w-full px-4.5 py-2 overflow-y-auto max-w-[170px] lg:gap-y-5 xl:max-w-[180px]">
            <figure className="mt-3">
                <Image
                    src={AkarLogo}
                    alt="AKAR Logo"
                    className="h-auto w-17"
                />
            </figure>
            <div className="space-y-2">
                <Link
                    href={DASHBOARD_URL}
                    className={`logo-container animate`}
                >
                    <Home
                        className={`${path === DASHBOARD_URL ? 'bg-black' : 'bg-white'} logo-dimension`}
                        stroke={`${path === DASHBOARD_URL ? 'white' : 'black'}`}
                    />
                    <h1 className="text-sm font-bold">Dashboard</h1>
                </Link>
                <Link
                    href={MONITOR_URL}
                    className={`logo-container animate`}
                >
                    <Box
                        className={`${path === MONITOR_URL || path.startsWith(MONITOR_URL) ? 'bg-black' : 'bg-white'} logo-dimension`}
                        stroke={`${path === MONITOR_URL || path.startsWith(MONITOR_URL) ? 'white' : 'black'}`}
                    />
                    <h1 className="text-sm font-bold">Monitor</h1>
                </Link>
                <Link
                    href={INCIDENTS_URL}
                    className={`logo-container animate`}
                >
                    <TriangleAlert
                        className={`${path === INCIDENTS_URL || path.startsWith(INCIDENTS_URL) ? 'bg-black' : 'bg-white'} logo-dimension`}
                        stroke={`${path === INCIDENTS_URL || path.startsWith(INCIDENTS_URL) ? 'white' : 'black'}`}
                    />
                    <h1 className="text-sm font-bold">Incidents</h1>
                </Link>
                <Link
                    href={EVIDENCE_URL}
                    className={`logo-container animate`}
                >
                    <FileClock
                        className={`${path === EVIDENCE_URL || path.startsWith(EVIDENCE_URL) ? 'bg-black' : 'bg-white'} logo-dimension`}
                        stroke={`${path === EVIDENCE_URL || path.startsWith(EVIDENCE_URL) ? 'white' : 'black'}`}
                    />
                    <h1 className="text-sm font-bold">Evidence</h1>
                </Link>
                <Link
                    href={REMEDIATION_URL}
                    className={`logo-container animate`}
                >
                    <Syringe
                        className={`${path === REMEDIATION_URL || path.startsWith(REMEDIATION_URL) ? 'bg-black' : 'bg-white'} logo-dimension`}
                        stroke={`${path === REMEDIATION_URL || path.startsWith(REMEDIATION_URL) ? 'white' : 'black'}`}
                    />
                    <h1 className="text-sm font-bold">Remediation</h1>
                </Link>
                <Link
                    href={AI_ANALYTICS_URL}
                    className={`logo-container animate`}
                >
                    <ChartNoAxesCombined
                        className={`${path === AI_ANALYTICS_URL ? 'bg-black' : 'bg-white'} logo-dimension`}
                        stroke={`${path === AI_ANALYTICS_URL ? 'white' : 'black'}`}
                    />
                    <h1 className="text-sm font-bold">AI & Analytics</h1>
                </Link>
            </div>

            {/* Environment selector */}
            <div className="relative w-full">
                <section className="border border-white rounded-xl px-3 py-2 w-full space-y-1">
                    <p className="text-xs text-slate-500">Environment</p>
                    <button
                        type="button"
                        onClick={() => setEnvOpen((prev) => !prev)}
                        className="flex items-center justify-between w-full gap-x-2 focus:outline-none"
                    >
                        <span className="font-bold text-sm truncate">{environment}</span>
                        <ChevronDown
                            className={`w-4 h-auto flex-shrink-0 transition-transform duration-200 ${envOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                </section>

                {/* Dropdown */}
                {envOpen && (
                    <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                        {ENV_OPTIONS.map((opt) => (
                            <button
                                key={opt.label}
                                type="button"
                                onClick={() => handleSelect(opt.label)}
                                className={`flex items-center gap-x-2 w-full px-3 py-2 text-sm transition-colors hover:bg-slate-50 ${
                                    environment === opt.label
                                        ? "font-bold text-blue-600 bg-blue-50"
                                        : "text-slate-700"
                                }`}
                            >
                                {opt.icon}
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <section>
                <h2 className="text-xs text-[#112250]">AKAR v1.0.0</h2>
            </section>
        </nav>
    );
}