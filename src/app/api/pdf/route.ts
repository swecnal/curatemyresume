import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  generateResumePDF,
  generateCurationPDF,
  generateCoverLetterPDF,
} from "@/lib/pdf-generator";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, content, metadata } = body as {
      type: string;
      content: string;
      metadata?: {
        company?: string;
        role?: string;
        fitScore?: number;
        goNoGo?: string;
        fitSummary?: string;
        keyMatches?: string[];
        gaps?: string[];
        salaryMin?: number;
        salaryMax?: number;
        salaryNotes?: string;
        marketSalaryMin?: number;
        marketSalaryMax?: number;
        marketSalaryNotes?: string;
      };
    };

    if (!type || !["resume", "curation", "cover_letter"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid or missing type. Must be 'resume', 'curation', or 'cover_letter'" },
        { status: 400 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    let pdfBuffer: Buffer;
    let filename: string;

    switch (type) {
      case "resume": {
        pdfBuffer = await generateResumePDF(content);
        filename = "resume.pdf";
        break;
      }

      case "curation": {
        if (
          !metadata?.company ||
          !metadata?.role ||
          metadata?.fitScore == null ||
          !metadata?.goNoGo ||
          !metadata?.fitSummary ||
          !metadata?.keyMatches ||
          !metadata?.gaps
        ) {
          return NextResponse.json(
            {
              error:
                "Curation requires metadata with company, role, fitScore, goNoGo, fitSummary, keyMatches, and gaps",
            },
            { status: 400 }
          );
        }

        pdfBuffer = await generateCurationPDF({
          company: metadata.company,
          role: metadata.role,
          fitScore: metadata.fitScore,
          goNoGo: metadata.goNoGo,
          fitSummary: metadata.fitSummary,
          keyMatches: metadata.keyMatches,
          gaps: metadata.gaps,
          salaryMin: metadata.salaryMin,
          salaryMax: metadata.salaryMax,
          salaryNotes: metadata.salaryNotes,
          marketSalaryMin: metadata.marketSalaryMin,
          marketSalaryMax: metadata.marketSalaryMax,
          marketSalaryNotes: metadata.marketSalaryNotes,
        });
        filename = "curation-report.pdf";
        break;
      }

      case "cover_letter": {
        if (!metadata?.company || !metadata?.role) {
          return NextResponse.json(
            { error: "Cover letter requires metadata with company and role" },
            { status: 400 }
          );
        }

        pdfBuffer = await generateCoverLetterPDF(content, {
          company: metadata.company,
          role: metadata.role,
        });
        filename = "cover-letter.pdf";
        break;
      }

      default: {
        return NextResponse.json(
          { error: "Invalid type" },
          { status: 400 }
        );
      }
    }

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
