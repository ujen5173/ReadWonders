import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().optional(),
  isMature: z.boolean().default(false),
  isPremium: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  thumbnail: z.instanceof(File).nullable(),
});

const JsonContentZod: z.ZodType<unknown> = z.lazy(() =>
  z
    .object({
      type: z.string().optional(),
      attrs: z.record(z.any()).optional(),
      content: z.array(JsonContentZod).optional(), // Recursive structure
      marks: z
        .array(
          z
            .object({
              type: z.string(),
              attrs: z.record(z.any()).optional(),
            })
            .passthrough(),
        )
        .optional(),
      text: z.string().optional(),
    })
    .passthrough(),
);

export const mainSchema = z
  .object({
    type: z.string().optional(),
    attrs: z.record(z.any()).optional(),
    content: z.array(JsonContentZod).optional(),
    marks: z
      .array(
        z
          .object({
            type: z.string(),
            attrs: z.record(z.any()).optional(),
          })
          .passthrough(),
      )
      .optional(),
    text: z.string().optional(),
  })
  .passthrough();
