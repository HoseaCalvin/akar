"use client";

import Link from "next/link";

import { ReactNode } from "react";

import { usePathname } from "next/navigation";

interface TableDetailProps {
    children: ReactNode;
}

export default function TableDetail({ children }: TableDetailProps) {
    const path = usePathname();

    const INVENTORY_URL = '/private/monitor/inventory';
    const PODS_URL = '/private/monitor/pods';
    const SERVICES_URL = '/private/monitor/services';
    const NODES_URL = '/private/monitor/nodes';

    return(
        <div className="bg-[#F0F3FC] shadow-lg/10 flex flex-col min-h-screen flex-1 lg:px-5 lg:py-6 lg:rounded-3xl lg:my-4">
            <header className="flex justify-between items-center w-full h-fit">
                <div className="flex flex-1 gap-x-2.5">
                    <Link
                        href={INVENTORY_URL}
                        className={`table-detail-tab animate ${path === INVENTORY_URL ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-slate-400 hover:bg-slate-200'}`}
                    >
                        All (114)
                    </Link>
                    <Link
                        href={PODS_URL}
                        className={`table-detail-tab animate ${path === PODS_URL ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-slate-400 hover:bg-slate-200'}`}
                    >
                        Pods (84)
                    </Link>
                    <Link
                        href={SERVICES_URL}
                        className={`table-detail-tab animate ${path === SERVICES_URL ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-slate-400 hover:bg-slate-200'}`}
                    >
                        Services (18)
                    </Link>
                    <Link
                        href={NODES_URL}
                        className={`table-detail-tab animate ${path === NODES_URL ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-slate-400 hover:bg-slate-200'}`}
                    >
                        Nodes (12)
                    </Link>
                </div>
                <div className="">
                    <input 
                        type="text"
                        placeholder="Search resource name, IP, label..."
                        className="rounded-md border border-slate-400 bg-slate-50 min-w-xs md:text-sm lg:py-1 lg:px-3"
                    />
                </div>
            </header>
            { children }
        </div>        
    )
}