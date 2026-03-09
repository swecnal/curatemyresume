import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, TIER_CONFIG } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;
    const userEmail = session.user.email;

    const body = await request.json();
    const { tier } = body as { tier: string };

    if (!tier || !TIER_CONFIG[tier]) {
      return NextResponse.json(
        { error: "Invalid tier specified" },
        { status: 400 }
      );
    }

    const tierConfig = TIER_CONFIG[tier];

    if (!tierConfig.priceId) {
      return NextResponse.json(
        { error: "Cannot checkout for the free tier" },
        { status: 400 }
      );
    }

    // Determine base URL for redirects
    const origin =
      request.headers.get("origin") ??
      process.env.NEXTAUTH_URL ??
      "http://localhost:3000";

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price: tierConfig.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        cmr_user_id: userId,
        tier,
      },
      success_url: `${origin}/dashboard?checkout=success&tier=${tier}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
