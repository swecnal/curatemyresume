import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { tailorResume } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;

    // Beast mode tier check
    if (session.user.tier !== "beast") {
      return NextResponse.json(
        { error: "Resume tailoring requires Beast Mode subscription" },
        { status: 403 }
      );
    }

    // Extract application_id from body
    const body = await request.json();
    const { application_id } = body as { application_id: string };

    if (!application_id) {
      return NextResponse.json(
        { error: "application_id is required" },
        { status: 400 }
      );
    }

    // Fetch the application (verify ownership)
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
      .select("id, raw_text, parsed_profile")
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

    // Fetch user's skill tiers for tailoring context
    const { data: userProfile } = await supabase
      .from("cmr_users")
      .select("strong_skills, developing_skills")
      .eq("id", userId)
      .single();

    // Call Claude to tailor the resume for this specific JD
    const tailored = await tailorResume(
      resume.raw_text,
      application.jd_text,
      application.analysis_json,
      {
        strong_skills: userProfile?.strong_skills ?? undefined,
        developing_skills: userProfile?.developing_skills ?? undefined,
      }
    );

    // Insert into cmr_tailored_resumes
    const { data: tailoredRecord, error: insertError } = await supabase
      .from("cmr_tailored_resumes")
      .insert({
        user_id: userId,
        application_id: application.id,
        resume_id: resume.id,
        tailored_text: tailored.tailored_text,
        changes_summary: tailored.changes_summary,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting tailored resume:", insertError);
      return NextResponse.json(
        { error: "Failed to save tailored resume" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: tailoredRecord.id,
      tailored_text: tailored.tailored_text,
      changes_summary: tailored.changes_summary,
    });
  } catch (error) {
    console.error("Tailor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
