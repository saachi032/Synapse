"use client";

import { useStudyStore } from "@/store/useStudyStore";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TabsSection } from "@/components/Tabs";
import { FeatureCard } from "@/components/FeatureCard";
import { ProcessSection } from "@/components/ProcessSection";

type ModeKey =
  | "summary"
  | "flashcards"
  | "quiz"
  | "topics"
  | "explanation"
  | "qa"
  | "resources";

export default function Home() {
  const {
    sessionId,
    filename,
    chunkCount,
    currentTab,
    isUploading,
    isLoading,
    error,
    summary,
    flashcards,
    quiz,
    topics,
    explanation,
    qaHistory,
    resources,
    setSession,
    setTab,
    setUploading,
    setLoading,
    setError,
    setSummary,
    setFlashcards,
    setQuiz,
    setTopics,
    setExplanation,
    addQA,
    setResources,
  } = useStudyStore();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setError(undefined);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Upload failed.");
        return;
      }

      setSession({
        sessionId: json.sessionId,
        filename: json.filename,
        chunkCount: json.chunkCount,
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  }

  async function callStudyApi(mode: ModeKey, question?: string) {
    if (!sessionId) {
      setError("Upload a PDF first.");
      return;
    }

    setError(undefined);
    setLoading(true);

    try {
      const body: {
        sessionId: string;
        mode: ModeKey;
        summaryLevel?: "short" | "medium" | "detailed";
        explanationMode?: "simple" | "exam" | "technical";
        question?: string;
      } = { sessionId, mode };

      if (mode === "summary") body.summaryLevel = "medium";
      if (mode === "explanation") body.explanationMode = "exam";
      if (mode === "qa" && question) body.question = question;

      const res = await fetch("/api/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok || !res.body) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Request failed.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      fullText += decoder.decode();

      const json = JSON.parse(fullText);

      switch (mode) {
        case "summary":
          setSummary(json);
          break;
        case "flashcards":
          setFlashcards(json);
          break;
        case "quiz":
          setQuiz(json);
          break;
        case "topics":
          setTopics(json);
          break;
        case "explanation":
          setExplanation(json);
          break;
        case "qa":
          addQA(json);
          break;
        case "resources":
          setResources(json);
          break;
      }
    } catch (err) {
      console.error(err);
      setError("Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  }
<div className="bg-red-500 text-white p-10 text-3xl">
  IF THIS IS NOT RED → TAILWIND IS BROKEN
</div>
  return (
    <div className="relative min-h-screen bg-[#0b0b12] text-white overflow-hidden">
      
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[10%] h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      <Navbar isUploading={isUploading} onUpload={handleUpload} />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        
        <Hero filename={filename} chunkCount={chunkCount} error={error} />

        {/* Features */}
        <section className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Trusted study primitives
            </p>
            <h2 className="text-3xl font-semibold text-zinc-100">
              Everything you need, orchestrated in one view
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Summary"
              description="Generate layered summaries that move from high-level bullets into focused narrative context."
              icon={<span>✦</span>}
              highlight="Overview"
            />
            <FeatureCard
              title="Flashcards & quiz"
              description="Turn dense sections into recall-friendly prompts and quizzes that track your understanding."
              icon={<span>⌘</span>}
              highlight="Practice"
            />
            <FeatureCard
              title="Ask your PDF"
              description="Ask free-form questions and get answers grounded directly in the text you uploaded."
              icon={<span>∞</span>}
              highlight="RAG"
            />
          </div>
        </section>

        {/* Tabs */}
        <section className="space-y-6">
          <TabsSection
            currentTab={currentTab as ModeKey}
            setTab={(tab) => setTab(tab)}
            isLoading={isLoading}
            summary={summary}
            flashcards={flashcards}
            quiz={quiz}
            topics={topics}
            explanation={explanation}
            qaHistory={qaHistory}
            resources={resources}
            callStudyApi={callStudyApi}
          />
        </section>

        <ProcessSection />
      </main>
    </div>
  );
}
