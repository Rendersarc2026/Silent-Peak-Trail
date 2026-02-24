"use client";
import { useState } from "react";
import type { Settings } from "@/lib/db";
import {
  PhoneCall,
  Mail,
  MapPin,
  Calendar,
  Send,
  CheckCircle2,
  Loader2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  CountryCode as LibCountryCode
} from "libphonenumber-js";

const PACKAGE_OPTIONS = [
  { id: 1, name: "Nubra & Pangong Escape" },
  { id: 2, name: "Stargazing Expedition" },
  { id: 3, name: "Sham Valley Trek" },
  { id: 4, name: "Markha Valley Trek" },
  { id: 5, name: "Manali–Leh Moto Expedition" },
  { id: 6, name: "Custom / Not Sure Yet" }
];

const TRAVELLER_OPTIONS = [
  "1 Person",
  "2 People",
  "3–5 People",
  "6–10 People",
  "10+ (Group)"
];

const MONTH_OPTIONS = [
  "January (Chadar)",
  "February (Winter)",
  "March (Snow)",
  "April (Spring)",
  "May (Pre-Peak)",
  "June (Peak)",
  "July (Peak)",
  "August (Monsoon)",
  "September (Colors)",
  "October (Quiet)",
  "November (Pre-Winter)",
  "December (Cold)"
];

const BUDGET_OPTIONS = [
  "Under ₹30,000",
  "₹30,000 – ₹50,000",
  "₹50,000 – ₹75,000",
  "₹75,000 – ₹1 Lakh",
  "1 Lakh+"
];

import { useAction } from "@/lib/hooks/useAction";

