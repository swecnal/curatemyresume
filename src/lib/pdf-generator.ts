import PDFDocument from "pdfkit";

interface ResumeOptions {
  title?: string;
}

interface CurationAnalysis {
  company: string;
  role: string;
  fitScore: number;
  goNoGo: string;
  fitSummary: string;
  keyMatches: string[];
  gaps: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryNotes?: string;
  marketSalaryMin?: number;
  marketSalaryMax?: number;
  marketSalaryNotes?: string;
}

interface CoverLetterMetadata {
  company: string;
  role: string;
}

function docToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

function isSectionHeader(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length === 0 || trimmed.length >= 60) return false;
  return trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
}

export async function generateResumePDF(
  resumeText: string,
  options?: ResumeOptions
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 50, bottom: 60, left: 50, right: 60 },
  });

  const lines = resumeText.split("\n");
  let isFirstLine = true;

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line = paragraph spacing
    if (trimmed.length === 0) {
      doc.moveDown(0.5);
      continue;
    }

    // First line = name/header
    if (isFirstLine) {
      doc.font("Helvetica-Bold").fontSize(16).text(trimmed, { align: "center" });
      doc.moveDown(0.5);
      isFirstLine = false;
      continue;
    }

    // Section headers: ALL CAPS, short
    if (isSectionHeader(trimmed)) {
      doc.moveDown(0.6);
      doc.font("Helvetica-Bold").fontSize(13).text(trimmed);
      doc.moveDown(0.2);
      continue;
    }

    // Bullet points
    if (trimmed.startsWith("\u2022") || trimmed.startsWith("-")) {
      const bulletText = trimmed.replace(/^[\u2022\-]\s*/, "");
      doc
        .font("Times-Roman")
        .fontSize(10.5)
        .text(`\u2022  ${bulletText}`, doc.page.margins.left + 15, undefined, {
          width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 15,
        });
      continue;
    }

    // Body text
    doc.font("Times-Roman").fontSize(10.5).text(trimmed);
  }

  return docToBuffer(doc);
}

export async function generateCurationPDF(
  analysis: CurationAnalysis
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 50, bottom: 60, left: 50, right: 60 },
  });

  // Title
  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .text(`Curation Report: ${analysis.role} at ${analysis.company}`, {
      align: "center",
    });
  doc.moveDown(1);

  // Fit Score + Go/No-Go
  doc.font("Helvetica-Bold").fontSize(13).text("Fit Score");
  doc.moveDown(0.3);
  doc
    .font("Times-Roman")
    .fontSize(11)
    .text(`Score: ${analysis.fitScore}/100`);
  doc
    .font("Times-Roman")
    .fontSize(11)
    .text(`Recommendation: ${analysis.goNoGo}`);
  doc.moveDown(0.8);

  // Fit Summary
  doc.font("Helvetica-Bold").fontSize(13).text("Fit Summary");
  doc.moveDown(0.3);
  doc.font("Times-Roman").fontSize(10.5).text(analysis.fitSummary);
  doc.moveDown(0.8);

  // Key Matches
  if (analysis.keyMatches.length > 0) {
    doc.font("Helvetica-Bold").fontSize(13).text("Key Matches");
    doc.moveDown(0.3);
    for (const match of analysis.keyMatches) {
      doc
        .font("Times-Roman")
        .fontSize(10.5)
        .text(`\u2022  ${match}`, doc.page.margins.left + 15, undefined, {
          width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 15,
        });
    }
    doc.moveDown(0.8);
  }

  // Gaps
  if (analysis.gaps.length > 0) {
    doc.font("Helvetica-Bold").fontSize(13).text("Gaps");
    doc.moveDown(0.3);
    for (const gap of analysis.gaps) {
      doc
        .font("Times-Roman")
        .fontSize(10.5)
        .text(`\u2022  ${gap}`, doc.page.margins.left + 15, undefined, {
          width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 15,
        });
    }
    doc.moveDown(0.8);
  }

  // Salary section (only if data exists)
  if (analysis.salaryMin != null || analysis.salaryMax != null) {
    doc.font("Helvetica-Bold").fontSize(13).text("Salary");
    doc.moveDown(0.3);
    if (analysis.salaryMin != null && analysis.salaryMax != null) {
      doc
        .font("Times-Roman")
        .fontSize(10.5)
        .text(
          `Range: $${analysis.salaryMin.toLocaleString()} - $${analysis.salaryMax.toLocaleString()}`
        );
    } else if (analysis.salaryMin != null) {
      doc
        .font("Times-Roman")
        .fontSize(10.5)
        .text(`Minimum: $${analysis.salaryMin.toLocaleString()}`);
    } else if (analysis.salaryMax != null) {
      doc
        .font("Times-Roman")
        .fontSize(10.5)
        .text(`Maximum: $${analysis.salaryMax.toLocaleString()}`);
    }
    if (analysis.salaryNotes) {
      doc.font("Times-Roman").fontSize(10.5).text(analysis.salaryNotes);
    }
    doc.moveDown(0.8);
  }

  // Market Salary section (only if data exists)
  if (analysis.marketSalaryMin != null || analysis.marketSalaryMax != null) {
    doc.font("Helvetica-Bold").fontSize(13).text("Market Salary");
    doc.moveDown(0.3);
    if (analysis.marketSalaryMin != null && analysis.marketSalaryMax != null) {
      doc
        .font("Times-Roman")
        .fontSize(10.5)
        .text(
          `Range: $${analysis.marketSalaryMin.toLocaleString()} - $${analysis.marketSalaryMax.toLocaleString()}`
        );
    } else if (analysis.marketSalaryMin != null) {
      doc
        .font("Times-Roman")
        .fontSize(10.5)
        .text(`Minimum: $${analysis.marketSalaryMin.toLocaleString()}`);
    } else if (analysis.marketSalaryMax != null) {
      doc
        .font("Times-Roman")
        .fontSize(10.5)
        .text(`Maximum: $${analysis.marketSalaryMax.toLocaleString()}`);
    }
    if (analysis.marketSalaryNotes) {
      doc.font("Times-Roman").fontSize(10.5).text(analysis.marketSalaryNotes);
    }
    doc.moveDown(0.8);
  }

  return docToBuffer(doc);
}

export async function generateCoverLetterPDF(
  text: string,
  metadata: CoverLetterMetadata
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 50, bottom: 60, left: 50, right: 60 },
  });

  // Header with company/role info
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`${metadata.role} at ${metadata.company}`, { align: "center" });
  doc.moveDown(0.3);
  doc
    .font("Times-Roman")
    .fontSize(10)
    .text("Cover Letter", { align: "center" });
  doc.moveDown(1.5);

  // Body text with paragraph spacing
  const paragraphs = text.split(/\n\s*\n/);
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].replace(/\n/g, " ").trim();
    if (paragraph.length === 0) continue;
    doc.font("Times-Roman").fontSize(10.5).text(paragraph, {
      lineGap: 2,
    });
    if (i < paragraphs.length - 1) {
      doc.moveDown(0.7);
    }
  }

  return docToBuffer(doc);
}
