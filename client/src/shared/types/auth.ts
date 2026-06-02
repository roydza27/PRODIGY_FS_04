export type AuthUser = {
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
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};