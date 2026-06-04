import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "@/shared/layouts/AuthLayout";
import LoginPage from "@/feat/auth/pages/LoginPage";
import RegisterPage from "@/feat/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/feat/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/feat/auth/pages/ResetPasswordPage";
import NotFoundPage from "@/feat/not-found/pages/NotFoundPage";

import GuestGuard from "@/app/guards/GuestGuard";
import AuthGuard from "@/app/guards/AuthGuard";

import HomePage from "@/feat/home/pages/HomePage";
import WorkspaceListPage from "@/feat/workspaces/pages/WorkspaceListPage";
import WorkspaceSettingsPage from "@/feat/workspaces/pages/WorkspaceSettingsPage";
import WorkspaceLayout from "@/shared/layouts/WorkspaceLayout";
import AppLayout from "@/shared/layouts/AppLayout";
import RoomPage from "@/feat/rooms/pages/RoomPage";

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
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/workspaces" replace />} />
          <Route path="/workspaces" element={<WorkspaceListPage />} />
        </Route>
        
        <Route element={<WorkspaceLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings" element={<WorkspaceSettingsPage />} />
          <Route path="/w/:workspaceSlug" element={<HomePage />} />
          <Route path="/w/:workspaceSlug/rooms/:roomId" element={<RoomPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}