import * as pdfParse from "pdf-parse";

export async function extractPdfText(fileBuffer: Buffer): Promise<string> {
  // pdf-parse's module shape varies between CJS/ESM builds; cast to call safely.
  const data = await (pdfParse as unknown as (buf: Buffer) => Promise<{ text: string }>)(
    fileBuffer,
  );
  return data.text;
}

export function cleanPdfText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function chunkText(text: string, maxChars = 2000): string[] {
  const chunks: string[] = [];
  let current = "";

  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const sentence of sentences) {
    if ((current + " " + sentence).length > maxChars) {
      if (current) {
        chunks.push(current.trim());
      }
      if (sentence.length > maxChars) {
        for (let i = 0; i < sentence.length; i += maxChars) {
          chunks.push(sentence.slice(i, i + maxChars));
        }
        current = "";
      } else {
        current = sentence;
      }
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }

  if (current) {
    chunks.push(current.trim());
  }

  return chunks;
}

