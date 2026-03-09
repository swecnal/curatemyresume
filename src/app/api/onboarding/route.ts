import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;

    const body = await request.json();
    const {
      target_role,
      target_salary_min,
      target_salary_max,
      linkedin_url,
      years_experience_range,
      location_preferences,
      security_clearance,
      industry_preferences,
    } = body as {
      target_role?: string;
      target_salary_min?: number;
      target_salary_max?: number;
      linkedin_url?: string;
      years_experience_range?: string;
      location_preferences?: string[];
      security_clearance?: string;
      industry_preferences?: string[];
    };

    // Update user profile with onboarding data
    const { data: updatedUser, error: updateError } = await supabase
      .from("cmr_users")
      .update({
        target_role: target_role ?? null,
        target_roles: target_role ? [target_role] : [],
        target_salary_min: target_salary_min ?? null,
        target_salary_max: target_salary_max ?? null,
        linkedin_url: linkedin_url ?? null,
        years_experience_range: years_experience_range ?? null,
        location_preferences: location_preferences ?? [],
        security_clearance: security_clearance ?? null,
        industry_preferences: industry_preferences ?? null,
        onboarding_complete: true,
      })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating onboarding:", updateError);
      return NextResponse.json(
        { error: "Failed to save onboarding data" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
