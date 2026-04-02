"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useStudyStore } from "@/store/useStudyStore";
import { useStudyActions } from "@/hooks/useStudyActions";

export function SiteHeader() {
  const pathname = usePathname();
  const inWorkspace = pathname.startsWith("/workspace");
  const { filename, chunkCount, error, setError } = useStudyStore();
  const { handleUpload, isUploading } = useStudyActions();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[rgba(7,3,12,0.78)] backdrop-blur-2xl">
      {error ? (
        <div className="border-b border-rose-500/30 bg-rose-500/10 px-4 py-2 text-center text-sm text-rose-100 sm:px-6">
          <span>{error}</span>
          <button
            type="button"
            className="ml-3 underline decoration-rose-300/80 hover:text-white"
            onClick={() => setError(undefined)}
          >
            Dismiss
          </button>
        </div>
      ) : null}
      <div className="flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(249,246,250,0.18),rgba(175,152,228,0.26))] text-base font-semibold text-white shadow-[0_16px_36px_rgba(70,50,201,0.28)]">
            S
          </div>
          <div className="min-w-0">
            <p className="font-brand text-xl font-semibold uppercase tracking-[0.16em] text-white sm:text-2xl">
              Synapse
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-[#d5c8e6]">
              Study workspace
            </p>
          </div>
        </Link>

        {inWorkspace && filename ? (
          <div className="hidden min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#e8ddf2] xl:flex xl:max-w-[44rem] xl:items-center xl:justify-center">
            <span className="truncate">
              Active file: <span className="font-medium text-white">{filename}</span>
              {chunkCount ? (
                <span className="ml-2 text-xs text-[#c9bbda]">
                  {chunkCount} sections indexed
                </span>
              ) : null}
            </span>
          </div>
        ) : (
          <div className="hidden flex-1 xl:block" />
        )}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {!inWorkspace ? (
            <Button
              asChild
              className="hidden rounded-full px-5 sm:inline-flex"
            >
              <Link href="/workspace">Open workspace</Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="secondary"
              className="hidden rounded-full px-4 text-[#f5eefb] sm:inline-flex"
            >
              <Link href="/">Back home</Link>
            </Button>
          )}
          <label className="inline-flex cursor-pointer">
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
            <span className="inline-flex items-center justify-center rounded-full border border-[#c6b4ff]/25 bg-[linear-gradient(135deg,#2c173d_0%,#41234e_55%,#4632c9_100%)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_18px_40px_rgba(70,50,201,0.32)] transition hover:-translate-y-0.5">
              {isUploading ? "Processing…" : "Upload PDF"}
            </span>
          </label>
        </div>
      </div>
    </header>
  );
}
