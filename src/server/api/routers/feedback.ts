import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.js";
import transporter from "~/lib/nodemailer";
import { createTRPCRouter, publicProcedure } from "../trpc";

const feedbackRouter = createTRPCRouter({
  send: publicProcedure
    .input(
      z.object({
        rating: z
          .enum(["bad", "good", "amazing", "okay", "terrible"])
          .default("okay"),
        from: z
          .enum(["github", "twitter", "none", "google", "friends"])
          .default("none"),
        feedback: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await transporter.sendMail({
          from: "ReadWonders Team",
          to: env.TO,
          subject: "New Feedback Received - ReadWonders",
          html: `  
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <div style="text-align: center;">
                <img src="https://readwonders.vercel.app/apple-touch-icon.png" style="width: 50px; height: 50px;" alt="ReadWonders Logo"/>
                <h1 style="margin: 0; color: #333;">ReadWonders</h1>
              </div>
              <div style="margin-top: 20px; padding: 10px; border-top: 1px solid #eee;">
                <h2 style="font-size: 1.5rem; color: #333;">New Feedback Received</h2>
                <p style="font-size: 1rem; color: #555;">Rating: <strong style="color: #007BFF;">${input.rating.charAt(0).toUpperCase() + input.rating.slice(1)}</strong></p>
                <p style="font-size: 1rem; color: #555;">Heard from: <strong style="color: #007BFF;">${input.from.charAt(0).toUpperCase() + input.from.slice(1)}</strong></p>
                ${
                  input.feedback
                    ? `
                      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                        <h3 style="font-size: 1.25rem; color: #333; margin-bottom: 10px;">Response:</h3>
                        <p style="font-size: 1rem; color: #555;">${input.feedback}</p>
                      </div>
                    `
                    : ""
                }
              </div>
              <div style="margin-top: 20px; text-align: center;">
                <p style="font-size: 0.875rem; color: #777;">
                  @${new Date().getFullYear()} ReadWonders. All rights reserved.
                </p>
              </div>
            </div>
          `,
        });

        return {
          success: true,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Oh No! Feedback Didn't Go Through",
        });
      }
    }),
});

export { feedbackRouter };
