// src/feat/auth/components/forms/ResetPasswordForm.tsx

import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthCard from "./AuthCard";
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const { resetPassword, loading, error, success } = useResetPasswordForm();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await resetPassword({
      password,
      confirmPassword,
      token,
    });
  };

  return (
    <AuthCard
      title="Create New Password"
      description="Please enter and confirm your secure new password credentials."
      className="max-w-md"
    >
      {success ? (
        <div className="space-y-4 text-center">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            Password updated successfully. You can now log in securely.
          </div>

          <Link
            to="/login"
            className="block w-full rounded-2xl bg-[#DB4444] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#c53a3a]"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="mb-2 block text-left text-sm font-medium text-zinc-400">
              New Password
            </label>
            <input
              type="password"
              id="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-left text-sm font-medium text-zinc-400">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
            />
          </div>

          {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#DB4444] px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#c53a3a] disabled:opacity-60"
          >
            {loading ? "Updating password..." : "Update Password"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}