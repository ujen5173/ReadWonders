import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  categoryName: z.string().optional(),
  isMature: z.boolean().default(false),
  isPremium: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  thumbnail: z.instanceof(File).nullable(),
});

export const formUpdateSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  categoryName: z.string().nullable(),
  isMature: z.boolean().default(false),
  tags: z.array(z.string()),
  thumbnail: z.string().nullable(),
  published: z.boolean().default(false),
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
  .passthrough()
  .nullable();

export const chapterFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: mainSchema,
  isPremium: z.boolean().default(false),
  coins: z.number().default(0),
  thumbnail: z.string().nullable(),
  published: z.boolean().default(false),
  scheduledAt: z.date().nullable(),
});

export const chapterSchema = z.object({
  content: z.string(),
});

export const newStoryFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  thumbnail: z.string().nullable(),
});
