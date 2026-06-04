import { Link } from "react-router-dom";
import {
  Globe,
  Mail,
  MessageSquare,
  Share2,
  Store,
  ArrowRight,
} from "lucide-react";

const FOOTER_DATA = {
  sections: [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "Best Sellers", href: "#" },
        { name: "Deals & Offers", href: "#" },
        { name: "Gift Cards", href: "#" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Track Order", href: "#" },
        { name: "Returns & Refunds", href: "#" },
        { name: "Shipping Info", href: "#" },
        { name: "Contact Support", href: "#" },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Use", href: "#" },
        { name: "FAQ", href: "#" },
        { name: "About Us", href: "#" },
        { name: "Store Locations", href: "#" },
      ],
    },
  ],
  socials: [
    { label: "Website", href: "#", icon: Globe },
    { label: "Email", href: "#", icon: Mail },
    { label: "Messages", href: "#", icon: MessageSquare },
    { label: "Share", href: "#", icon: Share2 },
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#0a0a0a] pt-16 pb-8 md:pt-20 md:pb-10 text-zinc-400 selection:bg-[#DB4444]/30 selection:text-white">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 h-px w-full max-w-3xl -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8 lg:gap-12">
          
          {/* Left Column: Brand, Desc, Newsletter */}
          <div className="flex flex-col space-y-10 md:col-span-5 lg:col-span-5 lg:pr-8">
            
            <div className="space-y-6 text-left">
              <Link
                to="/"
                className="group flex w-fit items-center gap-3 focus:outline-none"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] transition-colors group-hover:border-white/20 group-hover:bg-white/[0.04]">
                  <Store className="h-5 w-5 text-[#DB4444] transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-base font-semibold tracking-tight text-zinc-100">
                    
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    E-commerce platform
                  </span>
                </div>
              </Link>
              
              <p className="max-w-md text-sm leading-relaxed text-zinc-400 sm:max-w-sm">
                A premium local store shopping experience with seamless product
                browsing, intuitive cart flows, and a highly polished modern interface.
              </p>
            </div>

            {/* Combined Socials & Newsletter in a cohesive block */}
            <div className="w-full max-w-md space-y-6 rounded-2xl border border-white/5 bg-white/[0.01] p-6 shadow-sm ring-1 ring-white/5 backdrop-blur-sm sm:max-w-sm">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-zinc-100">Stay Updated</h3>
                <p className="text-xs text-zinc-500">
                  Exclusive offers and store news, straight to your inbox.
                </p>
              </div>

              <Link
                to="/register"
                className="group flex w-full items-center justify-between rounded-lg bg-[#DB4444]/10 border border-[#DB4444]/20 px-4 py-2.5 text-sm font-medium text-[#DB4444] transition-all hover:bg-[#DB4444] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#DB4444]/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              >
                <span>Subscribe to Newsletter</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <div className="pt-2">
                <div className="flex items-center gap-4">
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                    Follow Us
                  </span>
                  <div className="h-px w-full flex-1 bg-white/5" />
                  <div className="flex shrink-0 gap-2">
                    {FOOTER_DATA.socials.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          aria-label={social.label}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Columns: Navigation Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:col-span-7 lg:col-span-7 lg:pl-8">
            {FOOTER_DATA.sections.map((section) => (
              <div key={section.title} className="flex flex-col">
                <h3 className="mb-6 text-sm font-medium text-zinc-100">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                         href={link.href}
                         className="group flex w-fit items-center text-sm text-zinc-500 transition-all hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-sm"
                      >
                        <span className="relative">
                          {link.name}
                          <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-zinc-200 transition-all duration-300 group-hover:w-full" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 sm:flex-row md:mt-20">
          <p className="text-center text-xs text-zinc-600 sm:text-left">
            © {new Date().getFullYear()} LocalStore. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-600">
            <a href="#" className="transition-colors hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-zinc-300">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-zinc-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}