import { z } from "zod";
import transporter from "~/app/lib/nodemailer";
import { env } from "~/env.mjs";
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
      await transporter.sendMail({
        from: "ReadWonders Team",
        to: env.TO,
        subject: "New Feedback Received - ReadWonders",
        html: `  
          <div>
            <div>
              <div style="display: flex; align-items: center; margin-bottom: 16px; gap: 8px;">
                <img src="https://readwonders.vercel.app/apple-touch-icon.png" style="width: 40px; height: 40px;" alt="ReadWonders Logo"/>
                <h1 style="margin: 0">ReadWonders.</h1>
              </div>

              <div>
                <div>
                  <span style="font-size: 1.5rem;font-weight: 600">Rating: ${
                    input.rating.charAt(0).toUpperCase() + input.rating.slice(1)
                  }</span>
                </div>
                <div>
                  <span style="font-size: 1.5rem;font-weight: 600">Rating: ${
                    input.from.charAt(0).toUpperCase() + input.from.slice(1)
                  }</span>
                </div>
                <div style="font-size: 1rem;">
                  Response: <br />
                  <p style="background-color: #1e293b; color: #f8fafc; margin: 5px 0; padding: 10px; border-radius: 7px;">${input.feedback}</p>
                </div>
              </div>
            </div>
          </div>  
        `,
      });

      return {
        success: true,
      };
    }),
});

export { feedbackRouter };
