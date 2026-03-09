import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { analyzeJD } from "@/lib/claude";
import { checkRateLimit } from "@/lib/rate-limit";
import { canAccess } from "@/lib/tier-features";
import type { AnalysisOptions } from "@/lib/claude";

interface BulkJDItem {
  jd_text: string;
  job_url?: string;
}

interface BulkResultItem {
  jd_index: number;
  application_id?: string;
  analysis?: Record<string, unknown>;
  error?: string;
}

const MAX_BULK_ITEMS = 5;

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;
    const tier = session.user.tier;

    // Tier gate: bulkCuration required
    if (!canAccess(tier, "bulkCuration")) {
      return NextResponse.json(
        { error: "Bulk curation requires PhD Mode subscription" },
        { status: 403 }
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

    // Parse and validate body
    const body = await request.json();
    const { jds } = body as { jds?: BulkJDItem[] };

    if (!Array.isArray(jds) || jds.length === 0) {
      return NextResponse.json(
        { error: "jds array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (jds.length > MAX_BULK_ITEMS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_BULK_ITEMS} job descriptions per bulk request` },
        { status: 400 }
      );
    }

    // Validate each item has non-empty jd_text
    for (let i = 0; i < jds.length; i++) {
      if (!jds[i].jd_text || jds[i].jd_text.trim().length === 0) {
        return NextResponse.json(
          { error: `jds[${i}].jd_text is required and must not be empty` },
          { status: 400 }
        );
      }
    }

    // Fetch user's active resume (Beast always has storage)
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
        { error: "No resume on file. Upload a resume first." },
        { status: 400 }
      );
    }

    // Fetch user preferences
    const { data: userProfile } = await supabase
      .from("cmr_users")
      .select(
        "target_role, target_roles, industry_preferences, years_experience, years_experience_range, target_salary_min, target_salary_max, location_preference, location_preferences, strong_skills, developing_skills, security_clearance"
      )
      .eq("id", userId)
      .single();

    // Beast tier gets all analysis features
    const analysisOptions: AnalysisOptions = {
      salaryResearch: true,
      advancedSalary: true,
      detailedGapAnalysis: true,
    };

    const userPrefs = {
      target_salary_min: userProfile?.target_salary_min ?? undefined,
      target_salary_max: userProfile?.target_salary_max ?? undefined,
      location_preference: userProfile?.location_preference ?? undefined,
      location_preferences: userProfile?.location_preferences ?? undefined,
      target_roles: userProfile?.target_roles ?? undefined,
      strong_skills: userProfile?.strong_skills ?? undefined,
      developing_skills: userProfile?.developing_skills ?? undefined,
      security_clearance: userProfile?.security_clearance ?? undefined,
    };

    // Process all JDs in parallel
    const settledResults = await Promise.allSettled(
      jds.map(async (jd, index): Promise<BulkResultItem> => {
        const analysis = await analyzeJD(
          resume.raw_text,
          jd.jd_text,
          userPrefs,
          analysisOptions
        );

        // Insert into cmr_applications
        const { data: application, error: insertError } = await supabase
          .from("cmr_applications")
          .insert({
            user_id: userId,
            resume_id: resume.id,
            jd_text: jd.jd_text,
            job_url: jd.job_url ?? null,
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
          console.error(`Error inserting application for jd[${index}]:`, insertError);
          return {
            jd_index: index,
            analysis: analysis as unknown as Record<string, unknown>,
            error: "Analysis succeeded but failed to save application",
          };
        }

        return {
          jd_index: index,
          application_id: application.id,
          analysis: analysis as unknown as Record<string, unknown>,
        };
      })
    );

    // Build results array
    const results: BulkResultItem[] = settledResults.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      return {
        jd_index: index,
        error: result.reason instanceof Error
          ? result.reason.message
          : "Analysis failed",
      };
    });

    // Count successful analyses for curation counter
    const successCount = results.filter(
      (r) => r.analysis && !r.error
    ).length;

    // Increment curations counter by number of successful analyses
    if (successCount > 0) {
      const { error: updateError } = await supabase.rpc(
        "increment_curations_by",
        { p_user_id: userId, p_count: successCount }
      );

      // Fallback: manual update if bulk RPC doesn't exist
      if (updateError) {
        await supabase
          .from("cmr_users")
          .update({
            curations_this_month:
              session.user.curations_this_month + successCount,
          })
          .eq("id", userId);
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Bulk curate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
