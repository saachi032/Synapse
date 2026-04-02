"use client";

import { motion } from "framer-motion";
import type { ChangeEvent } from "react";

type HeroProps = {
  filename?: string;
  chunkCount?: number;
  error?: string;
  onUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
};

export function Hero({
  filename,
  chunkCount,
  error,
  onUpload,
  isUploading,
}: HeroProps) {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex justify-center">
        <div className="h-72 w-[540px] rounded-full bg-[radial-gradient(circle_at_20%_0%,rgba(244,114,182,0.3),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(129,140,248,0.5),transparent_55%)] opacity-60 blur-3xl" />
      </div>

      <div className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-sm font-medium text-gray-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span>StudyGuide AI</span>
        </div>

        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl md:leading-tight">
            Your AI study workspace —{" "}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              one PDF, every mode
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
            Upload a PDF, then move through summary, flashcards, quiz, and
            chat from the workspace nav — aligned layouts, no clutter.
          </p>
        </div>

        {onUpload ? (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-black/30 px-6 py-10 text-center transition hover:border-purple-400/50 hover:bg-white/5">
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={onUpload}
              disabled={isUploading}
            />
            <span className="text-base font-medium text-white">
              {isUploading ? "Processing your PDF…" : "Drop or click to upload PDF"}
            </span>
            <span className="text-sm text-gray-500">
              We extract text, chunk it, and embed it for AI tools.
            </span>
          </label>
        ) : null}

        {filename ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-gray-300">
            <span className="truncate">
              <span className="text-gray-500">Current file:</span>{" "}
              <span className="font-medium text-white">{filename}</span>
            </span>
            {typeof chunkCount === "number" ? (
              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200">
                {chunkCount} chunks indexed
              </span>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <motion.div
            className="rounded-2xl border border-rose-500/50 bg-rose-500/10 px-5 py-4 text-sm text-rose-100"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
