import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function extractResumeText(
  file: Buffer,
  mimeType: string
): Promise<string> {
  const normalizedMime = mimeType.toLowerCase().trim();

  if (
    normalizedMime === "application/pdf" ||
    normalizedMime === "pdf"
  ) {
    return extractFromPdf(file);
  }

  if (
    normalizedMime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    normalizedMime === "application/docx" ||
    normalizedMime === "docx"
  ) {
    return extractFromDocx(file);
  }

  if (
    normalizedMime === "text/plain" ||
    normalizedMime === "text" ||
    normalizedMime === "txt"
  ) {
    return file.toString("utf-8");
  }

  throw new Error(
    `Unsupported file type: ${mimeType}. Accepted formats: PDF, DOCX, or plain text.`
  );
}

async function extractFromPdf(buffer: Buffer): Promise<string> {
  let pdf: PDFParse | null = null;
  try {
    pdf = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await pdf.getText();
    const text = result.text?.trim();
    if (!text) {
      throw new Error("PDF parsed successfully but contained no extractable text.");
    }
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
    throw new Error("Failed to parse PDF: unknown error");
  } finally {
    if (pdf) {
      await pdf.destroy();
    }
  }
}

async function extractFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value?.trim();
    if (!text) {
      throw new Error("DOCX parsed successfully but contained no extractable text.");
    }
    if (result.messages.length > 0) {
      console.warn(
        "DOCX parsing warnings:",
        result.messages.map((m) => m.message).join("; ")
      );
    }
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse DOCX: ${error.message}`);
    }
    throw new Error("Failed to parse DOCX: unknown error");
  }
}
