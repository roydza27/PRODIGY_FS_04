export interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  statusMessage?: string;
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface GoogleLoginInput {
  credential: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  password: string;
  token: string;
}

export interface AuthUser {
  id: string;
  name: string;
  displayName: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  statusMessage: string;
  isEmailVerified: boolean;
  isActive: boolean;
  authProvider: "local" | "google";
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}