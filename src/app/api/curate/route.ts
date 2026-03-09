import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { analyzeJD } from "@/lib/claude";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;

    // Extract body
    const body = await request.json();
    const { jd_text, job_url } = body as {
      jd_text: string;
      job_url?: string;
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
      session.user.tier,
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

    // Fetch user preferences for analysis context
    const { data: userProfile } = await supabase
      .from("cmr_users")
      .select(
        "target_role, industry_preferences, years_experience, target_salary_min, target_salary_max, location_preference"
      )
      .eq("id", userId)
      .single();

    // Call Claude to analyze JD against resume
    const analysis = await analyzeJD(resume.raw_text, jd_text, {
      target_salary_min: userProfile?.target_salary_min ?? undefined,
      target_salary_max: userProfile?.target_salary_max ?? undefined,
      location_preference: userProfile?.location_preference ?? undefined,
    });

    // Insert result into cmr_applications
    const { data: application, error: insertError } = await supabase
      .from("cmr_applications")
      .insert({
        user_id: userId,
        resume_id: resume.id,
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
      application_id: application.id,
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
