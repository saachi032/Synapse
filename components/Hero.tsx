"use client";

import { motion } from "framer-motion";

type HeroProps = {
  filename?: string;
  chunkCount?: number;
  error?: string;
};

export function Hero({ filename, chunkCount, error }: HeroProps) {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex justify-center">
        <div className="h-72 w-[540px] rounded-full bg-[radial-gradient(circle_at_20%_0%,rgba(244,114,182,0.3),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(129,140,248,0.5),transparent_55%)] opacity-60 blur-3xl" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-gray-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span>AI study workspace</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            One AI workspace{" "}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              for studying anything
            </span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-gray-400">
            Upload a PDF and get summaries, flashcards, quizzes, topics,
            explanations, and Q&amp;A — orchestrated into a single calm
            dashboard so you can stay in flow.
          </p>
        </div>

        {filename && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-[11px] text-gray-300">
            <span className="truncate">
              <span className="mr-1 text-gray-500">Current file:</span>
              <span className="font-medium text-gray-50">{filename}</span>
            </span>
            {typeof chunkCount === "number" && (
              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[10px] text-gray-200">
                {chunkCount} chunks indexed
              </span>
            )}
          </div>
        )}

        {error && (
          <motion.div
            className="rounded-2xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-xs text-rose-100"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
      </div>
    </section>
  );
}

