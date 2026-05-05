// v1.2 — Stripe checkout session creation
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { priceId, mode } = await request.json();

    if (!priceId || !mode) {
      return NextResponse.json(
        { message: "priceId and mode are required" },
        { status: 400 }
      );
    }

    // For lifetime: check sold count before allowing checkout
    if (mode === "payment") {
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("plan", "lifetime");

      if ((count ?? 0) >= 100) {
        return NextResponse.json(
          { message: "Lifetime spots are sold out" },
          { status: 410 }
        );
      }
    }

    // Get or create Stripe customer
    const { data: dbUser } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = dbUser?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode as "subscription" | "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/generate?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { supabase_user_id: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
