import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { extractPdfText, cleanPdfText, chunkText } from "@/lib/pdf";
import { createSession } from "@/lib/embeddings";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
    }

    const nameOk = file.name.toLowerCase().endsWith(".pdf");
    const mimeOk =
      file.type === "application/pdf" ||
      file.type === "application/x-pdf" ||
      file.type === "binary/octet-stream";
    if (!mimeOk && !nameOk) {
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
    if (!chunks.length) {
      return NextResponse.json(
        { error: "We couldn't extract enough readable text from that PDF." },
        { status: 400 },
      );
    }

    const sessionId = randomUUID();
    const session = createSession({
      id: sessionId,
      filename: file.name,
      chunks,
    });

    return NextResponse.json({
      sessionId: session.id,
      filename: session.filename,
      chunkCount: session.chunks.length,
    });
  } catch (error) {
    console.error("Upload error", error);
    const msg =
      error instanceof Error ? error.message : String(error);
    if (msg.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        {
          error:
            "Server is missing GEMINI_API_KEY. Add it to .env.local and restart the dev server.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        error:
          msg.length && msg.length < 200
            ? msg
            : "Failed to process PDF. Please try another file.",
      },
      { status: 500 },
    );
  }
}