export default function Booking({
  homepageData,
  packages = [],
  selectedPackage,
  variant = "default"
}: {
  homepageData: Record<string, string>,
  packages?: { id: number | string, name: string }[],
  selectedPackage?: string,
  variant?: "default" | "package"
}) {

  const [sent, setSent] = useState(false);
  const [country, setCountry] = useState<LibCountryCode>("IN");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [handleSubmit, { loading }] = useAction(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const rawBody = Object.fromEntries(
      Array.from(fd.entries()).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );

    setFieldErrors({});

    // 1. Validate phone professionally
    const dialCode = `+${getCountryCallingCode(country)}`;
    const phoneValue = rawBody.phone as string;
    const fullPhone = `${dialCode}${phoneValue}`;

    if (!isValidPhoneNumber(fullPhone, country)) {
      setFieldErrors({ phone: [`Invalid number for ${country}. Please check and try again.`] });
      return;
    }

    // Consolidate body
    const { countryCode, phone, packageId, ...rest } = rawBody;
    const body = {
      ...rest,
      packageId: parseInt(String(packageId), 10),
      phone: fullPhone
    };

    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.details) {
        setFieldErrors(data.details);
      } else {
        alert(data.error || "Failed to submit enquiry.");
      }
      return;
    }

    setSent(true);
    // Redirect to Thank You page
    window.location.href = "/thank-you";
  });

  const countries = getCountries().sort((a, b) => {
    if (a === "IN") return -1;
    if (b === "IN") return 1;
    return a.localeCompare(b);
  });

  const contacts = [
    { icon: PhoneCall, lbl: "Phone & WhatsApp", val: homepageData.phone, color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Mail, lbl: "Email Address", val: homepageData.email, color: "text-amber-600", bg: "bg-amber-50" },
    { icon: MapPin, lbl: "Our Office", val: homepageData.address, color: "text-green-600", bg: "bg-green-50" },
    { icon: Calendar, lbl: "Best Season", val: homepageData.season, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <section
      id="contact"
      className={cn(
        "py-24 px-5 lg:px-[60px] transition-colors duration-500",
        variant === "package" ? "bg-[var(--white)]" : "bg-[var(--bg-subtle)]"
      )}
    >
      <div className="container mx-auto">
        {variant !== "package" && (
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[var(--navy)]">
              <Sparkles size={12} className="text-blue-600" />
              Ready to Go?
            </div>
            <h2 className="mb-6 text-4xl font-black leading-tight tracking-tighter text-[var(--navy)] sm:text-5xl lg:text-6xl">
              Start Planning Your <span className="text-[var(--blue)] italic font-serif">Dream Trip</span>
            </h2>
          </div>
        )}

        <div className={cn("flex flex-col gap-12", variant === "package" ? "items-center" : "lg:flex-row")}>
          {/* Left Column - Contact Info (Hide in minimal variant) */}
          {variant !== "package" && (
            <div className="lg:w-1/3">
              <div className="relative mb-12 h-72 overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-2xl)] animate-fade-in-left">
                <img
                  src={homepageData.heroBgImage || "https://media.istockphoto.com/id/1061972184/photo/landscape-of-snow-mountains-and-mountain-road-to-nubra-valley-in-leh-ladakh-india.jpg?s=612x612&w=0&k=20&c=i0pA6oVMEzUgBLp5V7CblN1wPwOO7A2D3orhfi7HGe4="}
                  alt="Ladakh scenery"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/60 to-transparent" />
              </div>

              <div className="space-y-6">
                {contacts.map((c, i) => (
                  <div key={c.lbl} className="flex items-center gap-5 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-slate-100", c.bg, c.color)}>
                      <c.icon size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)]">{c.lbl}</div>
                      <div className="font-bold text-[var(--navy)]">{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Column - Form */}
          <div className={cn(variant === "package" ? "w-full max-w-3xl" : "lg:w-2/3")}>
            <div className={cn(
              "rounded-[3.5rem] p-8 lg:p-16 animate-fade-in-up transition-all duration-700",
              variant === "package"
                ? "bg-[var(--bg-subtle)] ring-1 ring-slate-100"
                : "bg-[var(--white)] shadow-[var(--shadow-xl)] ring-1 ring-slate-100"
            )}>
              <div className="mb-12 text-center">
                <h3 className="mb-3 text-3xl font-black tracking-tight text-[var(--navy)]">Book Your Journey</h3>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--text-mid)]">
                  Complete the form below and our Ladakh specialists will reach out with a personalized plan.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <FormInput
                    label="First Name"
                    name="firstName"
                    placeholder="Rahul"
                    alphaOnly
                    error={fieldErrors.firstName?.[0]}
                  />
                  <FormInput
                    label="Last Name"
                    name="lastName"
                    placeholder="Sharma"
                    alphaOnly
                    error={fieldErrors.lastName?.[0]}
                  />
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    error={fieldErrors.email?.[0]}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                      <div className="w-24 shrink-0">
                        <div className="space-y-1.5">
                          <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)]">Code</label>
                          <select
                            name="countryCode"
                            value={country}
                            onChange={(e) => setCountry(e.target.value as LibCountryCode)}
                            suppressHydrationWarning
                            className="w-full rounded-2xl border-transparent bg-[var(--bg-subtle)] px-5 py-4 text-xs font-bold text-[var(--navy)] shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-[var(--blue)]/20 focus:border-[var(--blue)] outline-none appearance-none"
                          >
                            {countries.map((c) => (
                              <option key={c} value={c}>
                                {getFlagEmoji(c)} (+{getCountryCallingCode(c)})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex-1">
                        <FormInput
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          placeholder="9876543210"
                          numericOnly
                          maxLength={15}
                          error={fieldErrors.phone?.[0]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <FormSelect
                    label="Preferred Package"
                    name="packageId"
                    options={packages.length > 0 ? (
                      [...packages, { id: 6, name: "Custom / Not Sure Yet" }]
                    ) : PACKAGE_OPTIONS}
                    // defaultValue might need to be resolved from selectedPackage (name)
                    defaultValue={selectedPackage ? (
                      packages.find(p => p.name === selectedPackage)?.id ||
                      PACKAGE_OPTIONS.find(p => p.name === selectedPackage)?.id
                    ) : undefined}
                    error={fieldErrors.packageId?.[0]}
                  />

                  <FormInput
                    label="Number of Travellers"
                    name="travellers"
                    type="number"
                    min="1"
                    placeholder="2"
                    error={fieldErrors.travellers?.[0]}
                  />
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <FormSelect
                    label="Travel Month"
                    name="month"
                    options={MONTH_OPTIONS}
                    error={fieldErrors.month?.[0]}
                  />

                  <FormSelect
                    label="Estimated Budget"
                    name="budget"
                    options={BUDGET_OPTIONS}
                    error={fieldErrors.budget?.[0]}
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-light)]">Your Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Any specific requirements or questions?"
                    maxLength={1000}
                    suppressHydrationWarning
                    className="w-full rounded-[2rem] border-transparent bg-[var(--white)] px-6 py-5 text-sm font-medium text-[var(--navy)] shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-[var(--blue)]/20 focus:border-[var(--blue)] outline-none resize-none"
                  />
                  {fieldErrors.message && <p className="ml-1 mt-1 text-[10px] font-bold text-red-500 animate-pulse">{fieldErrors.message[0]}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading || sent}
                  className={cn(
                    "flex w-full items-center justify-center gap-3 rounded-[2rem] py-6 text-sm font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg",
                    sent ? "bg-green-100 text-green-700" : "bg-[var(--navy)] text-white hover:bg-[var(--blue)]"
                  )}
                >
                  {sent ? <><CheckCircle2 size={20} /> Enquiry Sent!</> : loading ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : <><Send size={20} /> Send Enquiry</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}


function FormInput({ label, variant, alphaOnly, numericOnly, plusAndNumericOnly, error, ...props }: any) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (alphaOnly && !/^[A-Za-z\s]$/.test(e.key) && !["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (numericOnly && !/^[0-9]$/.test(e.key) && !["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (plusAndNumericOnly && !/^[0-9+]$/.test(e.key) && !["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)) {
      e.preventDefault();
      return;
    }
  };

  return (
    <div className="space-y-1.5 flex flex-col items-start w-full">
      <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)]">{label}</label>
      <input
        {...props}
        onKeyDown={handleKeyDown}
        suppressHydrationWarning
        className={cn("w-full rounded-2xl border-transparent bg-[var(--bg-subtle)] px-5 py-4 text-sm font-medium text-[var(--navy)] shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 outline-none", error ? "focus:ring-red-500/20 focus:border-red-500 ring-red-200" : "focus:ring-[var(--blue)]/20 focus:border-[var(--blue)]")}
      />
      {error && <span className="ml-1 text-[10px] font-bold text-red-500 animate-pulse text-left w-full h-auto min-h-[14px] leading-tight break-words">{error}</span>}
    </div>
  );
}


function FormSelect({ label, options, name, defaultValue, variant, required, error }: { label: string, options: (string | { id: string | number, name: string })[], name: string, defaultValue?: string | number, variant?: string, required?: boolean, error?: string }) {
  return (
    <div className="space-y-1.5 flex flex-col items-start w-full">
      <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)]">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue || ""}
        required={required}
        suppressHydrationWarning
        className={cn("w-full rounded-2xl border-transparent bg-[var(--bg-subtle)] px-5 py-4 text-sm font-medium text-[var(--navy)] shadow-sm ring-1 ring-slate-200 focus:ring-2 outline-none appearance-none", error ? "focus:ring-red-500/20 focus:border-red-500 ring-red-200" : "focus:ring-[var(--blue)]/20 focus:border-[var(--blue)]")}
      >
        <option value="">Choose an option</option>
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.id;
          const lbl = typeof o === 'string' ? o : o.name;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
      {error && <span className="ml-1 text-[10px] font-bold text-red-500 animate-pulse text-left w-full h-auto min-h-[14px] leading-tight break-words">{error}</span>}
    </div>
  );
}
