"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

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
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] px-6 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl md:px-10 md:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(175,152,228,0.24),transparent_28%),radial-gradient(circle_at_78%_20%,rgba(201,107,75,0.18),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_58%)]" />
      <motion.div
        aria-hidden
        animate={{ x: [0, 30, 0], y: [0, -14, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-10 top-20 h-36 w-36 rounded-full border border-white/10 bg-white/5 blur-sm"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -26, 0], y: [0, 16, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-14 top-12 h-24 w-24 rounded-[30px] border border-white/10 bg-[rgba(255,255,255,0.06)]"
      />

      <div className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(8,3,14,0.55)] px-4 py-2 text-sm font-medium text-[#eadff5]"
          >
            <span className="h-2 w-2 rounded-full bg-[#c96b4b] shadow-[0_0_14px_rgba(201,107,75,0.8)]" />
            <span className="font-brand uppercase tracking-[0.16em]">Synapse</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-5"
          >
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl md:leading-[0.98] xl:text-7xl">
              Turn a boring PDF into a sharp, cinematic study flow.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#d7cae8] md:text-lg">
              Synapse gives your notes a cleaner stage: fast upload, elegant
              study modes, layered summaries, and a workspace that feels more
              like a modern product showcase than a school tool.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild className="h-12 rounded-full px-6 text-sm font-semibold">
              <Link href="/workspace">Open workspace</Link>
            </Button>
            {onUpload ? (
              <label className="inline-flex cursor-pointer">
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={onUpload}
                  disabled={isUploading}
                />
                <span className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-[rgba(249,246,250,0.06)] px-6 text-sm font-medium text-white transition hover:bg-[rgba(249,246,250,0.12)]">
                  {isUploading ? "Processing your PDF…" : "Upload PDF"}
                </span>
              </label>
            ) : null}
          </motion.div>

          {filename ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/10 bg-[rgba(6,2,11,0.58)] px-5 py-4 text-sm text-[#eadff5]"
            >
              <span className="truncate">
                Current file: <span className="font-medium text-white">{filename}</span>
              </span>
              {typeof chunkCount === "number" ? (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-[#f6effd]">
                  {chunkCount} indexed chunks
                </span>
              ) : null}
            </motion.div>
          ) : null}

          {error ? (
            <motion.div
              className="rounded-[24px] border border-rose-500/45 bg-rose-500/10 px-5 py-4 text-sm text-rose-100"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          ) : null}
        </div>

        <div className="relative min-h-[520px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="absolute right-0 top-4 w-full max-w-[620px] overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,246,250,0.96),rgba(236,227,247,0.88))] p-5 text-[#21112f] shadow-[0_28px_80px_rgba(0,0,0,0.35)]"
          >
            <div className="rounded-[28px] bg-[#13091b] p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#cbb9de]">
                    Hero preview
                  </p>
                  <p className="font-brand mt-2 text-3xl font-semibold uppercase tracking-[0.12em]">
                    Synapse
                  </p>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-[#efe7f7]">
                  live study view
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[0.62fr_0.38fr]">
                <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#d9caea]">
                      Current deck
                    </p>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-[#f1e9f8]">
                      12 concepts
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {[
                      "Upload PDF",
                      "Generate Summary",
                      "Practice with Quiz",
                    ].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.08 }}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#efe7f7]"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(175,152,228,0.26),rgba(175,152,228,0.08))] p-4"
                  >
                    <Image
                      src="/window.svg"
                      alt="Dashboard preview"
                      width={64}
                      height={64}
                      className="h-12 w-12 opacity-80"
                    />
                    <p className="mt-8 text-sm font-medium text-white">
                      Focused panels
                    </p>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(201,107,75,0.2),rgba(201,107,75,0.06))] p-4"
                  >
                    <Image
                      src="/file.svg"
                      alt="PDF preview"
                      width={64}
                      height={64}
                      className="h-12 w-12 opacity-80"
                    />
                    <p className="mt-8 text-sm font-medium text-white">
                      PDF in, modes out
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 top-10 rounded-[24px] border border-[#e5d9f4] bg-white px-4 py-3 shadow-xl"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6b587d]">
                Visual flow
              </p>
              <p className="mt-1 text-sm font-semibold text-[#21112f]">
                Feels alive on load
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-0 top-[72%] rounded-[24px] border border-white/40 bg-[#f7f1fb] px-4 py-3 shadow-xl"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6b587d]">
                Motion
              </p>
              <p className="mt-1 text-sm font-semibold text-[#21112f]">
                Smooth floating cards
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
