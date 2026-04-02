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
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Workspace
        </h1>
        <p className="max-w-2xl text-base text-gray-400">
          Choose what to do next
          {filename ? (
            <>
              {" "}
              for{" "}
              <span className="font-medium text-gray-200">{filename}</span>
            </>
          ) : null}
          . Each tool opens on its own page so the layout stays clear.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition hover:-translate-y-1 hover:border-purple-400/40 hover:bg-white/10"
          >
            <h2 className="text-lg font-semibold text-white group-hover:text-purple-200">
              {t.title}
            </h2>
            <p className="mt-2 text-sm text-gray-400">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
