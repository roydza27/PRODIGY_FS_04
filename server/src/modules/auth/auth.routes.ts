import { Router } from "express";
import {
  googleLoginController,
  loginController,
  meController,
  registerController,
  forgotPasswordController, // <-- Add this
  resetPasswordController   // <-- Add this
} from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/google", googleLoginController);
authRouter.get("/me", protect, meController);

// Add the missing routes here
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);

export default authRouter;