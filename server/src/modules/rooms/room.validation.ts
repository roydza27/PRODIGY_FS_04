import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(2, "Room name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["text", "voice"]).optional().default("text"),
  isPrivate: z.boolean().optional().default(false),
});
