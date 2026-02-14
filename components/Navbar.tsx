"use client";
import { useState, useEffect } from "react";

const LINKS = [
  { href: "#packages",     label: "Packages" },
  { href: "#destinations", label: "Destinations" },
  { href: "#gallery",      label: "Gallery" },
  { href: "#about",        label: "About" },
  { href: "#contact",      label: "Contact" },
];

function smoothScroll(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav id="navbar" className={scrolled ? "scrolled" : ""}>
      <a href="#" className="logo">Silent Peak <span>Trail</span></a>

      <ul className="nav-links">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              onClick={(e) => { e.preventDefault(); smoothScroll(l.href); }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="nav-btn"
        onClick={(e) => { e.preventDefault(); smoothScroll("#contact"); }}
      >
        Book a Trip
      </a>

      <button className="hamburger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
        <span /><span /><span />
      </button>

      <div className={`mobile-menu${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => { e.preventDefault(); smoothScroll(l.href); setOpen(false); }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          className="nav-btn"
          onClick={(e) => { e.preventDefault(); smoothScroll("#contact"); setOpen(false); }}
        >
          Book a Trip
        </a>
      </div>
    </nav>
  );
}
