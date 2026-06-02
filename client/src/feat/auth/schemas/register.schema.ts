// src/feat/auth/schemas/register.schema.ts

import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type RegisterSchema = z.infer<
  typeof registerSchema
>;