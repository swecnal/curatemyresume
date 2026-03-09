import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { forgeResume } from "@/lib/claude";
import { canAccess } from "@/lib/tier-features";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tier gate
    if (!canAccess(session.user.tier, "resumeForge")) {
      return NextResponse.json(
        { error: "ResumeRx requires Job Hunting or PhD Mode subscription" },
        { status: 403 }
      );
    }

    const userId = session.user.cmr_user_id;

    // Accept optional resume_id in body, otherwise use active resume
    let resumeId: string | undefined;
    try {
      const body = await request.json();
      resumeId = body.resume_id;
    } catch {
      // No body provided — that's fine, we'll use the active resume
    }

    // Fetch the specified resume or the active one
    let query = supabase
      .from("cmr_resumes")
      .select("id, raw_text, parsed_profile")
      .eq("user_id", userId);

    if (resumeId) {
      query = query.eq("id", resumeId);
    } else {
      query = query.eq("is_active", true);
    }

    const { data: resume, error: resumeError } = await query.maybeSingle();

    if (resumeError) {
      console.error("Error fetching resume:", resumeError);
      return NextResponse.json(
        { error: "Failed to fetch resume" },
        { status: 500 }
      );
    }

    if (!resume) {
      return NextResponse.json(
        { error: "No resume found. Upload a resume first." },
        { status: 400 }
      );
    }

    // Call Claude to forge the resume into ATS-optimized format
    const forged = await forgeResume(resume.raw_text, resume.parsed_profile);

    // Save the forged resume as a new cmr_resumes entry (not active)
    const { data: forgedResume, error: insertError } = await supabase
      .from("cmr_resumes")
      .insert({
        user_id: userId,
        raw_text: forged.formatted_text,
        parsed_profile: resume.parsed_profile,
        file_name: "forged-resume.txt",
        file_type: "text/plain",
        is_active: false,
        source_resume_id: resume.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving forged resume:", insertError);
      return NextResponse.json(
        { error: "Failed to save forged resume" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: forgedResume.id,
      formatted_text: forged.formatted_text,
      source_resume_id: resume.id,
    });
  } catch (error) {
    console.error("Resume forge error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
