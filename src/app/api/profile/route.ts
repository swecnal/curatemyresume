import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const FIELD_MAP: Record<string, string> = {
  firstName: 'first_name',
  lastName: 'last_name',
  phone: 'phone',
  addressLine1: 'address_line1',
  addressLine2: 'address_line2',
  city: 'city',
  state: 'state',
  zip: 'zip',
  country: 'country',
  targetRole: 'target_role',
  targetRoles: 'target_roles',
  salaryMin: 'target_salary_min',
  salaryMax: 'target_salary_max',
  currentSalaryBase: 'current_salary_base',
  currentSalaryBonus: 'current_salary_bonus',
  currentSalaryStock: 'current_salary_stock',
  linkedinUrl: 'linkedin_url',
  yearsExperience: 'years_experience',
  yearsExperienceRange: 'years_experience_range',
  locationPreference: 'location_preference',
  locationPreferences: 'location_preferences',
  industries: 'industry_preferences',
  securityClearance: 'security_clearance',
  strongSkills: 'strong_skills',
  developingSkills: 'developing_skills',
  currentRole: 'current_role',
  currentCompany: 'current_company',
  currentRoleDuration: 'current_role_duration',
  name: 'name',
};

const REVERSE_FIELD_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(FIELD_MAP).map(([camel, snake]) => [snake, camel])
);

export async function GET() {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;

    const { data: user, error } = await supabase
      .from("cmr_users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    // Transform snake_case keys to camelCase
    const transformed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(user)) {
      const camelKey = REVERSE_FIELD_MAP[key] ?? key;
      transformed[camelKey] = value;
    }
    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    for (const [camelKey, value] of Object.entries(body)) {
      const snakeKey = FIELD_MAP[camelKey];
      if (snakeKey && camelKey !== 'email') { // never update email
        updates[snakeKey] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("cmr_users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Transform snake_case keys to camelCase for the response
    const transformed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updatedUser)) {
      const camelKey = REVERSE_FIELD_MAP[key] ?? key;
      transformed[camelKey] = value;
    }
    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
