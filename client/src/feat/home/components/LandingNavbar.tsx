import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { MessageSquareMore } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-[#090909]/80 backdrop-blur-xl border-b border-white/[0.08] py-3 shadow-xl shadow-black/20"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-3 font-bold text-white transition-all hover:opacity-90 active:scale-95"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/20 ring-1 ring-violet-400/20">
            <MessageSquareMore className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl tracking-tight font-black uppercase italic">SyncSpace</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button
              variant="ghost"
              className="text-sm font-semibold text-zinc-400 hover:bg-white/[0.05] hover:text-white px-5 rounded-2xl transition-all"
            >
              Sign In
            </Button>
          </Link>

          <Link to="/register">
            <Button className="bg-white text-black font-bold hover:bg-zinc-200 shadow-lg shadow-white/5 px-6 rounded-2xl text-sm transition-all active:scale-95">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}