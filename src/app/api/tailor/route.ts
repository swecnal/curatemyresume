import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { tailorResume } from "@/lib/claude";
import { canAccess } from "@/lib/tier-features";
import type { JDAnalysis, CompanyType } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;
    const tier = session.user.tier;

    // Tier check: basicTailoring is required
    if (!canAccess(tier, "basicTailoring")) {
      return NextResponse.json(
        { error: "Resume tailoring is not available for your plan" },
        { status: 403 }
      );
    }

    // Extract body
    const body = await request.json();
    const { application_id, company_type, resume_text, jd_text } = body as {
      application_id?: string;
      company_type?: string;
      resume_text?: string;
      jd_text?: string;
    };

    let resolvedResumeText: string;
    let resolvedJdText: string;
    let fitAnalysis: JDAnalysis;
    let resumeId: string | null = null;
    let applicationIdForSave: string | null = null;

    if (application_id) {
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

      resolvedResumeText = resume.raw_text;
      resolvedJdText = application.jd_text;
      fitAnalysis = application.analysis_json;
      resumeId = resume.id;
      applicationIdForSave = application.id;
    } else if (resume_text && resume_text.trim().length > 0 && jd_text && jd_text.trim().length > 0) {
      // Ephemeral mode: use provided texts directly
      resolvedResumeText = resume_text;
      resolvedJdText = jd_text;
      // Minimal fit analysis for the prompt — no DB application
      fitAnalysis = {} as JDAnalysis;
    } else {
      return NextResponse.json(
        { error: "Either application_id or both resume_text and jd_text are required" },
        { status: 400 }
      );
    }

    // Fetch user's skill tiers for tailoring context
    const { data: userProfile } = await supabase
      .from("cmr_users")
      .select("strong_skills, developing_skills")
      .eq("id", userId)
      .single();

    // Only pass company_type if tier supports company tone matching
    const resolvedCompanyType = canAccess(tier, "companyToneMatching") && company_type
      ? company_type as CompanyType
      : undefined;

    // Call Claude to tailor the resume
    const tailored = await tailorResume(
      resolvedResumeText,
      resolvedJdText,
      fitAnalysis,
      {
        strong_skills: userProfile?.strong_skills ?? undefined,
        developing_skills: userProfile?.developing_skills ?? undefined,
      },
      resolvedCompanyType
    );

    // Insert into cmr_tailored_resumes only if we have an application context
    if (applicationIdForSave && resumeId) {
      const { data: tailoredRecord, error: insertError } = await supabase
        .from("cmr_tailored_resumes")
        .insert({
          user_id: userId,
          application_id: applicationIdForSave,
          resume_id: resumeId,
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
    }

    // Ephemeral mode: return tailored text without saving
    return NextResponse.json({
      id: null,
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
