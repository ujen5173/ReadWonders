import { env } from "~/env.js";
import { getOrCreateStripeCustomerIdForUser } from "~/lib/stripe/stripe-webhook-handlers";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: privateProcedure.mutation(async ({ ctx }) => {
    try {
      const { stripe, db, session } = ctx;
      const { user } = session;

      const customerId = await getOrCreateStripeCustomerIdForUser({
        db,
        stripe,
        userId: user.id,
      });

      if (!customerId) {
        throw new Error("Could not create customer");
      }

      const baseUrl =
        env.NODE_ENV === "development"
          ? `http://${ctx.headers.get("host") ?? "localhost:3000"}`
          : `https://${ctx.headers.get("host") ?? env.NEXT_PUBLIC_APP_URL}`;

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: user.id,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/dashboard?success=true`,
        cancel_url: `${baseUrl}/dashboard?success=false`,
        subscription_data: {
          metadata: {
            userId: user.id,
          },
        },
      });

      if (!checkoutSession) {
        throw new Error("Could not create checkout session");
      }

      return { checkoutUrl: checkoutSession.url };
    } catch (err) {
      console.log({ err });
      throw new Error("Could not create checkout session");
    }
  }),

  createBillingPortalSession: privateProcedure.mutation(async ({ ctx }) => {
    const { stripe, db, session } = ctx;
    const { user } = session;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      db,
      stripe,
      userId: user.id,
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl =
      env.NODE_ENV === "development"
        ? `http://${ctx.headers.get("host") ?? "localhost:3000"}`
        : `https://${ctx.headers.get("host") ?? env.NEXT_PUBLIC_APP_URL}`;

    const stripeBillingPortalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/dashboard`,
      });

    if (!stripeBillingPortalSession) {
      throw new Error("Could not create billing portal session");
    }

    return { billingPortalUrl: stripeBillingPortalSession.url };
  }),
});
