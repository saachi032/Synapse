"use client";

import Link from "next/link";
import { useStudyStore } from "@/store/useStudyStore";

const tools = [
  {
    href: "/workspace/summary",
    title: "Summary",
    desc: "Skim the doc with bullets and a tight paragraph.",
  },
  {
    href: "/workspace/flashcards",
    title: "Flashcards",
    desc: "Active recall from your material.",
  },
  {
    href: "/workspace/quiz",
    title: "Quiz",
    desc: "MCQs with explanations.",
  },
  {
    href: "/workspace/ask",
    title: "Talk to AI",
    desc: "Ask questions grounded in the PDF.",
  },
  {
    href: "/workspace/topics",
    title: "Topics",
    desc: "Hierarchical map of ideas.",
  },
  {
    href: "/workspace/explain",
    title: "Explain",
    desc: "ELI5, exam mode, or deep dive.",
  },
  {
    href: "/workspace/resources",
    title: "Resources",
    desc: "Curated videos and articles.",
  },
];

export default function WorkspaceHubPage() {
  const { filename } = useStudyStore();

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(249,246,250,0.09),rgba(249,246,250,0.03))] p-7 shadow-[0_28px_72px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-9">
        <p className="text-xs uppercase tracking-[0.24em] text-[#ccb9df]">
          Workspace hub
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
          Everything stays one click away now.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#d0c2e2]">
          Choose what to do next
          {filename ? (
            <>
              {" "}
              for <span className="font-medium text-white">{filename}</span>
            </>
          ) : null}
          . The left dock stays pinned so you can jump around without scrolling
          back up to find the workspace area.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,246,250,0.08),rgba(249,246,250,0.03))] p-6 backdrop-blur-xl transition hover:-translate-y-1.5 hover:border-[#af98e4]/45 hover:bg-[rgba(249,246,250,0.1)]"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-[#cbb9de]">
              {t.href.split("/").pop()}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-[#f5ecff]">
              {t.title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#d0c2e2]">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
