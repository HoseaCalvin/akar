"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import HighlightBox from "@/components/HighlightBox";
import PageState from "@/components/PageState";
import TableDetail from "@/components/TableDetail";
import type { DirectoryPage, InventoryItem } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export default function TopologyDirectory({ title, loader }: { title: string; loader: (search?: string) => Promise<DirectoryPage<InventoryItem>> }) {
  const router = useRouter(); const [search, setSearch] = useState("");
  const { data, loading, error } = useApi(`${title}:${search}`, () => loader(search || undefined));
  return <>
    <section className="flex items-center lg:gap-x-2 lg:pb-10"><ChevronLeft className="inline h-4 w-auto cursor-pointer lg:h-7" onClick={() => router.push("/private/monitor/inventory")} /><h1 className="font-bold text-xl">{title} Directory</h1></section>
    <section className="flex justify-start w-full lg:gap-x-5">{data?.highlights.map((item) => <HighlightBox key={item.title} {...item} />)}</section>
    <TableDetail counts={data?.counts} search={search} onSearchChange={setSearch}>
      <section className="mt-5 max-h-screen w-full space-y-2.5 overflow-y-auto">
        <div className="sticky top-0 grid w-full grid-cols-[2fr_1fr_1fr_1fr] rounded-lg bg-[#F8FAFC] px-5 py-3 text-sm font-semibold text-gray-400"><span>NAME</span><span>TYPE</span><span>NAMESPACE</span><span>HEALTH</span></div>
        <PageState loading={loading} error={error} empty={!loading && (data?.items.length ?? 0) === 0} />
        {data?.items.map((item) => <div key={item.id} className="grid w-full grid-cols-[2fr_1fr_1fr_1fr] rounded-lg border bg-white p-4 text-sm"><div><div className="font-bold">{item.name}</div><div className="text-xs text-slate-400">{item.description}</div></div><span className="text-slate-500">{item.type}</span><span className="text-slate-500">{item.namespace}</span><span className="font-semibold text-slate-600">{item.status}</span></div>)}
      </section>
    </TableDetail>
  </>;
}
