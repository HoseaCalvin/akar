"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-gray-900">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-2 text-gray-500">
          The page you are looking for could not be found.
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 rounded-lg bg-blue-900 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}