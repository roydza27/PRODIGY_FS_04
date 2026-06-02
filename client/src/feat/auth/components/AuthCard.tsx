// src/feat/auth/components/AuthCard.tsx

import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function AuthCard({
  title,
  description,
  children,
  className = "",
}: AuthCardProps) {
  return (
    <div
      className={`mx-auto w-full max-w-md rounded-[28px] border border-white/10 bg-[#111113]/95 p-6 shadow-2xl shadow-black/30 md:p-8 ${className}`}
    >
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-[-0.04em] text-white">
          {title}
        </h1>
        {description ? (
          <p className="text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </div>
  );
}