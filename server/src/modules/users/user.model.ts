import { model, models, Schema } from "mongoose";
import type { IUser } from "./user.types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    displayName: {
      type: String,
      trim: true,
      default: function (this: IUser) {
        return this.name;
      },
    },
    username: {
      type: String,
      required: true,
      unique: true, // <-- This automatically creates the index
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // <-- This automatically creates the index
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      select: false,
      required: function (this: IUser) {
        return this.authProvider === "local";
      },
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    statusMessage: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = models.User || model<IUser>("User", userSchema);