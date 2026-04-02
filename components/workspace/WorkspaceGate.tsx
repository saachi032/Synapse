"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStudyStore } from "@/store/useStudyStore";

export function WorkspaceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sessionId, error } = useStudyStore();
  const isHub = pathname === "/workspace";

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center backdrop-blur-lg">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Upload a PDF to use tools
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-gray-300">
            Use <span className="font-medium text-white">Upload PDF</span> in
            the header. Your session stays in this tab until you refresh.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-medium text-white transition hover:scale-105"
          >
            Back to home
          </Link>
          {error ? (
            <p className="mt-4 text-sm text-rose-200">{error}</p>
          ) : null}
        </div>
        {isHub ? (
          <div className="pointer-events-none mt-12 opacity-50">{children}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">{children}</div>
  );
}
