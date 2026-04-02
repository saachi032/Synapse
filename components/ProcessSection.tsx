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
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#cbb9de]">
          From concept to retention
        </p>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
          A smoother path from upload to actual understanding
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step) => (
          <motion.div
            key={step.label}
            whileHover={{
              y: -6,
              scale: 1.02,
              boxShadow: "0 18px 48px rgba(70,50,201,0.24)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,246,250,0.08),rgba(249,246,250,0.03))] p-5 text-xs text-[#eadff5] shadow-[0_22px_54px_rgba(0,0,0,0.2)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-16 h-24 bg-gradient-to-b from-white/15 via-transparent to-transparent opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative space-y-3">
              <span className="rounded-full bg-[rgba(4,2,7,0.44)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#cfbfdf]">
                {step.label}
              </span>
              <h3 className="text-sm font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-7 text-[#d0c2e2]">
                {step.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
