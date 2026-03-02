"use client";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Heart,
  ArrowRight,
  MessageCircle
} from "lucide-react";
import { cn, smoothScroll } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const FOOTER_LINKS = [
  {
    title: "Tour Packages",
    links: [
      { label: "Nubra & Pangong Escape", href: "/packages/nubra-pangong-escape" },
      { label: "Stargazing Expedition", href: "/packages/stargazing-expedition" },
      { label: "Sham Valley Trek", href: "/packages/sham-valley-trek" },
      { label: "Markha Valley Trek", href: "/packages/markha-valley-trek" },
      { label: "Custom / Not Sure", href: "#contact" }
    ]
  },
  {
    title: "Quick Links",
    links: [
      { label: "Tour Packages", href: "#packages" },
      { label: "Our Destinations", href: "#destinations" },
      { label: "Photo Gallery", href: "#gallery" },
      { label: "Why Choose Us", href: "#about" },
      { label: "Contact Us", href: "#contact" }
    ]
  },
  {
    title: "Helpful Info",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Reviews", href: "/#testimonials" }, // Placeholder for blog/info if needed
      { label: "Best Package", href: "/#stargazing" },
      { label: "Best Season", href: "/#contact" },
      { label: "Contact Support", href: "#contact" }
    ]
  }
];

const SOCIAL_LINKS = [
  { icon: Instagram, href: "https://www.instagram.com/silentpeaktrail" },
  { icon: Facebook, href: "https://www.facebook.com/silentpeaktrail" }
  , // Example WA link
  // { icon: Twitter, href: "#" },
  // { icon: Youtube, href: "#" }
];

export default function Footer({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return; // Follow normal link behavior for /packages/ etc

    if (pathname !== "/") {
      e.preventDefault();
      router.push("/" + href);
    } else {
      smoothScroll(e, href);
    }
  };

  return (
    <footer className={cn("bg-[var(--navy)] pt-12 pb-12 text-white overflow-hidden", className)}>
      <div className="container mx-auto  px-5 lg:px-[60px]">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-8">

          <div className="sm:col-span-2 lg:col-span-2 flex flex-col items-center text-center lg:items-start lg:text-left gap-8 mt-4">
            <div className="flex flex-col items-center lg:items-start gap-4 shrink-0">
              <a href="/" className="transition-transform hover:scale-105 active:scale-95">
                <img
                  src="/logo.jpg"
                  alt="Silent Peak Trail"
                  className="h-28 w-28 rounded-full object-cover shadow-2xl ring-2 ring-white/10"
                />
              </a>
              <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white">
                SILENT <span className="text-[var(--gold)]">PEAK</span> TRAIL
              </h3>
            </div>

            {/* Right: Description + socials */}
            <div className="flex flex-col items-center lg:items-start gap-6">
              <p className="text-sm leading-relaxed text-blue-100/60 max-w-sm">
                Beautifully Curated Journeys to Ladakh. We craft extraordinary journeys into the Himalayas — guided by people who call these mountains home.
              </p>
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition-all hover:bg-[var(--gold)] hover:scale-110 active:scale-95 ring-1 ring-white/10"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-8 sm:col-span-2 lg:col-span-3 lg:grid-cols-3 ">
            {/* Tour Packages */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)] pl-5 lg:pl-0">Tour Packages</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS[0].links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="flex items-center text-sm font-medium text-blue-100/60 transition-colors hover:text-white group relative pl-5 lg:pl-0"
                    >
                      <ArrowRight size={12} className="absolute left-0 lg:-left-5 top-1/2 -translate-y-1/2 text-[var(--gold)] opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links & Helpful Info */}
            {FOOTER_LINKS.slice(1).map((column) => (
              <div key={column.title} className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)] pl-5 lg:pl-0">
                  {column.title}
                </h4>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="flex items-center text-sm font-medium text-blue-100/60 transition-colors hover:text-white group relative pl-5 lg:pl-0"
                      >
                        <ArrowRight size={12} className="absolute left-0 lg:-left-5 top-1/2 -translate-y-1/2 text-[var(--gold)] opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 flex flex-col items-center justify-between border-t border-white/10 pt-12 lg:flex-row">
          <p className="text-xs font-medium text-blue-100/40">
            © {currentYear} <span className="text-blue-100/80">Silent Peak Trail</span> — All rights reserved. Leh, Ladakh, India.
          </p>
          <p className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-100/40 lg:mt-0">
            Made with <Heart size={10} className="fill-rose-500 text-rose-500" /> for the Himalayas
          </p>
        </div>
      </div>
    </footer>
  );
}
