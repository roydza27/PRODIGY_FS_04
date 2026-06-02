// src/feat/auth/schemas/login.schema.ts

import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Username or Email is required"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;