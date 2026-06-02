import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "@/shared/layouts/AuthLayout";
import LoginPage from "@/feat/auth/pages/LoginPage";
import RegisterPage from "@/feat/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/feat/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/feat/auth/pages/ResetPasswordPage";
import NotFoundPage from "@/feat/not-found/pages/NotFoundPage";

import GuestGuard from "@/app/guards/GuestGuard";
import AuthGuard from "@/app/guards/AuthGuard";

import HomePage from "@/feat/home/pages/HomePage"

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestGuard />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>


      <Route element={<AuthGuard />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}