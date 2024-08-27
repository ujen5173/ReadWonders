import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { env } from "~/env.js";
import { stripe } from "~/lib/stripe/client";
import {
  handleInvoicePaid,
  handleSubscriptionCanceled,
  handleSubscriptionCreatedOrUpdated,
} from "~/lib/stripe/stripe-webhook-handlers";
import { db } from "~/server/db";

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const buf = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, webhookSecret);

    switch (event.type) {
      case "invoice.paid":
        await handleInvoicePaid({
          event,
          stripe,
          db,
        });
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated({
          event,
          db,
        });
        break;
      case "invoice.payment_failed":
      case "customer.subscription.deleted":
        await handleSubscriptionCanceled({
          event,
          db,
        });
        break;
      default:
      // Unexpected event type
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
