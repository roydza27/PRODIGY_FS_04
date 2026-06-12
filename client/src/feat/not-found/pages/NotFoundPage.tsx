import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Home, ArrowLeft, Search, Terminal } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#09090B] px-4 text-[#FAFAFA] selection:bg-primary/30">

      {/* Premium Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center">

        {/* Background 404 Text - Decoupled from content layout */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.03, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-[15rem] font-black leading-none tracking-tighter text-white sm:text-[25rem]"
          >
            404
          </motion.h1>
        </div>

        {/* Foreground Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-20 flex flex-col items-center text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6"
          >
            <Terminal className="h-3 w-3" />
            Error: Path_Not_Found
          </motion.div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl text-white mb-6">
            System Out of Bounds
          </h2>

          <p className="max-w-md text-zinc-400 text-sm sm:text-base font-medium leading-relaxed mb-10">
            We tracked every node in the repository, but this segment remains undefined. 
            The reference you're looking for might have been moved or deleted.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row items-center justify-center"
          >
            <Button asChild size="lg" className="h-12 px-8 gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              <Link to="/">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>

            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="h-12 px-8 gap-2 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-[0.98]"
            >
              <Link to="/workspaces/search">
                <Search className="h-4 w-4" />
                Global Search
              </Link>
            </Button>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.8 }}
            onClick={() => window.history.back()}
            className="mt-12 flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to previous segment
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Brand Element */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 flex items-center gap-3"
      >
        <div className="h-px w-12 bg-white" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">SyncSpace</span>
        <div className="h-px w-12 bg-white" />
      </motion.div>
    </div>
  );
}