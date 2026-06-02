import type { HydratedDocument } from "mongoose";

export interface IUser {
  name: string;
  displayName: string;
  username: string;
  email: string;
  passwordHash?: string;
  avatarUrl: string;
  bio: string;
  statusMessage: string;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date | null;
  authProvider: "local" | "google";
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

export interface CreateUserInput {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  statusMessage?: string;
}