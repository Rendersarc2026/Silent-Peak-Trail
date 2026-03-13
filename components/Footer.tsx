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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const WhatsappIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const PLATFORM_ICONS: Record<string, any> = {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Whatsapp: WhatsappIcon,
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

  // Dynamic package links (first 10 packages)
  const packageLinks = (packages || [])
    .slice(0, 10)
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
        { label: "Contact Us", href: "#contact" }
      ]
    },
    {
      title: "Helpful Info",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Reviews", href: "/#testimonials" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms-and-conditions" }
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
              <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
                <img
                  src="/logo.jpg"
                  alt="Silent Peak Trail"
                  className="h-28 w-28 rounded-full object-cover shadow-2xl ring-2 ring-white/10"
                />
              </Link>
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
