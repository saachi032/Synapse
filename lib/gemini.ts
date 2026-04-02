import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";

type Part = { text: string };
type Content = { role: string; parts: Part[] };

type StudyModel = {
  generateContent(input: { contents: Content[] }): Promise<{
    response: { text(): string };
  }>;
};

type EmbeddingModel = {
  embedContent(input: { content: Content }): Promise<{
    embedding: { values: number[] };
  }>;
  batchEmbedContents(input: {
    requests: Array<{ content: Content }>;
  }): Promise<{
    embeddings: Array<{ values: number[] }>;
  }>;
};

const rawGeminiKey = process.env.GEMINI_API_KEY;
const groqKey =
  process.env.GROQ_API_KEY ||
  (rawGeminiKey?.startsWith("gsk_") ? rawGeminiKey : undefined);
const geminiKey =
  rawGeminiKey && !rawGeminiKey.startsWith("gsk_") ? rawGeminiKey : undefined;

export const AI_PROVIDER = groqKey ? "groq" : geminiKey ? "gemini" : "none";
export const STUDY_MODEL_ID =
  AI_PROVIDER === "groq" ? "llama-3.3-70b-versatile" : "gemini-2.0-flash";
export const EMBEDDING_MODEL_ID =
  AI_PROVIDER === "groq" ? "local-hash-embeddings" : "text-embedding-004";

if (AI_PROVIDER === "none") {
  console.warn(
    "No supported AI key found. Set GROQ_API_KEY or GEMINI_API_KEY to enable study features.",
  );
}

const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

export type StudyMode =
  | "summary"
  | "flashcards"
  | "quiz"
  | "topics"
  | "explanation"
  | "qa"
  | "resources";

function extractText(contents: Content[]): string {
  return contents
    .flatMap((content) => content.parts.map((part) => part.text))
    .join("\n\n");
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function hashToken(token: string, dims: number): number {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
  }
  return hash % dims;
}

function makeLocalEmbedding(text: string, dims = 256): number[] {
  const vector = new Array<number>(dims).fill(0);
  const tokens = tokenize(text);
  for (const token of tokens) {
    vector[hashToken(token, dims)] += 1;
  }

  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!norm) {
    return vector;
  }

  return vector.map((value) => value / norm);
}

async function groqChatCompletion(prompt: string): Promise<string> {
  if (!groqKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: STUDY_MODEL_ID,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a study assistant. Always return valid JSON and no markdown.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      json?.error?.message ||
      `Groq request failed with status ${response.status}.`;
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const content = json?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Groq returned an empty response.");
  }

  return content;
}

export function getStudyModel(): StudyModel {
  if (AI_PROVIDER === "groq") {
    return {
      async generateContent(input) {
        const prompt = extractText(input.contents);
        const text = await groqChatCompletion(prompt);
        return {
          response: {
            text() {
              return text;
            },
          },
        };
      },
    };
  }

  if (!genAI) {
    throw new Error("No supported AI provider is configured.");
  }

  return genAI.getGenerativeModel({
    model: STUDY_MODEL_ID,
    generationConfig: {
      temperature: 0.6,
      responseMimeType: "application/json",
    },
  });
}

export function getEmbeddingModel(): EmbeddingModel {
  if (AI_PROVIDER === "groq") {
    return {
      async embedContent(input) {
        const text = extractText([input.content]);
        return { embedding: { values: makeLocalEmbedding(text) } };
      },
      async batchEmbedContents(input) {
        return {
          embeddings: input.requests.map((request) => ({
            values: makeLocalEmbedding(extractText([request.content])),
          })),
        };
      },
    };
  }

  if (!genAI) {
    throw new Error("No supported AI provider is configured.");
  }

  return genAI.getGenerativeModel({
    model: EMBEDDING_MODEL_ID,
  }) as EmbeddingModel;
}

export function normalizeGeminiError(error: unknown): {
  message: string;
  status: number;
} {
  if (AI_PROVIDER === "groq") {
    const maybeStatus =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status)
        : undefined;

    if (maybeStatus === 401) {
      return {
        status: 401,
        message: "Groq API key is invalid or unauthorized.",
      };
    }

    if (maybeStatus === 429) {
      return {
        status: 429,
        message: "Groq rate limit reached. Please wait a bit and try again.",
      };
    }

    if (error instanceof Error) {
      return {
        status: maybeStatus || 500,
        message:
          error.message.length < 220
            ? error.message
            : "Groq request failed. Please try again in a moment.",
      };
    }
  }

  if (error instanceof GoogleGenerativeAIFetchError) {
    if (error.status === 429) {
      return {
        status: 429,
        message:
          "Gemini API quota is exhausted for this key right now. Check AI Studio billing/quota, then try again.",
      };
    }

    return {
      status: error.status || 502,
      message:
        error.message.length < 220
          ? error.message
          : "Gemini request failed. Please try again in a moment.",
    };
  }

  if (error instanceof Error) {
    if (error.message.includes("API_KEY")) {
      return {
        status: 500,
        message:
          AI_PROVIDER === "groq"
            ? "GROQ_API_KEY is missing or unavailable on the server."
            : "GEMINI_API_KEY is missing or unavailable on the server.",
      };
    }

    return {
      status: 500,
      message:
        error.message.length < 220
          ? error.message
          : "Failed to generate AI response.",
    };
  }

  return {
    status: 500,
    message: "Failed to generate AI response.",
  };
}
