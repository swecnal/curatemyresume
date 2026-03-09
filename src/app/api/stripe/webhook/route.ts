import { NextResponse } from "next/server";
import { stripe, getTierFromPriceId } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET ?? "whsec_placeholder";

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown verification error";
      console.error("Webhook signature verification failed:", message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${message}` },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const cmrUserId = session.metadata?.cmr_user_id;
        const tier = session.metadata?.tier;

        if (cmrUserId && tier) {
          const { error } = await supabase
            .from("cmr_users")
            .update({
              tier,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              curations_this_month: 0,
              current_period_start: new Date().toISOString(),
            })
            .eq("id", cmrUserId);

          if (error) {
            console.error("Error updating user tier:", error);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        // Find user by stripe_customer_id and downgrade to free
        const { error } = await supabase
          .from("cmr_users")
          .update({
            tier: "free",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Error downgrading user:", error);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (customerId) {
          console.warn(
            `Payment failed for customer ${customerId}. Downgrading to free.`
          );

          const { error } = await supabase
            .from("cmr_users")
            .update({ tier: "free" })
            .eq("stripe_customer_id", customerId);

          if (error) {
            console.error("Error downgrading user after payment failure:", error);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        // Get the new price ID to determine tier
        const priceId = subscription.items.data[0]?.price?.id;
        if (priceId) {
          const newTier = getTierFromPriceId(priceId);
          const { error } = await supabase
            .from("cmr_users")
            .update({ tier: newTier })
            .eq("stripe_customer_id", customerId);

          if (error) {
            console.error("Error updating tier on subscription change:", error);
          }
        }
        break;
      }

      default:
        // Unhandled event type — log and acknowledge
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
