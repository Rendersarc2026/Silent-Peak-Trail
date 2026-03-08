"use client";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  MessageCircle,
  Heart,
  ArrowRight,
} from "lucide-react";
import { cn, smoothScroll } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const PLATFORM_ICONS: Record<string, any> = {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Whatsapp: MessageCircle,
  Custom: Globe,
};

interface FooterProps {
  className?: string;
  homepageData?: Record<string, string>;
  packages?: any[];
}

export default function Footer({ className, homepageData, packages }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const router = useRouter();

  const socialLinksRaw = homepageData?.socialLinks;
  let socialLinks = [];
  try {
    socialLinks = socialLinksRaw ? JSON.parse(socialLinksRaw) : [];
  } catch (e) {
    console.error("Failed to parse social links", e);
  }

  // Fallback if no social links
  if (socialLinks.length === 0) {
    socialLinks = [
      { platform: "Instagram", url: "https://www.instagram.com/silentpeaktrail" },
      { platform: "Facebook", url: "https://www.facebook.com/silentpeaktrail" },
    ];
  }

  // Dynamic package links (first 4 packages)
  const packageLinks = (packages || [])
    .slice(0, 4)
    .map(pkg => ({
      label: pkg.name,
      href: `/packages/${pkg.slug}`
    }));

  // Fallback if no packages
  if (packageLinks.length === 0) {
    packageLinks.push(
      { label: "Nubra & Pangong Escape", href: "/packages/nubra-pangong-escape" },
      { label: "Stargazing Expedition", href: "/packages/stargazing-expedition" }
    );
  }
  packageLinks.push({ label: "Custom / Not Sure", href: "#contact" });

  const footerLinks = [
    { title: "Tour Packages", links: packageLinks },
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
        { label: "Reviews", href: "/#testimonials" },
        { label: "Best Package", href: "/#stargazing" },
        { label: "Best Season", href: "/#contact" },
        { label: "Contact Support", href: "#contact" }
      ]
    }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;

    if (pathname !== "/") {
      e.preventDefault();
      router.push("/" + href);
    } else {
      smoothScroll(e, href);
    }
  };

  return (
    <footer className={cn("bg-[var(--navy)] pt-12 pb-12 text-white overflow-hidden", className)} style={{ fontFamily: "'Montserrat', sans-serif" }}>
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
              <h3 className="text-xl tracking-tight uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span className="font-medium text-blue-100/60">Silent</span>
                <span className="font-medium text-white mx-1.5">Peak</span>
                <span className="font-medium text-blue-100/60">Trail</span>
              </h3>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-6">
              <p className="text-sm leading-relaxed text-blue-100/60 max-w-sm">
                {homepageData?.footerDescription || "Beautifully Curated Journeys to Ladakh. We craft extraordinary journeys into the Himalayas — guided by people who call these mountains home."}
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social: any, i: number) => {
                  const Icon = PLATFORM_ICONS[social.platform] || Globe;
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition-all hover:bg-[var(--gold)] hover:scale-110 active:scale-95 ring-1 ring-white/10"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-8 sm:col-span-2 lg:col-span-3 lg:grid-cols-3 ">
            {footerLinks.map((column) => (
              <div key={column.title} className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)] pl-5 lg:pl-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
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
