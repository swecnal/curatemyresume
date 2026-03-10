import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateCompanyReview } from "@/lib/claude";
import type { UserTier } from "@/lib/claude";
import { canAccess } from "@/lib/tier-features";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tier = session.user.tier;

    if (!canAccess(tier, "companyReviews")) {
      return NextResponse.json(
        { error: "Company Reviews requires PhD Mode subscription" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { company_name, role_title } = body as {
      company_name?: string;
      role_title?: string;
    };

    if (!company_name || !company_name.trim()) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    if (!role_title || !role_title.trim()) {
      return NextResponse.json(
        { error: "Role title is required" },
        { status: 400 }
      );
    }

    const review = await generateCompanyReview(
      company_name.trim(),
      role_title.trim(),
      tier as UserTier
    );

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Company review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
