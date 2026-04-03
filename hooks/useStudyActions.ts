"use client";

import { useStudyStore } from "@/store/useStudyStore";
import type { StudyModeTab } from "@/store/useStudyStore";

export type ApiMode =
  | "summary"
  | "flashcards"
  | "quiz"
  | "topics"
  | "explanation"
  | "qa"
  | "resources";

type CallOptions = {
  question?: string;
  summaryLevel?: "short" | "medium" | "detailed";
  explanationMode?: "simple" | "exam" | "technical";
  flashcardCount?: number;
};

function asArray<T>(value: unknown, keys: string[] = []): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === "object") {
    for (const key of keys) {
      const nested = (value as Record<string, unknown>)[key];
      if (Array.isArray(nested)) {
        return nested as T[];
      }
    }
  }

  return [];
}

export function useStudyActions() {
  const {
    sessionId,
    isUploading,
    isLoading,
    setSession,
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
    setTab,
  } = useStudyStore();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
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
      e.target.value = "";
    }
  }

  async function callStudyApi(mode: ApiMode, options: CallOptions = {}) {
    if (!sessionId) {
      setError("Upload a PDF first.");
      return;
    }

    setError(undefined);
    setLoading(true);

    try {
      const body: {
        sessionId: string;
        mode: ApiMode;
        summaryLevel?: "short" | "medium" | "detailed";
        explanationMode?: "simple" | "exam" | "technical";
        flashcardCount?: number;
        question?: string;
      } = { sessionId, mode };

      if (mode === "summary") {
        body.summaryLevel = options.summaryLevel ?? "medium";
      }
      if (mode === "explanation") {
        body.explanationMode = options.explanationMode ?? "exam";
      }
      if (mode === "qa" && options.question) {
        body.question = options.question;
      }
      if (mode === "flashcards") {
        body.flashcardCount = options.flashcardCount ?? 10;
      }

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
      for (;;) {
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
          setFlashcards(asArray(json, ["flashcards", "cards", "items"]));
          break;
        case "quiz":
          setQuiz(asArray(json, ["quiz", "questions", "items"]));
          break;
        case "topics":
          setTopics(asArray(json, ["topics", "items"]));
          break;
        case "explanation":
          setExplanation(json);
          break;
        case "qa":
          addQA(json);
          break;
        case "resources":
          setResources(asArray(json, ["resources", "items", "links"]));
          break;
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  }

  function syncTab(tab: StudyModeTab) {
    setTab(tab);
  }

  return {
    handleUpload,
    callStudyApi,
    syncTab,
    isUploading,
    isLoading,
  };
}
