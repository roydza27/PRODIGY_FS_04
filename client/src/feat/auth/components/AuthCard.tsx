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
      className={`w-full max-w-sm rounded-[24px] border border-white/10 bg-[#111113]/95 p-4 shadow-2xl shadow-black/30 sm:max-w-md sm:p-6 md:max-w-lg md:p-8 ${className}`}
    >
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="mb-2 text-2xl font-bold tracking-[-0.04em] text-white sm:mb-3 sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </div>
  );
}