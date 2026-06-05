import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { MessageSquareMore } from "lucide-react";

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#111113]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-white"
        >
          <MessageSquareMore className="h-5 w-5 text-violet-500" />
          SyncSpace
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-400 lg:flex">
          <a href="#features">Features</a>
          <a href="#workspaces">Workspaces</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-zinc-300 hover:text-white"
          >
            Sign In
          </Button>

          <Button>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}