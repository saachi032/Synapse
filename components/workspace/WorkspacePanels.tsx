"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudyStore } from "@/store/useStudyStore";
import { useStudyActions } from "@/hooks/useStudyActions";

const shell = "rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg";
const title = "text-2xl font-semibold text-white";
const desc = "text-base text-gray-400";
const body = "text-base text-gray-200 leading-relaxed";

export function SummaryWorkspacePanel() {
  const { summary, isLoading } = useStudyStore();
  const { callStudyApi } = useStudyActions();
  const [summaryLevel, setSummaryLevel] = useState<
    "short" | "medium" | "detailed"
  >("medium");

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={shell}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className={title}>Summary</h1>
          <p className={`max-w-xl ${desc}`}>
            Bullets plus narrative, tuned to depth.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={summaryLevel}
            onChange={(e) =>
              setSummaryLevel(e.target.value as typeof summaryLevel)
            }
            className="h-11 rounded-full border border-white/15 bg-black/40 px-4 text-sm text-gray-100 outline-none"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="detailed">Detailed</option>
          </select>
          <Button
            disabled={isLoading}
            onClick={() => callStudyApi("summary", { summaryLevel })}
            className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2.5 text-sm font-medium transition hover:scale-105"
          >
            {isLoading ? "Generating…" : "Generate"}
          </Button>
        </div>
      </div>
      <div className="mt-8 space-y-6">
        {!summary && (
          <p className={desc}>Generate a summary from your uploaded PDF.</p>
        )}
        {summary && (
          <>
            <h2 className="text-xl font-semibold text-white">{summary.title}</h2>
            <ul className={`list-disc space-y-2 pl-6 ${body}`}>
              {summary.bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
            <p className={`${desc} max-w-3xl`}>{summary.paragraph}</p>
          </>
        )}
      </div>
    </motion.section>
  );
}

