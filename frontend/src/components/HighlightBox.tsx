"use client";

import type { HighlightTone } from "@/lib/types";

type HighlightBoxProps = {
  title: string;
  value: string;
  description: string;
  tone?: HighlightTone;
};

const valueClass: Record<HighlightTone, string> = {
  neutral: "text-black",
  ok: "text-warning-low",
  warning: "text-black",
  critical: "text-warning-critical",
};

const descriptionClass: Record<HighlightTone, string> = {
  neutral: "text-gray-400",
  ok: "text-warning-low",
  warning: "text-warning-high",
  critical: "text-warning-critical",
};

export default function HighlightBox({
  title,
  value,
  description,
  tone = "neutral",
}: HighlightBoxProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md/10 lg:py-4 lg:px-4 w-full max-w-xs">
      <header className="font-bold text-[#94A3B8] text-xs">
        {title.toUpperCase()}
      </header>
      <div className="flex items-end lg:gap-x-2">
        <h1 className={`${valueClass[tone]} text-base font-bold lg:text-2xl`}>
          {value}
        </h1>
        <p className={`${descriptionClass[tone]} font-bold text-xs`}>
          {description}
        </p>
      </div>
    </div>
  );
}
