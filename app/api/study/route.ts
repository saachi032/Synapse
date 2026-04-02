import { NextRequest } from "next/server";
import {
  getStudyModel,
  getEmbeddingModel,
  normalizeGeminiError,
  StudyMode,
} from "@/lib/gemini";
import {
  ensureSessionEmbeddings,
  getSession,
  getTopRelevantChunks,
} from "@/lib/embeddings";

export const runtime = "nodejs";

type StudyRequest = {
  sessionId: string;
  mode: StudyMode;
  summaryLevel?: "short" | "medium" | "detailed";
  explanationMode?: "simple" | "exam" | "technical";
  question?: string;
};

function buildSystemPrompt(body: StudyRequest, context: string): string {
  switch (body.mode) {
    case "summary":
      return `
You are an AI study assistant. Summarize the provided content at the requested level.
Return STRICT JSON only, no markdown or extra text.
summaryLevel: one of "short" | "medium" | "detailed".

Return:
{
  "title": "string",
  "bullets": ["...", "..."],
  "paragraph": "..."
}

Content:
${context}
`;
    case "flashcards":
      return `
You are an AI creating high-quality flashcards from study material.
Return STRICT JSON array only, like:
[
  { "question": "...", "answer": "..." }
]
Questions should be clear, concise, and test understanding of key concepts.

Content:
${context}
`;
    case "quiz":
      return `
You are an AI generating multiple-choice exam questions from study material.
Return STRICT JSON array only, like:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": "A",
    "explanation": "short reasoning"
  }
]
Make questions fair but challenging and avoid trick questions.

Content:
${context}
`;
    case "topics":
      return `
Extract a hierarchical topic breakdown from the content.
Return STRICT JSON array only, like:
[
  {
    "topic": "...",
    "subtopics": ["...", "..."]
  }
]

Content:
${context}
`;
    case "explanation":
      return `
Explain the core ideas from the content in different depths.
Mode will be one of: "simple" (Explain like I'm 5), "exam" (exam-ready), "technical" (deep dive).
Return STRICT JSON object only:
{
  "mode": "simple" | "exam" | "technical",
  "explanation": "..."
}

Content:
${context}
`;
    case "qa":
      return `
You are a contextual Q&A assistant. Answer the user's question ONLY using the provided context.
If the answer is not clearly in the context, say you cannot answer from the PDF.
Return STRICT JSON only:
{
  "question": "...",
  "answer": "...",
  "confidence": 0-1 number
}

Context:
${context}
`;
    case "resources":
      return `
Suggest external learning resources (YouTube videos and articles) for further study based on the content.
Return STRICT JSON array only:
[
  {
    "title": "...",
    "type": "video" | "article",
    "url": "https://...",
    "reason": "why this helps"
  }
]

Content:
${context}
`;
    default:
      return context;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as StudyRequest;

    if (!body.sessionId || !body.mode) {
      return new Response(
        JSON.stringify({ error: "sessionId and mode are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = getSession(body.sessionId);
    if (!session) {
      return new Response(JSON.stringify({ error: "Session not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    let contextChunks: string[];
    if (body.mode === "qa" && body.question) {
      await ensureSessionEmbeddings(session);
      const embeddingModel = getEmbeddingModel();
      const embeddingResult = await embeddingModel.embedContent({
        content: { role: "user", parts: [{ text: body.question }] },
      });
      const queryEmbedding = embeddingResult.embedding?.values ?? [];
      contextChunks = getTopRelevantChunks(session, queryEmbedding, 8);
    } else {
      contextChunks = session.chunks.slice(0, 12).map((c) => c.chunk);
    }

    const context = contextChunks.join("\n\n---\n\n");
    const prompt = buildSystemPrompt(body, context);

    const model = getStudyModel();
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text = result.response.text();

    return new Response(text, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Study error", error);
    const normalized = normalizeGeminiError(error);
    return new Response(
      JSON.stringify({ error: normalized.message }),
      {
        status: normalized.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