export function FlashcardsWorkspacePanel() {
  const { flashcards, isLoading } = useStudyStore();
  const { callStudyApi } = useStudyActions();
  const [flashcardCount, setFlashcardCount] = useState(10);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${shell}`}>
        <div>
          <h1 className={title}>Flashcards</h1>
          <p className={`mt-1 max-w-xl ${desc}`}>
            Tap a card to flip and choose how many to generate.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={flashcardCount}
            onChange={(e) => setFlashcardCount(Number(e.target.value))}
            className="h-11 rounded-full border border-white/15 bg-black/40 px-4 text-sm text-gray-100 outline-none"
          >
            {[5, 10, 15, 20, 25].map((count) => (
              <option key={count} value={count}>
                {count} cards
              </option>
            ))}
          </select>
          <Button
            disabled={isLoading}
            onClick={() => callStudyApi("flashcards", { flashcardCount })}
            className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2.5 text-sm transition hover:scale-105"
          >
            {isLoading ? "Generating…" : "Generate deck"}
          </Button>
        </div>
      </div>
      {!flashcards.length ? (
        <p className={desc}>No flashcards yet.</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Showing {flashcards.length} flashcards
          </p>
          <div className="grid gap-6 md:grid-cols-2">
          {flashcards.map((card, idx) => (
            <FlashcardTile key={idx} card={card} />
          ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}

function FlashcardTile({
  card,
}: {
  card: { question: string; answer: string };
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      className="flex min-h-44 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-base text-white backdrop-blur-lg"
      onClick={() => setFlipped((f) => !f)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={flipped ? "a" : "q"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="max-w-prose"
        >
          {flipped ? card.answer : card.question}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

//

export function QuizWorkspacePanel() {
  const { quiz, isLoading } = useStudyStore();
  const { callStudyApi } = useStudyActions();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const score =
    quiz.length === 0
      ? 0
      : quiz.reduce(
          (acc, q, idx) => (answers[idx] === q.correct ? acc + 1 : acc),
          0,
        );

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${shell}`}>
        <div>
          <h1 className={title}>Quiz</h1>
          <p className={`mt-1 ${desc}`}>Multiple choice with feedback.</p>
        </div>
        <Button
          disabled={isLoading}
          onClick={() => callStudyApi("quiz")}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2.5 text-sm transition hover:scale-105"
        >
          {isLoading ? "Generating…" : "Generate quiz"}
        </Button>
      </div>
      {quiz.length > 0 && (
        <p className="text-sm text-gray-400">
          Score: {score} / {quiz.length}
        </p>
      )}
      <div className="space-y-6">
        {!quiz.length ? (
          <p className={desc}>Generate questions from your PDF.</p>
        ) : (
          quiz.map((q, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg"
            >
              <p className="text-lg font-medium text-white">{q.question}</p>
              <div className="mt-4 space-y-2">
                {q.options.map((opt) => {
                  const selected = answers[idx] === opt;
                  const correct = q.correct === opt;
                  let cls =
                    "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-left text-sm text-gray-200 hover:border-purple-400/50";
                  if (selected && correct)
                    cls =
                      "w-full rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-4 py-3 text-left text-sm text-emerald-100";
                  if (selected && !correct)
                    cls =
                      "w-full rounded-xl border border-rose-500/60 bg-rose-500/10 px-4 py-3 text-left text-sm text-rose-100";
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={cls}
                      onClick={() =>
                        setAnswers((p) => ({ ...p, [idx]: opt }))
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answers[idx] ? (
                <p className="mt-3 text-sm text-gray-400">
                  {answers[idx] === q.correct ? "✓ " : "✗ "}
                  {q.explanation}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}

export function AskWorkspacePanel() {
  const { qaHistory, isLoading } = useStudyStore();
  const { callStudyApi } = useStudyActions();
  const [question, setQuestion] = useState("");

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-8 ${shell}`}
    >
      <div>
        <h1 className={title}>Talk to your PDF</h1>
        <p className={`mt-2 max-w-2xl ${desc}`}>
          Answers use the text you uploaded.
        </p>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          placeholder="Ask anything…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="h-12 flex-1 rounded-xl border-white/15 bg-black/40 text-base"
        />
        <Button
          disabled={isLoading || !question.trim()}
          onClick={() => callStudyApi("qa", { question })}
          className="h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 text-sm transition hover:scale-105"
        >
          {isLoading ? "Thinking…" : "Ask"}
        </Button>
      </div>
      <div className="space-y-4">
        {!qaHistory.length ? (
          <p className={desc}>Your conversation appears here.</p>
        ) : (
          qaHistory.map((qa, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-black/30 p-5"
            >
              <p className="font-medium text-white">Q: {qa.question}</p>
              <p className={`mt-2 ${body}`}>A: {qa.answer}</p>
              <p className="mt-2 text-xs text-gray-500">
                Confidence: {(qa.confidence * 100).toFixed(0)}%
              </p>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}

export function TopicsWorkspacePanel() {
  const { topics, isLoading } = useStudyStore();
  const { callStudyApi } = useStudyActions();

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${shell}`}>
        <div>
          <h1 className={title}>Topics</h1>
          <p className={`mt-1 ${desc}`}>Outline of concepts in the doc.</p>
        </div>
        <Button
          disabled={isLoading}
          onClick={() => callStudyApi("topics")}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2.5 text-sm transition hover:scale-105"
        >
          {isLoading ? "Generating…" : "Generate map"}
        </Button>
      </div>
      <div className="space-y-4">
        {!topics.length ? (
          <p className={desc}>No topics yet.</p>
        ) : (
          topics.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg"
            >
              <p className="text-lg font-semibold text-white">{t.topic}</p>
              <ul className={`mt-3 list-disc space-y-1 pl-6 text-sm text-gray-400`}>
                {t.subtopics.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}

export function ExplainWorkspacePanel() {
  const { explanation, isLoading } = useStudyStore();
  const { callStudyApi } = useStudyActions();
  const [explanationMode, setExplanationMode] = useState<
    "simple" | "exam" | "technical"
  >("exam");

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={shell}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className={title}>Explain</h1>
          <p className={`mt-2 max-w-xl ${desc}`}>
            ELI5, exam-ready, or technical.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={explanationMode}
            onChange={(e) =>
              setExplanationMode(e.target.value as typeof explanationMode)
            }
            className="h-11 rounded-full border border-white/15 bg-black/40 px-4 text-sm text-gray-100 outline-none"
          >
            <option value="simple">ELI5</option>
            <option value="exam">Exam-ready</option>
            <option value="technical">Technical</option>
          </select>
          <Button
            disabled={isLoading}
            onClick={() =>
              callStudyApi("explanation", { explanationMode })
            }
            className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2.5 text-sm transition hover:scale-105"
          >
            {isLoading ? "Generating…" : "Generate"}
          </Button>
        </div>
      </div>
      <div className="mt-8">
        {!explanation ? (
          <p className={desc}>Run an explanation for your PDF.</p>
        ) : (
          <p className={`${body} max-w-3xl`}>{explanation.explanation}</p>
        )}
      </div>
    </motion.section>
  );
}

export function ResourcesWorkspacePanel() {
  const { resources, isLoading } = useStudyStore();
  const { callStudyApi } = useStudyActions();

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${shell}`}>
        <div>
          <h1 className={title}>Resources</h1>
          <p className={`mt-1 ${desc}`}>Videos & articles to go deeper.</p>
        </div>
        <Button
          disabled={isLoading}
          onClick={() => callStudyApi("resources")}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2.5 text-sm transition hover:scale-105"
        >
          {isLoading ? "Generating…" : "Suggest links"}
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {!resources.length ? (
          <p className={desc}>No resources yet.</p>
        ) : (
          resources.map((r, idx) => (
            <a
              key={idx}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 backdrop-blur-lg transition hover:border-purple-400/40 hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-semibold text-white">{r.title}</span>
                <span className="shrink-0 rounded-full bg-black/40 px-2 py-0.5 text-xs uppercase text-gray-400">
                  {r.type}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-400">{r.reason}</p>
            </a>
          ))
        )}
      </div>
    </motion.section>
  );
}
