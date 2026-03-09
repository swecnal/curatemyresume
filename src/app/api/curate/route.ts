import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { analyzeJD } from "@/lib/claude";
import { checkRateLimit } from "@/lib/rate-limit";
import { canAccess } from "@/lib/tier-features";
import type { AnalysisOptions } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;
    const tier = session.user.tier;

    // Extract body
    const body = await request.json();
    const { jd_text, job_url, resume_text } = body as {
      jd_text: string;
      job_url?: string;
      resume_text?: string;
    };

    if (!jd_text || jd_text.trim().length === 0) {
      return NextResponse.json(
        { error: "Job description text is required" },
        { status: 400 }
      );
    }

    // Rate limit check
    const rateCheck = checkRateLimit(
      userId,
      tier,
      session.user.curations_this_month,
      session.user.current_period_start
    );

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Monthly curation limit reached",
          limit: rateCheck.limit,
          remaining: rateCheck.remaining,
        },
        { status: 429 }
      );
    }

    // Resolve resume text based on tier capabilities
    let resolvedResumeText: string;
    let resumeId: string | null = null;

    if (canAccess(tier, "resumeStorage")) {
      // Tiers with resume storage: fetch active resume from DB
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
      resumeId = resume.id;
    } else if (resume_text && resume_text.trim().length > 0) {
      // Ephemeral tiers: use the provided resume text directly
      resolvedResumeText = resume_text;
    } else {
      return NextResponse.json(
        { error: "Resume text is required for your plan" },
        { status: 400 }
      );
    }

    // Fetch user preferences for analysis context
    const { data: userProfile } = await supabase
      .from("cmr_users")
      .select(
        "target_role, target_roles, industry_preferences, years_experience, years_experience_range, target_salary_min, target_salary_max, location_preference, location_preferences, strong_skills, developing_skills, security_clearance"
      )
      .eq("id", userId)
      .single();

    // Build analysis options from tier features
    const analysisOptions: AnalysisOptions = {
      salaryResearch: canAccess(tier, "salaryResearch"),
      advancedSalary: canAccess(tier, "advancedSalary"),
      detailedGapAnalysis: canAccess(tier, "detailedGapAnalysis"),
    };

    // Call Claude to analyze JD against resume
    const analysis = await analyzeJD(
      resolvedResumeText,
      jd_text,
      {
        target_salary_min: userProfile?.target_salary_min ?? undefined,
        target_salary_max: userProfile?.target_salary_max ?? undefined,
        location_preference: userProfile?.location_preference ?? undefined,
        location_preferences: userProfile?.location_preferences ?? undefined,
        target_roles: userProfile?.target_roles ?? undefined,
        strong_skills: userProfile?.strong_skills ?? undefined,
        developing_skills: userProfile?.developing_skills ?? undefined,
        security_clearance: userProfile?.security_clearance ?? undefined,
      },
      analysisOptions
    );

    // Insert result into cmr_applications only if tier supports tracking
    let applicationId: string | null = null;

    if (canAccess(tier, "applicationTracking")) {
      const { data: application, error: insertError } = await supabase
        .from("cmr_applications")
        .insert({
          user_id: userId,
          resume_id: resumeId,
          jd_text,
          job_url: job_url ?? null,
          company_name: analysis.company_name,
          role_title: analysis.role_title,
          fit_score: analysis.fit_score,
          fit_summary: analysis.fit_summary,
          go_no_go: analysis.go_no_go,
          analysis_json: analysis,
          status: "curated",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting application:", insertError);
        return NextResponse.json(
          { error: "Failed to save analysis" },
          { status: 500 }
        );
      }

      applicationId = application.id;
    }

    // Increment curations_this_month
    const { error: updateError } = await supabase.rpc(
      "increment_curations",
      { p_user_id: userId }
    );

    // Fallback: if RPC doesn't exist, do a manual update
    if (updateError) {
      await supabase
        .from("cmr_users")
        .update({
          curations_this_month: session.user.curations_this_month + 1,
        })
        .eq("id", userId);
    }

    return NextResponse.json({
      application_id: applicationId,
      analysis,
    });
  } catch (error) {
    console.error("Curate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
