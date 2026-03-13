"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Clock, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-[#f7f9fc] text-[#1a1a2e]">
            <Navbar />

            <main className="pt-[72px]">
                {/* TOP BAR / BREADCRUMB */}
                <div className="bg-[#0f2a4a] py-4 border-b border-white/5">
                    <div className="container mx-auto px-6 lg:px-[60px] flex items-center gap-3 text-[13px]">
                        <Link href="/" className="text-white/50 hover:text-white transition-colors">
                            Silent Peak Trail
                        </Link>
                        <ChevronRight size={12} className="text-white/20" />
                         <span className="text-white/85">Terms & Conditions</span>
                    </div>
                </div>

                {/* PAGE HEADER */}
                <div className="bg-white border-b border-[#e8edf4] py-16">
                    <div className="container mx-auto px-6 lg:px-[100px]">
                        <div className="max-w-6xl">
                            <h1 className="font-['DM_Sans',_sans-serif] text-[clamp(32px,5vw,48px)] font-bold text-[#0f2a4a] mb-4">
                                Terms &amp; Conditions
                            </h1>
                            <div className="flex items-center gap-2 text-[13px] text-[#8aabce] font-medium">
                                <Clock size={14} />
                                <span>Last updated: March 2026</span>
                                <span className="mx-1">·</span>
                                <span>Silent Peak Trail</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="container mx-auto px-60 lg:px-[100px] py-16">
                    <div className="max-w-6xl space-y-8">
                        {/* INTRO */}
                        <div className="bg-[#eef4fb] border-l-4 border-[#4a8fd4] p-6 md:p-8 rounded-r-2xl mb-16 text-[18px] text-[#3a5a7a] leading-relaxed">
                            These Terms and Conditions govern all bookings made with <strong className="text-[#0f2a4a] font-bold">Silent Peak Trail</strong> By making a booking or payment, you confirm that you have read, understood, and agreed to these terms in full — on behalf of yourself and all participants in your group.
                        </div>

                        {/* SECTION 01 */}
                        <section>
                            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-3">01</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-2xl font-bold text-[#0f2a4a] mb-6">Bookings &amp; Confirmation</h2>
                            <p className="text-[18px] font-light text-black leading-relaxed mb-6">
                                A booking is confirmed only once Silent Peak Trail has received the required deposit and issued a written confirmation by email. Until both conditions are met, your preferred dates remain subject to availability.
                            </p>
                            <p className="text-[18px] font-light text-black leading-relaxed mb-6">
                                <strong className="text-[#0f2a4a] font-bold">A non-refundable deposit of 30% of the total trip cost</strong> is required to secure your booking. The remaining balance must be paid in full no later than 45 days before departure. For bookings made within 45 days of departure, full payment is due immediately.
                            </p>
                            <p className="text-[18px] font-light text-black leading-relaxed">
                                It is your responsibility to ensure all information provided at booking — names, passport details, health disclosures, dietary requirements — is accurate and complete.
                            </p>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 02 */}
                        <section>
                            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-3">02</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-2xl font-bold text-[#0f2a4a] mb-6">Cancellations &amp; Refunds</h2>
                            <p className="text-[18px] font-light text-black leading-relaxed mb-6">
                                All cancellations must be submitted in writing to <strong className="text-[#0f2a4a] font-bold">silentpeaktrails@gmail.com</strong>. The following fees apply based on notice received:
                            </p>
                            <table className="w-full border-collapse mb-6 text-[18px]">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 font-bold text-[#4a8fd4] text-[11px] tracking-[0.08em] uppercase border-b-2 border-[#dde8f5] bg-[#f0f6ff]">Notice Before Departure</th>
                                        <th className="text-left py-2 font-bold text-[#4a8fd4] text-[11px] tracking-[0.08em] uppercase border-b-2 border-[#dde8f5] bg-[#f0f6ff]">Cancellation Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2 text-black">60 days or more</td>
                                        <td className="py-2 text-black">Loss of deposit (30%)</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-black">45 – 59 days</td>
                                        <td className="py-2 text-black">50% of total trip cost</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-black">30 – 44 days</td>
                                        <td className="py-2 text-black">75% of total trip cost</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-black">Less than 30 days</td>
                                        <td className="py-2 text-black">100% — no refund</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-black">No show</td>
                                        <td className="py-2 text-black">100% — no refund</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-[18px] font-light text-black leading-relaxed">
                                Refunds, where applicable, are processed within 14 business days to the original payment method.
                            </p>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 03 */}
                        <section>
                            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-3">03</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-2xl font-bold text-[#0f2a4a] mb-6">Itinerary Changes &amp; Force Majeure</h2>
                            <p className="text-[18px] font-light text-black leading-relaxed mb-6">
                                Silent Peak Trails reserves the right to modify any itinerary where necessary for the safety, well-being, or legal compliance of guests and staff. We will make every reasonable effort to provide an equivalent alternative.
                            </p>
                            <p className="text-[18px] font-light text-black leading-relaxed mb-6">
                                No cash refund will be issued for modifications arising from circumstances beyond our control, including extreme weather, government directives, natural disasters, public health emergencies, or political unrest.
                            </p>
                            <p className="text-[18px] font-light text-black leading-relaxed">
                                We strongly recommend all guests purchase comprehensive travel insurance that includes trip interruption and emergency evacuation cover.
                            </p>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 04 */}
                        <section>
                            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-3">04</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-2xl font-bold text-[#0f2a4a] mb-6">Health, Fitness &amp; Altitude Risk</h2>
                            <p className="text-[18px] font-light text-black leading-relaxed mb-6">
                                Trekking in Ladakh involves physical exertion at high altitude. <strong className="text-[#0f2a4a] font-bold">High altitude sickness is a genuine and potentially life-threatening condition</strong> that can affect anyone regardless of age or fitness. By booking with us, you confirm that:
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "You are in good general health and have disclosed all relevant medical conditions on your booking form.",
                                    "You have consulted a physician if you have any history of heart, respiratory, or blood pressure conditions.",
                                    "You accept that our guides have final authority on safety decisions, including halting or modifying your trek.",
                                    "You understand that emergency helicopter evacuation, where available, is at your own cost unless covered by insurance.",
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        <span className="w-2 h-2 bg-[#4a8fd4] rounded-full mt-2 flex-shrink-0"></span>
                                        <p className="text-[18px] font-light text-black leading-relaxed">{item}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="note-box bg-[#f0f6ff] border border-[#dde8f5] rounded-2xl p-6 mt-6 text-[18px] text-[#3a5a7a] leading-relaxed">
                                <strong className="text-[#0f2a4a]">Note:</strong> Our guides carry supplemental oxygen and altitude medication and are trained in Wilderness First Response. However, we are not a medical service. In emergencies, our priority is stabilisation and evacuation to the nearest appropriate facility.
                            </div>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 05 */}
                        <section>
                            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-3">05</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-2xl font-bold text-[#0f2a4a] mb-6">Travel Insurance &amp; Liability</h2>
                            <p className="text-[18px] font-light text-black leading-relaxed mb-6">
                                <strong className="text-[#0f2a4a] font-bold">Comprehensive travel insurance is mandatory for all guests.</strong> Your policy must cover medical expenses, emergency evacuation and repatriation, and trip cancellation. We recommend a policy that specifically covers high-altitude trekking.</p>
                            <p className="text-[18px] font-light text-black leading-relaxed">
                                Silent Peak Trails is not liable for loss or damage to personal property, injury arising from activities outside your booked itinerary, flight delays or cancellations, or any indirect or consequential losses. Our maximum liability for any claim shall not exceed the total amount paid for the relevant booking.
                            </p>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 06 */}
                        <section>
                            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-3">06</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-2xl font-bold text-[#0f2a4a] mb-6">Guest Responsibilities &amp; Conduct</h2>
                            <ul className="space-y-4">
                                {[
                                    "Environmental responsibility — carry all non-biodegradable waste out of wilderness areas and respect Leave No Trace principles.",
                                    "Cultural sensitivity — dress modestly at monasteries and villages, ask permission before photographing people, and respect local customs.",
                                    "Compliance with guide instructions — your guide's authority on safety matters is final. Refusal to comply may result in removal from the trek without refund.",
                                    "Conduct toward others — behaviour that is disruptive or offensive toward other guests or staff may result in immediate removal without compensation.",
                                    "Legal compliance — you are responsible for obtaining all required permits and visas. Carrying illegal substances is grounds for immediate termination of your booking without refund.",
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        <span className="w-2 h-2 bg-[#4a8fd4] rounded-full mt-2 flex-shrink-0"></span>
                                        <p className="text-[18px] font-light text-black leading-relaxed">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 07 */}
                        <section>
                            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-3">07</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-2xl font-bold text-[#0f2a4a] mb-6">Photography &amp; Intellectual Property</h2>
                            <p className="text-[18px] font-light text-black leading-relaxed mb-6">
                                Silent Peak Trails retains all rights to our website content, itinerary documents, and marketing materials. You may not reproduce or commercially exploit our content without prior written consent.
                            </p>
                            <p className="text-[18px] font-light text-black leading-relaxed">
                                If you share photographs publicly that feature Silent Peak Trails branding or staff, you grant us a non-exclusive licence to reshare with appropriate credit. If you do not wish your photographs to be reshared, please inform us at the time of sharing. If you do not wish to appear in our marketing materials, notify your guide at the start of your tour.
                            </p>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 08 */}
                        <section>
                            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-3">08</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-2xl font-bold text-[#0f2a4a] mb-6">Governing Law &amp; Disputes</h2>
                            <p className="text-[18px] font-light text-black leading-relaxed mb-6">
                                These terms are governed by the laws of India. Disputes shall first be subject to good-faith negotiation. If unresolved within 30 days, matters will be referred to arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration in Leh, Ladakh.
                            </p>
                            <p className="text-[18px] font-light text-black leading-relaxed">
                                These terms do not affect any statutory rights you may have under consumer protection law in your country of residence.
                            </p>
                        </section>

                        {/* CONTACT CARD */}
                        <div className="bg-white border border-[#e8edf4] rounded-2xl p-8 md:p-10 shadow-sm mt-12 group hover:shadow-md transition-shadow">
                            <h3 className="font-['DM_Sans',_sans-serif] text-xl font-bold text-[#0f2a4a] mb-3">Questions About These Terms?</h3>
                            <p className="text-sm text-gray-500 mb-8 font-light leading-relaxed">
                                Please reach out before confirming your booking if anything is unclear.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-black group-hover:text-[#0f2a4a] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-[#f0f4f9] flex items-center justify-center text-[#4a8fd4]">
                                        <Mail size={16} />
                                    </div>
                                    <span className="font-medium">silentpeaktrails@gmail.com</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-black group-hover:text-[#0f2a4a] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-[#f0f4f9] flex items-center justify-center text-[#4a8fd4]">
                                        <Phone size={16} />
                                    </div>
                                    <span className="font-medium">+91 9103530443</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-black group-hover:text-[#0f2a4a] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-[#f0f4f9] flex items-center justify-center text-[#4a8fd4]">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="font-medium">Fort Road, Leh, Ladakh — 194101, India</span>
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

