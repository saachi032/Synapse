"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { ProcessSection } from "@/components/ProcessSection";
import { useStudyStore } from "@/store/useStudyStore";
import { useStudyActions } from "@/hooks/useStudyActions";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { sessionId, filename, chunkCount, error } = useStudyStore();
  const { handleUpload, isUploading } = useStudyActions();

  useEffect(() => {
    if (sessionId) {
      router.push("/workspace");
    }
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b12] via-[#070712] to-black font-sans text-white antialiased">
      <SiteHeader />

      <main className="mx-auto max-w-6xl space-y-20 px-6 py-14">
        <Hero
          filename={filename}
          chunkCount={chunkCount}
          error={error}
          onUpload={handleUpload}
          isUploading={isUploading}
        />

        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              What you get
            </p>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              One workspace for every study mode
            </h2>
            <p className="max-w-2xl text-base text-gray-400">
              After you upload, you jump into a focused flow: pick summary,
              flashcards, quiz, or chat — each on its own screen with a clear
              top navigation.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Summary"
              description="Layered overview: bullets plus narrative, with depth you control."
              icon={<span aria-hidden>✦</span>}
              highlight="Read"
            />
            <FeatureCard
              title="Practice"
              description="Flashcards and quizzes generated from your actual PDF text."
              icon={<span aria-hidden>⌘</span>}
              highlight="Drill"
            />
            <FeatureCard
              title="Talk to AI"
              description="RAG-style answers grounded in what you uploaded."
              icon={<span aria-hidden>∞</span>}
              highlight="Chat"
            />
          </div>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Ready to open the workspace?
            </h3>
            <p className="mt-1 text-base text-gray-400">
              Upload a PDF above — you&apos;ll be sent there automatically.
            </p>
          </div>
          <Link
            href="/workspace"
            className="inline-flex rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-medium text-white transition hover:scale-105"
          >
            Go to workspace
          </Link>
        </section>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg md:p-10">
          <ProcessSection />
        </div>
      </main>
    </div>
  );
}
