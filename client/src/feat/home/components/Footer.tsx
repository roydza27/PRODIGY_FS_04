import { MessageSquareMore, ArrowRight } from "lucide-react";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#090909] border-t border-white/[0.05] pt-20 md:pt-32 pb-12">
      <div className="mx-auto max-w-7xl px-6 text-left">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-5">
          
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 font-bold text-white text-2xl tracking-tight mb-8 transition-all hover:opacity-90 active:scale-95">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/20 ring-1 ring-violet-400/20">
                <MessageSquareMore className="h-6 w-6 text-white" />
              </div>
              <span className="font-black uppercase italic tracking-tighter">SyncSpace</span>
            </Link>
            <p className="max-w-xs text-base font-medium leading-relaxed text-zinc-500 mb-10">
                The high-performance communication platform for teams that build the future. Built for speed, security, and scale.
            </p>
            <div className="flex gap-4">
                <SocialLink icon={<FiGithub className="h-5 w-5" />} />
                <SocialLink icon={<FiTwitter className="h-5 w-5" />} />
                <SocialLink icon={<FiLinkedin className="h-5 w-5" />} />
            </div>
          </div>

          {/* Nav Cols */}
          <NavCol 
            title="Product"
            links={["Features", "Workspaces", "Channels", "Messaging", "Roadmap"]}
          />
          <NavCol 
            title="Resources"
            links={["Documentation", "API Reference", "GitHub", "Changelog", "Blog"]}
          />
          <NavCol 
            title="Company"
            links={["About Us", "Careers", "Privacy Policy", "Terms of Service", "Contact"]}
          />

        </div>

        <div className="mt-24 pt-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">
                © 2026 SyncSpace. Built for modern teams.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group cursor-pointer hover:text-white transition-colors">
                System Status <span className="text-emerald-500 flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational</span>
            </div>
        </div>
      </div>
    </footer>
  );
}

function NavCol({ title, links }: { title: string, links: string[] }) {
    return (
        <div className="space-y-8 text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">{title}</h4>
            <ul className="space-y-4">
                {links.map(link => (
                    <li key={link}>
                        <Link to="#" className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors tracking-tight">{link}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}


function SocialLink({ icon }: { icon: React.ReactNode }) {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-zinc-500 hover:text-white hover:bg-violet-600/10 hover:border-violet-500/30 transition-all cursor-pointer ring-1 ring-white/5">
            {icon}
        </div>
    )
}