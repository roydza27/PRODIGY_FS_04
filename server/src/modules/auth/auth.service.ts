import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { env } from "../../config/env";
import { signAccessToken } from "../../services/jwt.service";
import { UserModel } from "../users/user.model";
import type { UserDocument } from "../users/user.types";
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "./auth.types";

const googleClient = env.googleClientId
  ? new OAuth2Client(env.googleClientId)
  : null;

const toAuthUser = (user: UserDocument): AuthUser => ({
  id: user._id.toString(),
  name: user.name,
  displayName: user.displayName ?? user.name,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl ?? "",
  bio: user.bio ?? "",
  statusMessage: user.statusMessage ?? "",
  isEmailVerified: user.isEmailVerified ?? false,
  isActive: user.isActive ?? true,
  authProvider: user.authProvider,
  lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

const sanitizeUsername = (value: string) => {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, "")
    .replace(/^[._-]+|[._-]+$/g, "");

  return cleaned || "user";
};

const createUniqueUsername = async (base: string) => {
  let candidate = sanitizeUsername(base);
  let suffix = 0;

  while (await UserModel.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${sanitizeUsername(base)}${suffix}`;
  }

  return candidate;
};

export const registerUser = async (
  input: RegisterInput
): Promise<AuthResponse> => {
  const username = input.username.trim().toLowerCase();
  const email = input.email.trim().toLowerCase();

  const existingUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new Error("User already exists with this email or username");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await UserModel.create({
    name: input.name.trim(),
    displayName: input.displayName?.trim() || input.name.trim(),
    username,
    email,
    passwordHash,
    avatarUrl: input.avatarUrl?.trim() || "",
    bio: input.bio?.trim() || "",
    statusMessage: input.statusMessage?.trim() || "",
    authProvider: "local",
  });

  const token = signAccessToken({
    userId: user._id.toString(),
    email: user.email,
    username: user.username,
  });

  return {
    user: toAuthUser(user),
    token,
  };
};

export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const identifier = input.identifier.trim().toLowerCase();

  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+passwordHash");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.authProvider === "google" || !user.passwordHash) {
    throw new Error("This account uses Google sign-in");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signAccessToken({
    userId: user._id.toString(),
    email: user.email,
    username: user.username,
  });

  return {
    user: toAuthUser(user),
    token,
  };
};

export const loginWithGoogle = async (credential: string): Promise<AuthResponse> => {
  if (!googleClient || !env.googleClientId) {
    throw new Error("GOOGLE_CLIENT_ID is missing");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.email || !payload.sub) {
    throw new Error("Invalid Google credential");
  }

  const email = payload.email.trim().toLowerCase();
  const googleId = payload.sub;
  const name = (payload.name?.trim() || email.split("@")[0]).trim();
  const avatarUrl = payload.picture?.trim() || "";

  let user = await UserModel.findOne({
    $or: [{ googleId }, { email }],
  });

  if (user) {
    if (!user.googleId) user.googleId = googleId;
    if (user.authProvider === "local") user.authProvider = "google";
    if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
    user.lastLoginAt = new Date();
    await user.save();
  } else {
    const username = await createUniqueUsername(email.split("@")[0]);

    user = await UserModel.create({
      name,
      displayName: name,
      username,
      email,
      avatarUrl,
      bio: "",
      statusMessage: "",
      authProvider: "google",
      googleId,
      isEmailVerified: Boolean(payload.email_verified),
      lastLoginAt: new Date(),
    });
  }

  const token = signAccessToken({
    userId: user._id.toString(),
    email: user.email,
    username: user.username,
  });

  return {
    user: toAuthUser(user),
    token,
  };
};

export const getCurrentUser = async (userId: string): Promise<AuthUser> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return toAuthUser(user);
};

// ==========================================
// PASSWORD RECOVERY SYSTEM
// ==========================================

export const forgotPassword = async (email: string): Promise<void> => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Verify user exists
  const user = await UserModel.findOne({ email: normalizedEmail }).select("+passwordHash");
  if (!user) {
    throw new Error("We couldn't find an account associated with that email.");
  }

  if (user.authProvider === "google") {
    throw new Error("This account uses Google sign-in. Please sign in with Google.");
  }

  // 2. Generate a secure, one-time use token
  const secret = env.jwtSecret + user.passwordHash;
  const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "15m" });

  // 3. Build the reset link
  const frontendUrl = env.clientUrl;
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  // 4. Configure Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.emailUser,
      pass: env.emailPass,
    },
  });

  // 5. Setup Email Structure with Professional HTML
  const mailOptions = {
    from: `"Workspace Chat" <${env.emailUser}>`,
    to: user.email,
    subject: "Reset Your Password - Workspace Chat",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 12px;">
        <h2 style="color: #111113; font-size: 24px; margin-top: 0; text-align: center;">Reset Your Password</h2>
        
        <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hello ${user.name},<br><br>
          We received a request to reset the password for your Workspace Chat account. Click the button below to choose a new password:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #DB4444; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
        </div>
        
        <p style="color: #52525b; font-size: 15px; line-height: 1.6;">
          For security reasons, this link will expire in <strong>15 minutes</strong>. 
        </p>
        
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
        
        <p style="color: #a1a1aa; font-size: 13px; line-height: 1.5; text-align: center; margin-bottom: 0;">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
    `,
  };

  // 6. Send the Email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Success] Recovery email sent to: ${user.email}`);
  } catch (error) {
    console.error("SMTP Error: ", error);
    throw new Error("Failed to send recovery email. Please try again later.");
  }
};

// In auth.service.ts
export const resetPassword = async (password: string, token: string): Promise<string> => {
  const decoded = jwt.decode(token) as { id: string; email: string } | null;
  
  if (!decoded || !decoded.id) throw new Error("Invalid or corrupted reset token.");

  const user = await UserModel.findById(decoded.id).select("+passwordHash");
  if (!user) throw new Error("User associated with this token no longer exists.");

  const secret = (process.env.JWT_SECRET || 'fallback_secret') + user.passwordHash;
  
  try {
    jwt.verify(token, secret);
  } catch (err) {
    throw new Error("This reset link has expired or has already been used.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  user.passwordHash = passwordHash;
  await user.save({ validateBeforeSave: false });

  return "Password successfully updated"; // Return the message
};