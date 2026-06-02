// src/feat/auth/components/forms/LoginForm.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import AuthCard from "./AuthCard";
import { useLoginForm } from "../hooks/useLoginForm";

export default function LoginForm() {
  const { login, loading, error } = useLoginForm();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({
      identifier,
      password,
      remember: rememberMe,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid w-full items-center gap-8 md:gap-12 lg:grid-cols-2">
        <AuthCard
          title="Sign in"
          description="Sign in to your account to access your dashboard and manage your projects."
          className="lg:ml-auto lg:mx-0"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="identifier" className="mb-2 block text-sm font-medium text-zinc-400">
                Email or Username
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                placeholder="john@example.com or johndoe123"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-400">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex cursor-pointer items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-black/30 text-[#DB4444] focus:ring-[#DB4444]/60"
                />
                <span className="ml-3 text-sm text-zinc-400">Remember me</span>
              </label>

              <Link
                to="/forgotPassword"
                className="text-sm font-medium text-zinc-200 transition-colors hover:text-white hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#DB4444] px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#c53a3a] focus:outline-none focus:ring-2 focus:ring-[#DB4444]/60 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute w-full border-t border-white/5" />
                <span className="relative bg-[#111113] px-3 text-xs uppercase tracking-widest text-zinc-600">
                  or
                </span>
              </div>

              <GoogleLoginButton />
            </div>

            <div className="text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-white transition-colors hover:text-zinc-300 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </AuthCard>

        <div className="mx-auto hidden max-w-lg lg:block">
          <img
            src="https://readymadeui.com/images/integration-illus.webp"
            className="w-full object-contain"
            alt="login illustration"
          />
        </div>
      </div>
    </div>
  );
}