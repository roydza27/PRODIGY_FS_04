import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  visibility: z.enum(["invite-only", "public"]).default("invite-only"),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters").optional(),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
});

export const inviteMemberSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  role: z.enum(["admin", "member"]).default("member"),
}).refine(data => data.userId || data.email, {
  message: "User ID or Email is required",
  path: ["userId"],
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["owner", "admin", "member"]),
});

export const removeMemberSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
});

export type CreateWorkspacePayload = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspacePayload = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberPayload = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRolePayload = z.infer<typeof updateMemberRoleSchema>;
export type RemoveMemberPayload = z.infer<typeof removeMemberSchema>;
