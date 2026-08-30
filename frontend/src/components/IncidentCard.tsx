"use client";

import { getBadgeColor, getBadgeTextColor, getBorderColor, getRowBackgroundColor, Level } from "@/utils/row-style";
import { Clock } from "lucide-react";
import Link from "next/link";
import React from "react";

interface IncidentCardProps {
    id: string;
    level: Level;
    isActive: boolean;
}

export default function IncidentCard({ id, level, isActive }: IncidentCardProps) {
    const setCardMarkerColor = (level: Level) => {
        switch (level) {
            case 'Critical':
                return 'bg-warning-critical';
            case 'High':
                return 'bg-warning-high';
            case 'Low':
                return 'bg-warning-low';
            default:
                return 'bg-warning-low';
        }
    }

    return(
        <Link 
            href={`/private/incidents/detail/${id}`}
            className={`${getBorderColor(level)} flex flex-col relative overflow-hidden shadow-lg/10 border-2 rounded-2xl w-full cursor-pointer animate hover:shadow-lg/20 lg:p-3`}
        >
            <div className="absolute top-3 right-6 flex flex-col justify-center lg:space-y-0.5">
                <p className={`${isActive ? 'bg-warning-critical/10 text-warning-critical' : 'bg-warning-low/10 text-warning-low'} w-fit rounded-lg py-1 px-3 text-sm font-bold`}>{`${isActive ? 'Active' : 'Resolved'}`}</p>
                <div className="lg:space-x-1.5">
                    <Clock
                        className="text-gray-500 inline w-3.5 h-3.5"
                    />
                    <p className="inline text-gray-500 text-xs text-center">4 mins ago</p>
                </div>
                
            </div>
            <div className={`absolute inset-y-0 left-0 w-4 ${setCardMarkerColor(level)}`}></div>
            <figure>

            </figure>
            <div className="pl-5">
                <header>
                    <h1 className="font-bold">INC-4082: Storage & DB Conn Failure</h1>
                    <p className="text-sm text-gray-500">Namespace: <strong>postgresql-primary (Root Cause)</strong></p>
                </header>
                <h1 className={`${getBadgeColor(level)} ${getBadgeTextColor(level)} text-sm font-bold w-fit rounded-lg py-0.5 px-4 lg:rounded-xl lg:mt-2 lg:mb-0.5`}>CRITICAL</h1>
                <h2 className="text-sm text-gray-500">High error rate</h2>
                <div className="flex items-center justify-between w-full pt-4">
                    <div className="">
                        <p className="text-xs text-gray-500">CPU Usage</p>
                        <p className="text-sm font-semibold">92%</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Memory Usage</p>
                        <p className="text-sm font-semibold">89%</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Restarts</p>
                        <p className="text-sm font-semibold">6</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Confidence</p>
                        <p className="text-sm font-semibold">85%</p>
                    </div>
                    <div>
                        <span className="bg-[#3B82F6]/20 text-gray-600 text-sm font-bold py-1.5 px-3 rounded-lg">In Progress</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}