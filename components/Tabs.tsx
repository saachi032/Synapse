"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs as UITabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ModeKey =
  | "summary"
  | "flashcards"
  | "quiz"
  | "topics"
  | "explanation"
  | "qa"
  | "resources";

type Summary = {
  title: string;
  bullets: string[];
  paragraph: string;
} | null;

type Flashcard = { question: string; answer: string };
type Topic = { topic: string; subtopics: string[] };
type Explanation = { explanation: string } | null;
type QAItem = { question: string; answer: string; confidence: number };
type Resource = { title: string; type: string; url: string; reason: string };

type TabsSectionProps = {
  currentTab: ModeKey;
  setTab: (tab: ModeKey) => void;
  isLoading: boolean;
  summary: Summary;
  flashcards: Flashcard[];
  quiz: { question: string; options: string[]; correct: string; explanation?: string }[];
  topics: Topic[];
  explanation: Explanation;
  qaHistory: QAItem[];
  resources: Resource[];
  callStudyApi: (mode: ModeKey, question?: string) => Promise<void>;
};

const cardHover = { scale: 1.02, y: -2 };
const cardTap = { scale: 0.98, y: 0 };

export function TabsSection({
  currentTab,
  setTab,
  isLoading,
  summary,
  flashcards,
  quiz,
  topics,
  explanation,
  qaHistory,
  resources,
  callStudyApi,
}: TabsSectionProps) {
  const [question, setQuestion] = useState("");
  const [summaryLevel, setSummaryLevel] = useState<"short" | "medium" | "detailed">("medium");
  const [explanationMode, setExplanationMode] =
    useState<"simple" | "exam" | "technical">("exam");

  async function handleCall(mode: ModeKey) {
    await callStudyApi(mode, mode === "qa" ? question : undefined);
  }

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-semibold">Study modes</h2>
          <p className="text-sm text-gray-400">
            Switch between summaries, flashcards, quizzes, explanations, and more.
          </p>
        </div>
        <UITabs
          value={currentTab}
          onValueChange={(val) => setTab(val as ModeKey)}
          className="w-full"
        >
          <div className="flex flex-wrap gap-3">
            <TabsList className="flex flex-wrap gap-3 bg-transparent p-0 shadow-none">
              {[
                "summary",
                "flashcards",
                "quiz",
                "topics",
                "explanation",
                "qa",
                "resources",
              ].map((id) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="capitalize rounded-full bg-white/10 px-4 py-1.5 text-sm text-gray-200 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                >
                  {id === "qa" ? "Ask PDF" : id === "explanation" ? "Explain" : id}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="summary" className="mt-6">
              <motion.div whileHover={cardHover} whileTap={cardTap}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
                  <CardHeader className="flex flex-row items-center justify-between gap-4 p-0 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base text-zinc-100">Summary</CardTitle>
                      <p className="text-xs text-zinc-400">
                        Multi-layered overview blending bullets and narrative context.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={summaryLevel}
                        onChange={(e) =>
                          setSummaryLevel(e.target.value as typeof summaryLevel)
                        }
                        className="h-9 rounded-full border border-white/15 bg-black/40 px-3 text-xs text-zinc-200 shadow-[0_0_20px_rgba(15,23,42,0.7)] outline-none transition-all duration-300 ease-out focus:border-indigo-400 focus:shadow-[0_0_32px_rgba(129,140,248,0.85)]"
                      >
                        <option value="short">Short pulse</option>
                        <option value="medium">Standard</option>
                        <option value="detailed">Deep dive</option>
                      </select>
                      <Button
                        disabled={isLoading}
                        onClick={() => handleCall("summary")}
                        className="bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#22d3ee] px-5 text-xs font-medium shadow-[0_0_30px_rgba(129,140,248,0.75)] transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_42px_rgba(129,140,248,0.95)] hover:-translate-y-[1px]"
                      >
                        {isLoading ? "Thinking..." : "Generate"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {!summary && (
                      <p className="text-xs text-zinc-400">
                        Upload a PDF and generate a summary tuned to how deep you want to go.
                      </p>
                    )}
                    {summary && (
                      <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-zinc-100">
                          {summary.title}
                        </h2>
                        <ul className="list-disc space-y-1 pl-4 text-xs text-zinc-200">
                          {summary.bullets.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                        <p className="text-xs leading-relaxed text-zinc-400">
                          {summary.paragraph}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </div>
              </motion.div>
          </TabsContent>

            <TabsContent value="flashcards" className="mt-6">
              <motion.div whileHover={cardHover} whileTap={cardTap}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-4 p-0 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base text-zinc-100">
                        Flashcards
                      </CardTitle>
                      <p className="text-xs text-zinc-400">
                        Active recall built automatically from your document.
                      </p>
                    </div>
                    <Button
                      disabled={isLoading}
                      onClick={() => handleCall("flashcards")}
                      className="px-4 text-xs"
                    >
                      {isLoading ? "Thinking..." : "Generate"}
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {!flashcards.length && (
                      <p className="text-xs text-zinc-400">
                        No flashcards yet. Generate a deck tailored to this PDF.
                      </p>
                    )}
                    {!!flashcards.length && (
                      <div className="grid gap-4 md:grid-cols-2">
                        {flashcards.map((card, idx) => (
                          <FlashcardView key={idx} card={card} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="quiz" className="mt-6">
              <motion.div whileHover={cardHover} whileTap={cardTap}>
                <QuizView
                  quiz={quiz}
                  isLoading={isLoading}
                  onGenerate={() => handleCall("quiz")}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="topics" className="mt-6">
              <motion.div whileHover={cardHover} whileTap={cardTap}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-4 p-0 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base text-zinc-100">
                        Topics
                      </CardTitle>
                      <p className="text-xs text-zinc-400">
                        See how the document arranges into high‑level concepts.
                      </p>
                    </div>
                    <Button
                      disabled={isLoading}
                      onClick={() => handleCall("topics")}
                      className="px-4 text-xs"
                    >
                      {isLoading ? "Thinking..." : "Generate"}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {!topics.length && (
                      <p className="text-xs text-zinc-400">
                        Generate a topic map to understand the structure at a glance.
                      </p>
                    )}
                    {topics.map((t, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-zinc-200 shadow-[0_18px_45px_rgba(0,0,0,0.8)]"
                      >
                        <p className="text-sm font-medium text-zinc-100">
                          {t.topic}
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-zinc-400">
                          {t.subtopics.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="explanation" className="mt-6">
              <motion.div whileHover={cardHover} whileTap={cardTap}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-4 p-0 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base text-zinc-100">
                        Explanations
                      </CardTitle>
                      <p className="text-xs text-zinc-400">
                        Switch between ELI5, exam mode, and technical depth.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={explanationMode}
                        onChange={(e) =>
                          setExplanationMode(
                            e.target.value as typeof explanationMode,
                          )
                        }
                        className="h-9 rounded-full border border-white/15 bg-black/40 px-3 text-xs text-zinc-200 shadow-[0_0_20px_rgba(15,23,42,0.7)] outline-none transition-all duration-300 ease-out focus:border-indigo-400 focus:shadow-[0_0_32px_rgba(129,140,248,0.85)]"
                      >
                        <option value="simple">Explain like I&apos;m 5</option>
                        <option value="exam">Exam ready</option>
                        <option value="technical">Technical deep dive</option>
                      </select>
                      <Button
                        disabled={isLoading}
                        onClick={() => handleCall("explanation")}
                        className="px-4 text-xs"
                      >
                        {isLoading ? "Thinking..." : "Generate"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {!explanation && (
                      <p className="text-xs text-zinc-400">
                        Generate an explanation tuned exactly to how you want the AI to talk.
                      </p>
                    )}
                    {explanation && (
                      <p className="text-xs leading-relaxed text-zinc-300">
                        {explanation.explanation}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="qa" className="mt-6">
              <motion.div whileHover={cardHover} whileTap={cardTap}>
                <Card>
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-base text-zinc-100">
                      Ask your PDF
                    </CardTitle>
                    <p className="mt-1 text-xs text-zinc-400">
                      Retrieval‑augmented questions grounded directly in the file you uploaded.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="flex flex-col gap-3 md:flex-row">
                      <Input
                        placeholder="Ask anything about the PDF..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="md:flex-1"
                      />
                      <Button
                        disabled={isLoading || !question.trim()}
                        onClick={() => handleCall("qa")}
                        className="px-5 text-xs"
                      >
                        Ask
                      </Button>
                    </div>
                    {!qaHistory.length && (
                      <p className="text-xs text-zinc-400">
                        Your question and answer history will appear here.
                      </p>
                    )}
                    <div className="space-y-3">
                      {qaHistory.map((qa, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] text-zinc-200 shadow-[0_18px_45px_rgba(0,0,0,0.8)]"
                        >
                          <p className="font-medium text-zinc-100">
                            Q: {qa.question}
                          </p>
                          <p className="mt-2 text-zinc-300">A: {qa.answer}</p>
                          <p className="mt-1 text-[10px] text-zinc-500">
                            Confidence: {(qa.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <motion.div whileHover={cardHover} whileTap={cardTap}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-4 p-0 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base text-zinc-100">
                        Learning resources
                      </CardTitle>
                      <p className="text-xs text-zinc-400">
                        Curated links that extend what&apos;s inside the PDF.
                      </p>
                    </div>
                    <Button
                      disabled={isLoading}
                      onClick={() => handleCall("resources")}
                      className="px-4 text-xs"
                    >
                      {isLoading ? "Thinking..." : "Generate"}
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {!resources.length && (
                      <p className="text-xs text-zinc-400">
                        Generate external resources to go deeper on this topic.
                      </p>
                    )}
                    <div className="grid gap-4 md:grid-cols-2">
                      {resources.map((r, idx) => (
                        <a
                          key={idx}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] text-zinc-200 shadow-[0_18px_45px_rgba(0,0,0,0.8)] transition-all duration-300 ease-out hover:-translate-y-[3px] hover:border-[#818cf8] hover:bg-white/[0.06] hover:shadow-[0_0_32px_rgba(129,140,248,0.8)]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-zinc-100">
                              {r.title}
                            </span>
                            <span className="rounded-full border border-white/20 bg-black/30 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-400">
                              {r.type}
                            </span>
                          </div>
                          <p className="mt-2 text-zinc-400">{r.reason}</p>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
        </UITabs>
      </div>
    </section>
  );
}

function FlashcardView({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="flex h-40 cursor-pointer items-center justify-center rounded-2xl border border-white/12 bg-[radial-gradient(circle_at_0%_0%,rgba(129,140,248,0.35),transparent_55%),rgba(13,13,23,0.95)] px-6 py-4 text-xs text-zinc-100 shadow-[0_22px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
      onClick={() => setFlipped((f) => !f)}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      <AnimatePresence initial={false} mode="wait">
        {flipped ? (
          <motion.div
            key="back"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-full w-full items-center justify-center text-center"
          >
            {card.answer}
          </motion.div>
        ) : (
          <motion.div
            key="front"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-full w-full items-center justify-center text-center"
          >
            {card.question}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function QuizView({
  quiz,
  isLoading,
  onGenerate,
}: {
  quiz: { question: string; options: string[]; correct: string; explanation?: string }[];
  isLoading: boolean;
  onGenerate: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const score =
    quiz.length === 0
      ? 0
      : quiz.reduce(
          (acc, q, idx) => (answers[idx] === q.correct ? acc + 1 : acc),
          0,
        );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 p-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base text-zinc-100">Quiz</CardTitle>
          <p className="text-xs text-zinc-400">
            Multiple‑choice questions with instant feedback.
          </p>
        </div>
        <Button size="default" disabled={isLoading} onClick={onGenerate} className="px-4 text-xs">
          {isLoading ? "Thinking..." : "Generate"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {!quiz.length && (
          <p className="text-xs text-zinc-400">
            Generate a quiz to test your understanding of the document.
          </p>
        )}
        {quiz.length > 0 && (
          <p className="text-[11px] text-zinc-500">
            Score: {score} / {quiz.length}
          </p>
        )}
        <div className="space-y-4">
          {quiz.map((q, idx) => (
            <motion.div
              key={idx}
              className="rounded-2xl border border-white/12 bg-white/[0.03] p-4 text-xs text-zinc-200 shadow-[0_22px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-sm font-medium text-zinc-100">{q.question}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt) => {
                  const selected = answers[idx] === opt;
                  const correct = q.correct === opt;
                  let optionClasses =
                    "w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-left text-xs text-zinc-300 transition-all duration-300 ease-out hover:border-indigo-400 hover:bg-indigo-500/10";
                  if (selected && correct) {
                    optionClasses =
                      "w-full rounded-xl border border-emerald-500 bg-emerald-500/15 px-3 py-2 text-left text-xs text-emerald-100 shadow-[0_0_26px_rgba(16,185,129,0.7)]";
                  } else if (selected && !correct) {
                    optionClasses =
                      "w-full rounded-xl border border-rose-500 bg-rose-500/15 px-3 py-2 text-left text-xs text-rose-100 shadow-[0_0_26px_rgba(239,68,68,0.7)]";
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [idx]: opt }))
                      }
                      className={optionClasses}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answers[idx] && (
                <p className="mt-2 text-[11px] text-zinc-400">
                  {answers[idx] === q.correct ? "Correct. " : "Not quite. "}
                  {q.explanation}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

