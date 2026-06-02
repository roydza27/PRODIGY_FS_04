import {
  forgotPasswordAPI,
  getMe,
  loginUser,
  loginWithGoogleAPI,
  registerUser,
  resetPasswordAPI,
} from "../services/auth.service";

export const authApi = {
  login: loginUser,
  register: registerUser,
  me: getMe,
  googleLogin: loginWithGoogleAPI,
  forgotPassword: forgotPasswordAPI,
  resetPassword: resetPasswordAPI,
};