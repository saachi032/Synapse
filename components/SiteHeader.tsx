"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useStudyStore } from "@/store/useStudyStore";
import { useStudyActions } from "@/hooks/useStudyActions";

export function SiteHeader() {
  const pathname = usePathname();
  const inWorkspace = pathname.startsWith("/workspace");
  const { filename, chunkCount, error, setError } = useStudyStore();
  const { handleUpload, isUploading } = useStudyActions();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a12]/85 backdrop-blur-xl">
      {error ? (
        <div className="border-b border-rose-500/30 bg-rose-500/10 px-6 py-2 text-center text-sm text-rose-100">
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
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 shadow-lg shadow-purple-500/30" />
            <div className="min-w-0 text-left">
              <div className="text-lg font-semibold tracking-tight text-white">
                StudyGuide AI
              </div>
              <div className="text-sm text-gray-400">
                PDF → summaries, practice, Q&amp;A
              </div>
            </div>
          </Link>

          {inWorkspace && filename ? (
            <div className="hidden min-w-0 truncate rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 md:block">
              <span className="text-gray-500">File:</span>{" "}
              <span className="font-medium text-white">{filename}</span>
              {chunkCount ? (
                <span className="ml-2 text-xs text-gray-500">
                  · {chunkCount} chunks
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {!inWorkspace ? (
            <Button
              asChild
              variant="ghost"
              className="hidden rounded-xl text-sm text-gray-300 hover:bg-white/10 sm:inline-flex"
            >
              <Link href="/workspace">Open workspace</Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="ghost"
              className="hidden rounded-xl text-sm text-gray-300 hover:bg-white/10 sm:inline-flex"
            >
              <Link href="/">Home</Link>
            </Button>
          )}
          <ThemeToggle />
          <label className="inline-flex cursor-pointer">
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
            <span className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:scale-105">
              {isUploading ? "Processing…" : "Upload PDF"}
            </span>
          </label>
        </div>
      </div>
    </header>
  );
}
