'use client';

import React from 'react';

export interface EvidenceAlertProps {
  status?: 'critical' | 'warning' | 'info';
  incidentCode?: string;
  title?: string;
  detectedAt?: string;
  activeDuration?: string;
  className?: string;
}

const STATUS_CONFIG = {
  critical: {
    label: 'CRITICAL',
    bgColor: 'bg-[#FFE1E1]',
    textColor: 'text-[#F04444]',
    dotColor: 'bg-[#F04444]',
  },
  warning: {
    label: 'WARNING',
    bgColor: 'bg-[#FFF4E1]',
    textColor: 'text-[#F59E0B]',
    dotColor: 'bg-[#F59E0B]',
  },
  info: {
    label: 'INFO',
    bgColor: 'bg-[#E1F0FF]',
    textColor: 'text-[#3B82F6]',
    dotColor: 'bg-[#3B82F6]',
  },
} as const;

const EvidenceAlert: React.FC<EvidenceAlertProps> = ({
  status = 'critical',
  incidentCode = 'INC-4082',
  title = 'Storage & DB Connection Failure',
  detectedAt = '4 mins ago',
  activeDuration = '15m 42s',
  className = '',
}) => {
  const statusStyle = STATUS_CONFIG[status];

  return (
    <div
      className={`
        flex
        h-[68px]
        w-fit
        min-w-[420px]
        max-w-[520px]
        shrink-0
        flex-col
        justify-center
        rounded-[12px]
        border
        border-[#E4E8F1]
        bg-white
        px-4
        shadow-[0_5px_16px_rgba(42,68,125,0.12)]
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <span
          className={`
            inline-flex
            h-[30px]
            shrink-0
            items-center
            rounded-[5px]
            px-2.5
            text-[10px]
            font-bold
            ${statusStyle.bgColor}
            ${statusStyle.textColor}
          `}
        >
          {statusStyle.label}
        </span>

        <h2 className="min-w-0 whitespace-nowrap text-[12px] font-bold tracking-[-0.1px] text-[#172033]">
          {incidentCode}: {title}
        </h2>

        <span
          className={`
            ml-auto
            h-[10px]
            w-[10px]
            shrink-0
            rounded-full
            ${statusStyle.dotColor}
          `}
        />
      </div>

      <p className="mt-1.5 whitespace-nowrap text-[10px] font-medium text-[#687B9B]">
        Detected {detectedAt}
        <span className="mx-1.5">•</span>
        Active for {activeDuration}
      </p>
    </div>
  );
};

export default EvidenceAlert;