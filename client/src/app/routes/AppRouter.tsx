import { Route, Routes } from "react-router-dom";

import AuthLayout from "@/shared/layouts/AuthLayout";
import AppLayout from "@/shared/layouts/AppLayout";
import WorkspaceLayout from "@/shared/layouts/WorkspaceLayout";

import GuestGuard from "@/app/guards/GuestGuard";
import AuthGuard from "@/app/guards/AuthGuard";

import HomePage from "@/feat/home/pages/HomePage";

import LoginPage from "@/feat/auth/pages/LoginPage";
import RegisterPage from "@/feat/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/feat/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/feat/auth/pages/ResetPasswordPage";

import WorkspaceListPage from "@/feat/workspaces/pages/WorkspaceListPage";
import WorkspaceHomePage from "@/feat/workspaces/pages/WorkspaceHomePage";
import WorkspaceSettingsPage from "@/feat/workspaces/pages/WorkspaceSettingsPage";

import RoomPage from "@/feat/rooms/pages/RoomPage";

import NotFoundPage from "@/feat/not-found/pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<HomePage />} />

      {/* Guest Routes */}
      <Route element={<GuestGuard />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<AuthGuard />}>
        {/* Global App Pages */}
        <Route element={<AppLayout />}>
          <Route
            path="/workspaces"
            element={<WorkspaceListPage />}
          />
        </Route>

        {/* Workspace Pages */}
        <Route element={<WorkspaceLayout />}>
          <Route
            path="/w/:workspaceSlug"
            element={<WorkspaceHomePage />}
          />

          <Route
            path="/w/:workspaceSlug/rooms/:roomId"
            element={<RoomPage />}
          />

          <Route
            path="/w/:workspaceSlug/settings"
            element={<WorkspaceSettingsPage />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}