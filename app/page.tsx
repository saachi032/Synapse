"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { ProcessSection } from "@/components/ProcessSection";
import { useStudyStore } from "@/store/useStudyStore";
import { useStudyActions } from "@/hooks/useStudyActions";

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
    <div className="min-h-screen font-sans text-white antialiased">
      <SiteHeader />

      <main className="w-full space-y-14 px-4 py-8 sm:px-6 lg:px-8 lg:space-y-20 lg:py-12">
        <Hero
          filename={filename}
          chunkCount={chunkCount}
          error={error}
          onUpload={handleUpload}
          isUploading={isUploading}
        />

        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#cbb9de]">
              What opens up
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
              One workspace, all the study modes you actually need
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[#d0c2e2]">
              After upload, Synapse keeps every mode close by with a dedicated
              left-side workspace menu, stronger calls to action, and less
              scrolling between states.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Summary"
              description="Layered overviews with quick bullets and fuller context when you want to go deeper."
              icon={<span aria-hidden>✦</span>}
              highlight="Read"
            />
            <FeatureCard
              title="Practice"
              description="Flashcards and quizzes generated from the uploaded material, not generic filler."
              icon={<span aria-hidden>⌘</span>}
              highlight="Drill"
            />
            <FeatureCard
              title="Talk to AI"
              description="Ask grounded questions from the same workspace without losing your place."
              icon={<span aria-hidden>∞</span>}
              highlight="Chat"
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[#cbb9de]">
              Inside Synapse
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.05em] text-white md:text-4xl">
              A home page that feels like a product, not a placeholder.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#d0c2e2]">
              Bigger visuals, softer depth, stronger contrast, and motion that
              helps the page feel premium without becoming messy.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Glanceable states",
                  body: "See the upload, summary, and practice journey instantly.",
                  icon: "/globe.svg",
                },
                {
                  title: "More visual rhythm",
                  body: "Cards, soft glows, and layered surfaces break the monotony.",
                  icon: "/window.svg",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[26px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5"
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={52}
                    height={52}
                    className="h-11 w-11 opacity-80"
                  />
                  <p className="mt-5 text-lg font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[#d0c2e2]">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {[
              {
                title: "Upload",
                accent: "from-[#4632c9]/40 to-transparent",
                copy: "Drop a PDF and move immediately into the study flow.",
              },
              {
                title: "Summary",
                accent: "from-[#c96b4b]/35 to-transparent",
                copy: "Readable, layered output instead of a giant wall of text.",
              },
              {
                title: "Quiz",
                accent: "from-[#af98e4]/40 to-transparent",
                copy: "Practice panels that feel like they belong to one system.",
              },
              {
                title: "Ask AI",
                accent: "from-[#f2e8ff]/18 to-transparent",
                copy: "Context-aware answers without the UI falling apart.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6"
              >
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${item.accent}`} />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#cbb9de]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-[#d0c2e2]">
                    {item.copy}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,246,250,0.08),rgba(249,246,250,0.03))] p-8 backdrop-blur-xl md:p-10">
          <ProcessSection />
        </div>
      </main>
    </div>
  );
}
