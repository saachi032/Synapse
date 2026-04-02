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
      <div className="space-y-8 pt-10 lg:pt-0">
        <div className="rounded-[32px] border border-amber-500/30 bg-[linear-gradient(180deg,rgba(201,107,75,0.16),rgba(201,107,75,0.06))] p-8 text-center backdrop-blur-xl">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">
            Upload a PDF to use tools
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#f1dfd7]">
            Use <span className="font-medium text-white">Upload PDF</span> in
            the header. Your session stays in this tab until you refresh.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-[linear-gradient(135deg,#f9f6fa_0%,#dbc9f3_42%,#af98e4_100%)] px-6 py-3 text-sm font-medium text-[#1b1026] shadow-[0_20px_48px_rgba(70,50,201,0.28)] transition hover:-translate-y-0.5"
          >
            Back to home
          </Link>
          {error ? (
            <p className="mt-4 text-sm text-rose-200">{error}</p>
          ) : null}
        </div>
        {isHub ? (
          <div className="pointer-events-none opacity-50">{children}</div>
        ) : null}
      </div>
    );
  }

  return <div className="pt-10 lg:pt-0">{children}</div>;
}
