import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe configuration is missing." },
      { status: 500 }
    );
  }

  try {
    const { billing, email } = await request.json();
    if (billing !== "monthly" && billing !== "yearly") {
      return NextResponse.json({ error: "Choose a valid billing plan." }, { status: 400 });
    }
    const priceId = billing === "monthly" ? process.env.STRIPE_MONTHLY_PRICE_ID : process.env.STRIPE_YEARLY_PRICE_ID;
    if (!priceId) return NextResponse.json({ error: "The selected Stripe price is not configured." }, { status: 500 });
    if (!priceId.startsWith("price_")) return NextResponse.json({ error: "The selected value is not a Stripe Price ID. Use a value beginning with price_." }, { status: 500 });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const checkoutData = {
      mode: "subscription",
      ...(email ? { customer_email: email } : {}),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/settings?checkout=success`,
      cancel_url: `${origin}/choose-plan?checkout=cancelled`,
    };
    if (billing === "yearly") checkoutData.subscription_data = { trial_period_days: 7 };
    const session = await stripe.checkout.sessions.create(checkoutData);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to create checkout session." }, { status: 500 });
  }
}
