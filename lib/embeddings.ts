import { getEmbeddingModel } from "./gemini";

export type ChunkEmbedding = {
  chunk: string;
  vector: number[];
};

export type StudySession = {
  id: string;
  filename: string;
  chunks: ChunkEmbedding[];
  createdAt: number;
};

const sessions = new Map<string, StudySession>();

export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function embedChunks(chunks: string[]): Promise<ChunkEmbedding[]> {
  const model = getEmbeddingModel();
  const result = await model.batchEmbedContents({
    requests: chunks.map((chunk) => ({
      content: { role: "user", parts: [{ text: chunk }] },
    })),
  });

  const embeddings = result.embeddings ?? [];
  return chunks.map((chunk, idx) => ({
    chunk,
    vector: embeddings[idx]?.values ?? [],
  }));
}

export function createSession(input: {
  id: string;
  filename: string;
  chunks: ChunkEmbedding[];
}): StudySession {
  const session: StudySession = {
    ...input,
    createdAt: Date.now(),
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): StudySession | undefined {
  return sessions.get(id);
}

export function getTopRelevantChunks(
  session: StudySession,
  queryEmbedding: number[],
  topK = 6,
): string[] {
  const scored = session.chunks.map((c) => ({
    chunk: c.chunk,
    score: cosineSimilarity(c.vector, queryEmbedding),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.chunk);
}

