// v1.2 — Stripe webhook handler
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Use service role client for webhooks (no user context)
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function planFromPriceId(priceId: string): string {
  const priceMap: Record<string, string> = {
    [process.env.STRIPE_PRICE_SOLO_MONTHLY!]: "solo",
    [process.env.STRIPE_PRICE_TEAM_MONTHLY!]: "team",
    [process.env.STRIPE_PRICE_BROKERAGE_MONTHLY!]: "brokerage",
    [process.env.STRIPE_PRICE_LIFETIME_LAUNCH!]: "lifetime",
  };
  return priceMap[priceId] || "trial";
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { message: "Invalid signature" },
      { status: 400 }
    );
  }

  const supabase = getAdminSupabase();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      if (!userId) break;

      // Determine plan from the line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;
      if (!priceId) break;

      const plan = planFromPriceId(priceId);

      await supabase
        .from("users")
        .update({
          plan,
          stripe_customer_id: session.customer as string,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const priceId = subscription.items.data[0]?.price?.id;
      if (!priceId) break;

      const plan = planFromPriceId(priceId);

      await supabase
        .from("users")
        .update({ plan, updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", customerId);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await supabase
        .from("users")
        .update({ plan: "trial", updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", customerId);

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // Mark as past_due — could also send email via Resend here
      await supabase
        .from("users")
        .update({ plan: "past_due", updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", customerId);

      break;
    }
  }

  return NextResponse.json({ received: true });
}
