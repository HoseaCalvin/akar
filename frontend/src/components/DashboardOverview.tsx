import type { ReactNode } from "react";

interface DashboardOverviewProps {
  icon: ReactNode;
  value: number;
  label: string;
}

export default function DashboardOverview({ icon, value, label }: DashboardOverviewProps) {
  return (
    <section className="flex items-center glass-effect gap-x-3 rounded-xl lg:py-4 lg:px-6">
      {icon}
      <div>
        <p className="font-bold text-xl leading-none">{value}</p>
        <p className="font-semibold leading-6">{label}</p>
      </div>
    </section>
  );
}