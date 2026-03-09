import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;

    // Fetch user stats from cmr_user_stats view
    const { data: stats, error: statsError } = await supabase
      .from("cmr_user_stats")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (statsError) {
      console.error("Error fetching user stats:", statsError);
      // Don't fail entirely — stats view might not exist yet
    }

    // Fetch last 5 applications
    const { data: recentApplications, error: appsError } = await supabase
      .from("cmr_applications")
      .select("id, company_name, role_title, fit_score, go_no_go, status, applied, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (appsError) {
      console.error("Error fetching recent applications:", appsError);
    }

    return NextResponse.json({
      stats: stats ?? {
        user_id: userId,
        total_curations: 0,
        curations_this_month: session.user.curations_this_month,
        tier: session.user.tier,
        total_applications: 0,
        applied_count: 0,
        avg_fit_score: null,
      },
      recent_applications: recentApplications ?? [],
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
