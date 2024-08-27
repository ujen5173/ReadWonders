import Stripe from "stripe";
import { env } from "~/env.js";

export const stripe = new Stripe(env.STRIPE_SK);
