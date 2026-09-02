"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { DirectoryCounts } from "@/lib/types";

type TableDetailProps = {
  children: ReactNode;
  counts?: DirectoryCounts;
  search?: string;
  onSearchChange?: (value: string) => void;
};

export default function TableDetail({
  children,
  counts,
  search,
  onSearchChange,
}: TableDetailProps) {
  const path = usePathname();

  const INVENTORY_URL = "/private/monitor/inventory";
  const PODS_URL = "/private/monitor/pods";
  const SERVICES_URL = "/private/monitor/services";
  const NODES_URL = "/private/monitor/nodes";

  const tabs = [
    { href: INVENTORY_URL, label: `All (${counts?.inventory ?? 0})` },
    { href: PODS_URL, label: `Pods (${counts?.pods ?? 0})` },
    { href: SERVICES_URL, label: `Services (${counts?.services ?? 0})` },
    { href: NODES_URL, label: `Nodes (${counts?.nodes ?? 0})` },
  ];

  return (
    <div className="bg-[#F0F3FC] shadow-lg/10 flex flex-col min-h-screen flex-1 lg:px-5 lg:py-6 lg:rounded-3xl lg:my-4">
      <header className="flex justify-between items-center w-full h-fit">
        <div className="flex flex-1 gap-x-2.5">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`table-detail-tab animate ${path === tab.href ? "text-white bg-blue-500 hover:bg-blue-400" : "text-slate-400 hover:bg-slate-200"}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={search ?? ""}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="Search resource name, IP, label..."
            className="rounded-md border border-slate-400 bg-slate-50 min-w-xs md:text-sm lg:py-1 lg:px-3"
          />
        </div>
      </header>
      {children}
    </div>
  );
}
