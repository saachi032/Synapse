import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { extractPdfText, cleanPdfText, chunkText } from "@/lib/pdf";
import { embedChunks, createSession } from "@/lib/embeddings";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const rawText = await extractPdfText(buffer);
    if (!rawText.trim()) {
      return NextResponse.json({ error: "The PDF appears to be empty or unreadable." }, { status: 400 });
    }

    const cleaned = cleanPdfText(rawText);
    const chunks = chunkText(cleaned);

    const embeddings = await embedChunks(chunks);

    const sessionId = randomUUID();
    const session = createSession({
      id: sessionId,
      filename: file.name,
      chunks: embeddings,
    });

    return NextResponse.json({
      sessionId: session.id,
      filename: session.filename,
      chunkCount: session.chunks.length,
    });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json(
      { error: "Failed to process PDF. Please try another file." },
      { status: 500 },
    );
  }
}

