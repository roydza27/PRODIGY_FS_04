// src/feat/auth/components/forms/SignupForm.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import AuthCard from "./AuthCard";
import { useSignupForm } from "../hooks/useSignupForm";

export default function SignupForm() {
  const { signup, loading, error } = useSignupForm();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signup({
      name,
      username,
      email,
      password,
      confirmPassword,
      acceptTerms,
    });
  };

  return (
    <AuthCard
      title="Create an account"
      description="Sign up to get instant access to your dashboard."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="mb-2 block text-left text-sm font-medium text-zinc-400">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
          />
        </div>

        <div>
          <label htmlFor="username" className="mb-2 block text-left text-sm font-medium text-zinc-400">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="johndoe123"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-left text-sm font-medium text-zinc-400">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-left text-sm font-medium text-zinc-400">
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

        <div>
          <label htmlFor="confirm-password" className="mb-2 block text-left text-sm font-medium text-zinc-400">
            Confirm password
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <label className="flex cursor-pointer items-center">
            <input
              id="tmc"
              name="tmc"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 rounded border-white/10 bg-black/30 text-[#DB4444] focus:ring-[#DB4444]/60"
            />
            <span className="ml-3 text-sm text-zinc-400">I accept the</span>
          </label>

          <a
            href="/terms"
            className="text-sm font-medium text-zinc-200 transition-colors hover:text-white hover:underline"
          >
            Terms and Conditions
          </a>
        </div>

        {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}

        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#DB4444] px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#c53a3a] focus:outline-none focus:ring-2 focus:ring-[#DB4444]/60 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create an account"}
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-white transition-colors hover:text-zinc-300 hover:underline"
          >
            Login here
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}