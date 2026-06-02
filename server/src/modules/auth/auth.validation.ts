import type {
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
} from "./auth.types";

export function validateRegisterInput(data: RegisterInput) {
  const { name, username, email, password } = data;

  if (!name || !username || !email || !password) {
    return "Name, username, email, and password are required";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (username.trim().length < 3) {
    return "Username must be at least 3 characters long";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  return null;
}

export function validateLoginInput(data: LoginInput) {
  const { identifier, password } = data;

  if (!identifier || !password) {
    return "Identifier and password are required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  return null;
}

export function validateGoogleLoginInput(data: GoogleLoginInput) {
  if (!data.credential) {
    return "Google credential is required";
  }

  return null;
}

export function validateForgotPasswordInput(data: { email?: string }) {
  if (!data.email) return "Email is required";
  return null;
}

export function validateResetPasswordInput(data: { password?: string; token?: string }) {
  if (!data.password || !data.token) return "Password and token are required";
  if (data.password.length < 6) return "Password must be at least 6 characters long";
  return null;
}