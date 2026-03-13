"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#f7f9fc] text-[#1a1a2e]">
            <Navbar />

            <main className="pt-[72px]">
                {/* TOP BAR / BREADCRUMB */}
                <div className="bg-[#0f2a4a] py-3 border-b border-white/5">
                    <div className="container mx-auto px-6 lg:px-[90px] flex items-center gap-3 text-[13px]">
                        <Link href="/" className="text-white/50 hover:text-white transition-colors">
                            Silent Peak Trail
                        </Link>
                        <ChevronRight size={12} className="text-white/20" />
                        <span className="text-white/85">Privacy Policy</span>
                    </div>
                </div>

                {/* PAGE HEADER */}
                <div className="bg-white border-b border-[#e8edf4] py-8 md:py-16">
                    <div className="container mx-auto px-6 md:px-12 lg:px-[90px]">
                        <div className="max-w-4xl">
                            <h1 className="font-['DM_Sans',_sans-serif] text-[clamp(24px,5vw,32px)] md:text-[clamp(32px,5vw,48px)] font-bold text-[#0f2a4a] mb-3 md:mb-4">
                                Privacy Policy
                            </h1>
                            <div className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#8aabce] font-medium">
                                <Clock size={14} />
                                <span>Last updated: March 2026</span>
                                <span className="mx-1">·</span>
                                <span>Silent Peak Trail</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="container mx-auto px-6 md:px-12 lg:px-[100px] py-10 md:py-16">
                    <div className="max-w-6xl space-y-6 md:space-y-8">
                        {/* INTRO */}
                        <div className="bg-[#eef4fb] border-l-4 border-[#4a8fd4] p-5 md:p-8 rounded-r-2xl mb-8 md:mb-12 text-sm md:text-[18px] text-[#3a5a7a] leading-relaxed">
                            Silent Peak Trail is committed to your privacy. We collect only what is necessary to plan your journey and <strong className="text-[#0f2a4a] font-bold">never sell your data or share it for advertising.</strong>
                        </div>

                        <div className="space-y-8">
                            {/* SECTION 01 */}
                            <section className="relative">
                                <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">01</div>
                                <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Information We Collect</h2>
                                <p className="text-[#444] font-light leading-relaxed mb-5 md:mb-6 text-sm md:text-[18px]">
                                    When you book a tour, enquire about a package, or communicate with us, we collect certain personal information. This includes:
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        { label: "Identity & Contact", desc: "Names, passport details, nationality, and contact info for permits and bookings." },
                                        { label: "Health & Emergency", desc: "Relevant medical details you share for safety, and your emergency contact person." },
                                        { label: "Payment Details", desc: "Billing info processed securely; we do not store card numbers on our servers." },
                                        { label: "Technical Data", desc: "Anonymised usage information collected via essential website cookies." },
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-3 md:gap-4 pb-4 border-b border-gray-100 last:border-0 group">
                                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4a8fd4] rounded-full mt-2 md:mt-2 flex-shrink-0"></span>
                                            <p className="text-sm md:text-[18px] font-light text-[#444] leading-relaxed">
                                                <strong className="text-[#1a1a2e] font-bold">{item.label}</strong> — {item.desc}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <hr className="border-[#e8edf4]" />

                            {/* SECTION 02 */}
                            <section>
                                <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">02</div>
                                <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">How We Use Your Information</h2>
                                <ul className="space-y-3">
                                    {[
                                        { label: "Logistics", desc: "To arrange permits, accommodation, transport, and guides." },
                                        { label: "Safety", desc: "To maintain medical info for emergency response if needed." },
                                        { label: "Communications", desc: "To send itinerary updates, receipts, and pre-departure info." },
                                        { label: "Legal", desc: "To meet Indian tourism regulations for restricted zones." },
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-3 md:gap-4 pb-4 border-b border-gray-100 last:border-0">
                                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4a8fd4] rounded-full mt-2 md:mt-2 flex-shrink-0"></span>
                                            <p className="text-sm md:text-[18px] font-light text-[#444] leading-relaxed">
                                                <strong className="text-[#1a1a2e] font-bold">{item.label}</strong> — {item.desc}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <hr className="border-[#e8edf4]" />

                            {/* SECTION 03 */}
                            <section>
                                <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">03</div>
                                <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Information Sharing & Third Parties</h2>
                                <p className="text-[#444] font-light leading-relaxed mb-5 md:mb-6 text-sm md:text-[16px]">
                                    We never sell, rent, or trade your personal information. We share limited information only with partners required to deliver your journey:
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        { label: "Local accommodation providers", desc: "receive your name, arrival date, and dietary requirements." },
                                        { label: "Permit authorities", desc: "government bodies require passport details for Inner Line Permits and national park entry." },
                                        { label: "Payment processors", desc: "PCI-DSS compliant gateways process your billing information securely." },
                                        { label: "Emergency services", desc: "in the event of a medical emergency, relevant information may be shared with hospitals or rescue services." },
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-3 md:gap-4 pb-4 border-b border-gray-100 last:border-0">
                                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4a8fd4] rounded-full mt-2 md:mt-2 flex-shrink-0"></span>
                                            <p className="text-sm md:text-[18px] font-light text-[#444] leading-relaxed">
                                                <strong className="text-[#1a1a2e] font-bold">{item.label}</strong> — {item.desc}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <hr className="border-[#e8edf4]" />

                            {/* SECTION 04 */}
                            <section>
                                <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">04</div>
                                <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Data Retention & Storage</h2>
                                <p className="text-[#444] font-light leading-relaxed text-sm md:text-[18px]">
                                    Booking records are kept for seven years per Indian financial laws. Health data is deleted within 90 days of trip completion. Your data is stored on secure servers in India with strictly authorised access.
                                </p>
                            </section>

                            <hr className="border-[#e8edf4]" />

                            {/* SECTION 05 */}
                            <section>
                                <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">05</div>
                                <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Your Rights</h2>
                                <ul className="space-y-4">
                                    {[
                                        { label: "Access & Correction", desc: "Request a copy of your data or correction of inaccurate info." },
                                        { label: "Deletion", desc: "Request deletion of your data, subject to legal obligations." },
                                        { label: "Consent", desc: "Withdraw consent for communications at any time." },
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-3 md:gap-4 pb-4 border-b border-gray-100 last:border-0">
                                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4a8fd4] rounded-full mt-2 md:mt-2 flex-shrink-0"></span>
                                            <p className="text-sm md:text-[18px] font-light text-[#444] leading-relaxed">
                                                <strong className="text-[#1a1a2e] font-bold">{item.label}</strong> — {item.desc}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                            </section>

                            <hr className="border-[#e8edf4]" />

                            {/* SECTION 06 */}
                            <section>
                                <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">06</div>
                                <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Cookies</h2>
                                <p className="text-[#444] font-light leading-relaxed text-sm md:text-[18px]">
                                    Our website uses a minimal set of cookies — essential cookies required for the site to function, and anonymised analytics cookies. We do not use advertising cookies. You may disable analytics cookies through your browser settings without affecting your use of the site.
                                </p>
                            </section>

                            <hr className="border-[#e8edf4]" />

                            {/* SECTION 07 */}
                            <section>
                                <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">07</div>
                                <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Changes to This Policy</h2>
                                <p className="text-[#444] font-light leading-relaxed text-sm md:text-[18px]">
                                    We may update this policy from time to time. When we make material changes, we will notify active customers by email and update the date above.
                                </p>
                            </section>

                            {/* CONTACT CARD */}
                            <div className="bg-white border border-[#e8edf4] rounded-2xl p-8 md:p-10 shadow-sm mt-12 group hover:shadow-md transition-shadow">
                                <h3 className="font-['DM_Sans',_sans-serif] text-xl font-bold text-[#0f2a4a] mb-3">Questions About Your Privacy?</h3>
                                <p className="text-sm text-gray-500 mb-8 font-light leading-relaxed">
                                    Reach out to our team directly — we&apos;re happy to help.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-sm text-[#444] group-hover:text-[#0f2a4a] transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-[#f0f4f9] flex items-center justify-center text-[#4a8fd4]">
                                            <Mail size={16} />
                                        </div>
                                        <span className="font-medium">silentpeaktrails@gmail.com</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-[#444] group-hover:text-[#0f2a4a] transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-[#f0f4f9] flex items-center justify-center text-[#4a8fd4]">
                                            <Phone size={16} />
                                        </div>
                                        <span className="font-medium">+91 9103530443</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-[#444] group-hover:text-[#0f2a4a] transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-[#f0f4f9] flex items-center justify-center text-[#4a8fd4]">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="font-medium">Fort Road, Leh, Ladakh — 194101, India</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
