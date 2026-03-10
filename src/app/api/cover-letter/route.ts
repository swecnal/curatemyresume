import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { canAccess } from "@/lib/tier-features";
import { curateCoverLetter } from "@/lib/claude";
import type { CoverLetterTone, UserTier } from "@/lib/claude";

const VALID_TONES: CoverLetterTone[] = [
  "professional",
  "conversational",
  "enthusiastic",
  "formal",
];

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;

    // Beast tier check
    if (!canAccess(session.user.tier, "coverLetter")) {
      return NextResponse.json(
        { error: "Cover letter creation requires PhD Mode" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { cover_letter_text, application_id, tone } = body as {
      cover_letter_text?: string;
      application_id?: string;
      tone?: string;
    };

    if (!cover_letter_text || cover_letter_text.trim().length === 0) {
      return NextResponse.json(
        { error: "Cover letter text is required" },
        { status: 400 }
      );
    }

    if (!application_id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Fetch application (verify ownership)
    const { data: application, error: appError } = await supabase
      .from("cmr_applications")
      .select("id, jd_text, analysis_json")
      .eq("id", application_id)
      .eq("user_id", userId)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Fetch user's active resume
    const { data: resume, error: resumeError } = await supabase
      .from("cmr_resumes")
      .select("raw_text")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (resumeError) {
      console.error("Error fetching resume:", resumeError);
      return NextResponse.json(
        { error: "Failed to fetch resume" },
        { status: 500 }
      );
    }

    if (!resume) {
      return NextResponse.json(
        { error: "No resume on file" },
        { status: 400 }
      );
    }

    // Validate tone
    const validTone: CoverLetterTone = VALID_TONES.includes(tone as CoverLetterTone)
      ? (tone as CoverLetterTone)
      : "professional";

    // Call Claude to curate the cover letter
    const result = await curateCoverLetter(
      cover_letter_text,
      application.jd_text,
      resume.raw_text,
      application.analysis_json,
      validTone,
      session.user.tier as UserTier
    );

    // Save to cmr_cover_letters
    const { data: coverLetter, error: insertError } = await supabase
      .from("cmr_cover_letters")
      .insert({
        user_id: userId,
        application_id: application.id,
        original_text: cover_letter_text,
        curated_text: result.curated_text,
        tone: validTone,
        changes_summary: result.changes_summary,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving cover letter:", insertError);
      return NextResponse.json(
        { error: "Failed to save cover letter" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: coverLetter.id,
      curated_text: result.curated_text,
      changes_summary: result.changes_summary,
    });
  } catch (error) {
    console.error("Cover letter error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
