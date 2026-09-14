"use client";

import {
  getBadgeColor,
  getBadgeTextColor,
  getBorderColor,
} from "@/utils/row-style";

import { Clock } from "lucide-react";

import Link from "next/link";

import type { IncidentHeader } from "@/lib/types";
import { getDuration } from "@/utils/helpers";

export default function IncidentCard({ id, code, title, namespace, severity, status, cause, cpu_usage, memory_usage, restart_count, confidence, start_time, end_time }: IncidentHeader) {
  const markerColor = {
    Critical: "bg-warning-critical",
    High: "bg-warning-high",
    Medium: "bg-warning-medium",
    Low: "bg-warning-low",
  };

  return (
    <Link
      href={`/private/incidents/${id}/timeline`}
      className={`${getBorderColor(severity)} flex flex-col relative overflow-hidden shadow-lg/10 border-2 rounded-2xl w-full cursor-pointer animate hover:shadow-lg/20 lg:p-3`}
    >
      <div className="absolute top-3 right-6 flex flex-col justify-center lg:space-y-0.5">
        <div className="lg:space-x-1.5">
          <Clock className="text-gray-500 inline w-3.5 h-3.5" />
          <p className="inline text-gray-500 text-xs text-center">
            {getDuration(start_time, end_time)}
          </p>
        </div>
      </div>
      <div className={`absolute inset-y-0 left-0 w-4 ${markerColor}`} />
      <div className="pl-5">
        <header>
          <h1 className="font-bold">
            {code}: {title}
          </h1>
          <p className="text-sm text-gray-500">
            Namespace: <strong>{namespace}</strong>
          </p>
        </header>
        <h1
          className={`${getBadgeColor(severity)} ${getBadgeTextColor(severity)} text-sm font-bold w-fit rounded-lg py-0.5 px-4 lg:rounded-xl lg:mt-2 lg:mb-0.5`}
        >
          {severity.name}
        </h1>
        <h2 className="text-sm text-gray-500">{cause}</h2>
        <div className="flex items-center justify-between w-full pt-4">
          <div>
            <p className="text-xs text-gray-500">CPU Usage</p>
            <p className="text-sm font-semibold">{cpu_usage}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Memory Usage</p>
            <p className="text-sm font-semibold">{memory_usage}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Restarts</p>
            <p className="text-sm font-semibold">{restart_count}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Confidence</p>
            <p className="text-sm font-semibold">{confidence}%</p>
          </div>
          <div>
            <span className="bg-[#3B82F6]/20 text-gray-600 text-sm font-bold py-1.5 px-3 rounded-lg">
              {status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
