"use client";

import { motion } from "framer-motion";

const steps = [
  {
    label: "Development",
    title: "From upload to structure",
    body: "We parse, chunk, and index your PDF into a graph of concepts that AI can reason over.",
  },
  {
    label: "Onboarding",
    title: "From structure to insights",
    body: "Generate summaries, flashcards, quizzes, and more — tuned to your difficulty and style.",
  },
  {
    label: "Delivery",
    title: "From insights to practice",
    body: "Drill with spaced flashcards and quizzes that adapt to what you miss.",
  },
  {
    label: "Deployment",
    title: "From sessions to mastery",
    body: "Come back to any file and pick up where you left off, with your history remembered.",
  },
];

export function ProcessSection() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
          From concept to retention
        </p>
        <h2 className="text-3xl font-semibold text-white">
          A calm pipeline from upload to understanding
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step) => (
          <motion.div
            key={step.label}
            whileHover={{
              y: -6,
              scale: 1.02,
              boxShadow: "0 0 42px rgba(129,140,248,0.55)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300 shadow-lg backdrop-blur-lg"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-16 h-24 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative space-y-3">
              <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                {step.label}
              </span>
              <h3 className="text-sm font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-[11px] leading-relaxed text-gray-400">
                {step.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

