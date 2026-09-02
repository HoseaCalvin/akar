"use client";

type SparklineProps = {
  values: number[];
  color: string;
  className?: string;
};

export default function Sparkline({ values, color, className }: SparklineProps) {
  const width = 300;
  const height = 90;
  const pad = 8;
  const series = values.length > 1 ? values : [0, 0];
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;

  const points = series.map((value, index) => {
    const x = (index / (series.length - 1)) * width;
    const y = height - pad - ((value - min) / span) * (height - pad * 2);
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });

  const line = `M${points.join(" L")}`;
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const gradientId = `spark-${color.replace("#", "")}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className ?? "h-full w-full"}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
