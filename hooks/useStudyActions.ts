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

const DEPLOYED_UPLOAD_LIMIT_BYTES = 4 * 1024 * 1024;

async function readErrorMessage(res: Response): Promise<string> {
  if (res.status === 413) {
    return "This PDF is too large for the deployed upload limit. Keep it under 4 MB, or switch to direct storage uploads for larger files.";
  }

  const contentType = res.headers.get("content-type") ?? "";
  const bodyText = await res.text().catch(() => "");

  if (contentType.includes("application/json") && bodyText) {
    try {
      const json = JSON.parse(bodyText) as { error?: string };
      if (json.error) {
        return json.error;
      }
    } catch {
      return "The server returned an unreadable error response.";
    }
  }

  if (bodyText.includes("<!DOCTYPE html") || bodyText.includes("__next_error__")) {
    if (res.status >= 500) {
      return "The deployed app returned an HTML error page instead of API JSON. This usually means the server crashed or the platform rejected the request.";
    }

    return "The server returned an HTML page instead of an API response.";
  }

  if (bodyText.trim()) {
    return bodyText.slice(0, 200);
  }

  return "Request failed.";
}

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

    if (file.size > DEPLOYED_UPLOAD_LIMIT_BYTES) {
      setError(
        "This PDF is too large for the deployed app upload limit. Please use a file under 4 MB.",
      );
      e.target.value = "";
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

      if (!res.ok) {
        setError(await readErrorMessage(res));
        return;
      }

      const json = (await res.json()) as {
        sessionId: string;
        filename: string;
        chunkCount: number;
      };

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
        throw new Error(await readErrorMessage(res));
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

      let json: unknown;

      try {
        json = JSON.parse(fullText);
      } catch {
        if (fullText.includes("<!DOCTYPE html") || fullText.includes("__next_error__")) {
          throw new Error(
            "The deployed app returned an HTML error page instead of API JSON.",
          );
        }

        throw new Error("The server returned an unreadable response.");
      }

      switch (mode) {
        case "summary":
          setSummary(json as Parameters<typeof setSummary>[0]);
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
          setExplanation(json as Parameters<typeof setExplanation>[0]);
          break;
        case "qa":
          addQA(json as Parameters<typeof addQA>[0]);
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
