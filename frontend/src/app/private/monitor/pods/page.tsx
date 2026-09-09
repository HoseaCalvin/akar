"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import HighlightBox from "@/components/HighlightBox";
import TableDetail from "@/components/TableDetail";
import PageState from "@/components/PageState";
import { ChevronLeft, Container, RefreshCw, Cpu, Activity } from "lucide-react";
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

  return (
    <main className="relative flex flex-col min-h-full py-5 px-7 ">
      <TopBar />
      <section className="flex items-center lg:gap-x-2 lg:pb-10">
        <ChevronLeft
          className="inline cursor-pointer w-auto h-4 lg:h-7 text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => router.push("/private/monitor/inventory")}
        />
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Pods Directory</h1>
        </div>
      </section>
      <section className="flex justify-start w-full lg:gap-x-5 mb-6">
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
      <section>
        <TableDetail counts={data?.counts} search={search} onSearchChange={setSearch}>
          <section className="overflow-y-auto w-full h-full max-h-screen lg:space-y-3 lg:mt-5">
            <div className="bg-gradient-to-r from-slate-100 to-teal-50/50 sticky top-0 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full justify-center rounded-xl text-sm border border-slate-200/60 *:text-slate-600 *:font-semibold lg:py-4 lg:px-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Container className="w-4 h-4 text-slate-500" />
                <h1>POD NAME</h1>
              </div>
              <h1>NODE HOST</h1>
              <h1>NAMESPACE</h1>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <h1>RESTARTS</h1>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-500" />
                <h1>RESOURCES</h1>
              </div>
              <h1>STATUS</h1>
              <h1>ACTION</h1>
            </div>
            <PageState loading={loading} error={error} empty={!loading && (data?.items.length ?? 0) === 0} />
            {data?.items.map((item) => (
              <div
                key={item.id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full justify-center rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${getRowBackgroundColor(item.status)} lg:p-4`}
              >
                <div className="flex flex-col justify-center md:space-y-1">
                  <span className="text-sm font-bold text-slate-800">{item.name}</span>
                  <span className={`text-xs ${getDescriptionColor(item.status)}`}>{item.description}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-slate-500">{item.nodeHost}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-slate-500">{item.namespace}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-semibold text-slate-700">{item.restarts}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-semibold text-slate-700">{item.cpuRam}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <div className={`flex items-center rounded-xl w-fit px-3 py-1.5 ${getBadgeColor(item.status)} shadow-sm`}>
                    <span className={`text-sm font-semibold ${getBadgeTextColor(item.status)}`}>{item.status}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <Link href={`/private/monitor/resources/${item.id}`} className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                    Inspect <Activity className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </section>
        </TableDetail>
      </section>
    </main>
  );
}
