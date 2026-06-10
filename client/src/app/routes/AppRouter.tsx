import { Route, Routes } from "react-router-dom";

import AuthLayout from "@/shared/layouts/AuthLayout";
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

import InvitesPage from "@/feat/workspaces/pages/InvitesPage";
import SearchPage from "@/feat/workspaces/pages/SearchPage";

import RoomChatPage from "@/feat/chat/pages/RoomChatPage";
import DMPage from "@/feat/chat/pages/DMPage";

import NotFoundPage from "@/feat/not-found/pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<HomePage />} />

      {/* Guest Routes */}
      <Route element={<GuestGuard />}>
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/forgotPassword"
            element={<ForgotPasswordPage />}
          />
          <Route
            path="/reset-password"
            element={<ResetPasswordPage />}
          />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<AuthGuard />}>
        <Route element={<WorkspaceLayout />}>
          <Route
            path="/workspaces"
            element={<WorkspaceListPage />}
          />
          <Route
            path="/workspaces/invites"
            element={<InvitesPage />}
          />
          <Route
            path="/workspaces/search"
            element={<SearchPage />}
          />
          
          <Route
            path="/w/:workspaceSlug"
            element={<WorkspaceHomePage />}
          />

          <Route
            path="/w/:workspaceSlug/rooms/:roomId"
            element={<RoomChatPage />}
          />

          <Route
            path="/dm/:conversationId"
            element={<DMPage />}
          />

          <Route
            path="/w/:workspaceSlug/settings"
            element={<WorkspaceSettingsPage />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}