"use client";

import type { HighlightTone } from "@/lib/types";

type HighlightBoxProps = {
  title: string;
  value: string;
  description: string;
  tone?: HighlightTone;
};

const valueClass: Record<HighlightTone, string> = {
  neutral: "text-slate-900",
  ok: "text-emerald-600",
  warning: "text-amber-600",
  critical: "text-red-600",
};

const descriptionClass: Record<HighlightTone, string> = {
  neutral: "text-slate-500",
  ok: "text-emerald-500",
  warning: "text-amber-500",
  critical: "text-red-500",
};

const borderClass: Record<HighlightTone, string> = {
  neutral: "border-slate-200",
  ok: "border-emerald-200",
  warning: "border-amber-200",
  critical: "border-red-200",
};

export default function HighlightBox({
  title,
  value,
  description,
  tone = "neutral",
}: HighlightBoxProps) {
  return (
    <div className={`bg-white rounded-xl border ${borderClass[tone]} shadow-sm lg:py-4 lg:px-4 w-full max-w-xs transition-shadow hover:shadow-md`}>
      <header className="font-medium text-slate-400 text-xs uppercase tracking-wide">
        {title}
      </header>
      <div className="flex items-baseline gap-2 mt-2">
        <h1 className={`${valueClass[tone]} text-xl font-semibold lg:text-2xl`}>
          {value}
        </h1>
        <p className={`${descriptionClass[tone]} text-xs font-medium`}>
          {description}
        </p>
      </div>
    </div>
  );
}
