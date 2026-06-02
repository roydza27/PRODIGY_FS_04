// src/feat/auth/components/forms/ForgotPasswordForm.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "./AuthCard";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";

export default function ForgotPasswordForm() {
  const { sendRecoveryLink, loading, error, success } = useForgotPasswordForm();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendRecoveryLink(email);
  };

  return (
    <AuthCard
      title="Reset Password"
      description="Enter your email address and we'll send you a secure link to update your password."
      className="max-w-md"
    >
      {success ? (
        <div className="space-y-4 text-center">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            A secure recovery link has been dispatched to{" "}
            <span className="font-semibold text-white">{email}</span>. Please check your inbox.
          </div>

          <Link to="/login" className="block text-sm font-medium text-white hover:underline">
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-left text-sm font-medium text-zinc-400">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
            />
          </div>

          {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#DB4444] px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#c53a3a] disabled:opacity-60"
          >
            {loading ? "Sending link..." : "Send Recovery Link"}
          </button>

          <div className="text-center text-sm text-zinc-400">
            Remember your password?{" "}
            <Link to="/login" className="font-medium text-white transition-colors hover:text-zinc-300 hover:underline">
              Login here
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
}