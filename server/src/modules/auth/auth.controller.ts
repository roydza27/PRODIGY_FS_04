import type { Request, Response } from "express";
import {
  forgotPassword,
  getCurrentUser,
  loginUser,
  loginWithGoogle,
  registerUser,
  resetPassword,
} from "./auth.service";
import {
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation";

const sendAuthError = (res: Response, message: string, status = 400) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await registerUser(validated);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    return sendAuthError(res, message);
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await loginUser(validated);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return sendAuthError(res, message, 401);
  }
};

export const googleLoginController = async (req: Request, res: Response) => {
  try {
    const validated = googleLoginSchema.parse(req.body);
    const result = await loginWithGoogle(validated.credential);

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Google login failed";
    return sendAuthError(res, message, 401);
  }
};

export const meController = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendAuthError(res, "Unauthorized", 401);

    const user = await getCurrentUser(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return sendAuthError(res, message, 401);
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const validated = forgotPasswordSchema.parse(req.body);
    await forgotPassword(validated.email);

    return res.status(200).json({
      success: true,
      message: "Recovery email dispatched",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to send recovery email. Please try again later.";
    return sendAuthError(res, message, 400);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const validated = resetPasswordSchema.parse(req.body);
    const message = await resetPassword(validated.password, validated.token);

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reset password.";
    return sendAuthError(res, message, 400);
  }
};