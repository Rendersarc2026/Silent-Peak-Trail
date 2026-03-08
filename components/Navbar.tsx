"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { smoothScroll, cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "#packages", label: "Packages" },
  { href: "#destinations", label: "Destinations" },
  { href: "#gallery", label: "Gallery" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ homepageData }: { homepageData?: Record<string, string> }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const bookText = homepageData?.bookButtonText || "Book a Trip";
  const mobileBookText = homepageData?.bookButtonText || "Book Your Soul Trip";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navClass = cn(
    "fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between transition-all duration-300 px-5 lg:px-[60px] bg-white/96 backdrop-blur-md shadow-sm border-b border-[#cddaee]",
    scrolled ? "py-4" : "py-5"
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== "/") {
      e.preventDefault();
      router.push("/" + href);
      setOpen(false);
    } else {
      smoothScroll(e, href);
      setOpen(false);
    }
  };

  return (
    <>
      <nav className={navClass}>
        {/* Logo */}
        <Link
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          href="/"
          className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
        >
          <img src="/logo.jpg" alt="Silent Peak Trail" className="h-11 w-11 rounded-full object-cover shadow-sm ring-1 ring-slate-100" />
          <span className="text-xl tracking-tight uppercase">
            <span className="font-medium text-slate-500">Silent</span>
            <span className="font-medium text-[var(--navy)] mx-1.5">Peak</span>
            <span className={cn(
              "font-medium",
              scrolled ? "text-blue-800" : "text-slate-500"
            )}>Trail</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className="text-sm font-bold uppercase tracking-widest transition-all hover:text-[var(--blue)] text-[var(--navy)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className={cn(
              "hidden items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 sm:flex",
              scrolled
                ? "bg-[var(--navy)] text-[var(--white)] shadow-lg hover:bg-[var(--gold)] hover:text-white"
                : "bg-white text-[var(--navy)] hover:bg-[var(--gold)] hover:text-white"
            )}
          >
            {bookText}
            <ArrowRight size={14} strokeWidth={3} />
          </a>

          <button
            className="rounded-full p-2 transition-colors lg:hidden text-[var(--navy)] hover:bg-slate-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-[72px] z-50 bg-white p-8 transition-all duration-500 lg:hidden border-t border-slate-100",
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNavClick(e, l.href)}
              className="text-lg font-bold uppercase tracking-[0.2em] text-[var(--navy)] transition-colors hover:text-[var(--gold)]"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[var(--navy)] py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg active:scale-95 transition-transform mt-4"
          >
            {mobileBookText}
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </>
  );
}
