import { z } from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(2, "Room name must be at least 2 characters")
    .max(100),

  description: z
    .string()
    .max(500)
    .optional(),

  type: z
    .enum(["text", "voice"])
    .optional()
    .default("text"),

  isPrivate: z
    .boolean()
    .optional()
    .default(false),
});

export const updateRoomSchema = z
  .object({
    name: z
      .string()
      .min(2, "Room name must be at least 2 characters")
      .max(100)
      .optional(),

    description: z
      .string()
      .max(500)
      .optional(),

    type: z
      .enum(["text", "voice"])
      .optional(),

    isPrivate: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  );