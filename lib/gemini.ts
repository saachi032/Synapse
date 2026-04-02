import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  // We still allow import; individual callers should handle missing key.
  console.warn("GEMINI_API_KEY is not set. AI routes will fail until it is configured.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ""); // key checked at call time

export const STUDY_MODEL_ID = "gemini-2.0-flash";
export const EMBEDDING_MODEL_ID = "text-embedding-004";

export function getStudyModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return genAI.getGenerativeModel({
    model: STUDY_MODEL_ID,
    generationConfig: {
      temperature: 0.6,
      responseMimeType: "application/json",
    },
  });
}

export function getEmbeddingModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return genAI.getGenerativeModel({
    model: EMBEDDING_MODEL_ID,
  });
}

export type StudyMode =
  | "summary"
  | "flashcards"
  | "quiz"
  | "topics"
  | "explanation"
  | "qa"
  | "resources";

export class GeminiStudyError extends Error {
  constructor(
    message: string,
    public readonly cause?: GoogleGenerativeAIError | Error,
  ) {
    super(message);
    this.name = "GeminiStudyError";
  }
}

