import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { canAccess } from "@/lib/tier-features";

export async function GET() {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tier gate
    if (!canAccess(session.user.tier, "applicationTracking")) {
      return NextResponse.json(
        { error: "Application tracking requires Job Hunting or Beast Mode" },
        { status: 403 }
      );
    }

    const userId = session.user.cmr_user_id;

    const { data: applications, error } = await supabase
      .from("cmr_applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 }
      );
    }

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Applications GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
