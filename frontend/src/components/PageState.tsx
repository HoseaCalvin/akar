"use client";

type PageStateProps = {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyLabel?: string;
};

export default function PageState({
  loading,
  error,
  empty,
  emptyLabel = "No data yet",
}: PageStateProps) {
  if (loading) {
    return (
      <p className="rounded-xl bg-white/70 px-4 py-6 text-sm text-slate-500">
        Loading…
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-6 text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (empty) {
    return (
      <p className="rounded-xl bg-white/70 px-4 py-6 text-sm text-slate-500">
        {emptyLabel}
      </p>
    );
  }

  return null;
}
