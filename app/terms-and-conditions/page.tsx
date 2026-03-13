import React from "react";
import dbConnect from "@/lib/db";
import Homepage from "@/lib/models/Homepage";
import Package from "@/lib/models/Package";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Clock, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TermsAndConditions() {
    await dbConnect();

    const [settingsRecords, packages] = await Promise.all([
        Homepage.find().lean(),
        Package.find({ isActive: true }).sort({ createdAt: 1 }).lean(),
    ]);

    const homepageData: Record<string, string> = {};
    settingsRecords.forEach((s: any) => { homepageData[s.key] = s.value; });

    const packagesData = packages.map((p: any) => ({
        id: String(p._id),
        name: p.name,
        slug: p.slug,
    }));

    const safeHomepageData = JSON.parse(JSON.stringify(homepageData));

    return (
        <div className="min-h-screen bg-[#f7f9fc] text-[#1a1a2e]">
            <Navbar homepageData={safeHomepageData} />

            <main className="pt-[72px]">
                {/* TOP BAR / BREADCRUMB */}
                <div className="bg-[#0f2a4a] py-3 border-b border-white/5">
                    <div className="container mx-auto px-6 lg:px-[100px] flex items-center gap-3 text-[13px]">
                        <Link href="/" className="text-white/50 hover:text-white transition-colors">
                            Silent Peak Trail
                        </Link>
                        <ChevronRight size={12} className="text-white/20" />
                        <span className="text-white/85">Terms & Conditions</span>
                    </div>
                </div>

                {/* PAGE HEADER */}
                <div className="bg-white border-b border-[#e8edf4] py-8 md:py-16">
                    <div className="container mx-auto px-6 md:px-12 lg:px-[100px]">
                        <div className="max-w-6xl">
                            <h1 className="font-['DM_Sans',_sans-serif] text-[clamp(24px,5vw,32px)] md:text-[clamp(32px,5vw,48px)] font-bold text-[#0f2a4a] mb-3 md:mb-4">
                                Terms &amp; Conditions
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
                    <div className="max-w-6xl space-y-8 md:space-y-12">
                        {/* INTRO */}
                        <div className="bg-[#eef4fb] border-l-4 border-[#4a8fd4] p-5 md:p-8 rounded-r-2xl mb-8 md:mb-12 text-sm md:text-[18px] text-[#3a5a7a] leading-relaxed">
                            These Terms govern all bookings with <strong className="text-[#0f2a4a] font-bold">Silent Peak Trail</strong>. By booking or making a payment, you agree to these terms in full for yourself and your group participants.
                        </div>

                        {/* SECTION 01 */}
                        <section>
                            <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">01</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Bookings &amp; Confirmation</h2>
                            <p className="text-sm md:text-[18px] font-light text-black leading-relaxed mb-6">
                                Bookings are confirmed only after we receive a <strong className="text-[#0f2a4a] font-bold">30% non-refundable deposit</strong> and issue email confirmation. The balance is due 45 days before departure. For bookings within 45 days, full payment is due immediately.
                            </p>
                            <p className="text-sm md:text-[18px] font-light text-black leading-relaxed">
                                Guests must provide accurate names, passport details, health disclosures, and dietary requirements at the time of booking.
                            </p>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 02 */}
                        <section>
                            <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">02</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Cancellations &amp; Refunds</h2>
                            <p className="text-sm md:text-[18px] font-light text-black leading-relaxed mb-6">
                                All cancellations must be submitted in writing to <strong className="text-[#0f2a4a] font-bold">silentpeaktrails@gmail.com</strong>. The following fees apply based on notice received:
                            </p>
                            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 mb-6 font-['Lato',_sans-serif]">
                                <table className="w-full border-collapse text-sm md:text-[18px] min-w-[500px]">
                                    <thead>
                                        <tr>
                                            <th className="text-left py-3 px-4 font-bold text-[#4a8fd4] text-[12px] md:text-[11px] tracking-[0.08em] uppercase border-b-2 border-[#dde8f5] bg-[#f0f6ff]">Notice Before Departure</th>
                                            <th className="text-left py-3 px-4 font-bold text-[#4a8fd4] text-[12px] md:text-[11px] tracking-[0.08em] uppercase border-b-2 border-[#dde8f5] bg-[#f0f6ff]">Cancellation Fee</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { notice: "60 days or more", fee: "Loss of deposit (30%)" },
                                            { notice: "45 – 59 days", fee: "50% of total trip cost" },
                                            { notice: "30 – 44 days", fee: "75% of total trip cost" },
                                            { notice: "Less than 30 days", fee: "100% — no refund" },
                                            { notice: "No show", fee: "100% — no refund" },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-2.5 md:py-3 px-4 text-black">{row.notice}</td>
                                                <td className="py-2.5 md:py-3 px-4 text-black font-medium">{row.fee}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm md:text-[18px] font-light text-black leading-relaxed">
                                Refunds, where applicable, are processed within 14 business days to the original payment method.
                            </p>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 03 */}
                        <section>
                            <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">03</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Itinerary Changes &amp; Force Majeure</h2>
                            <p className="text-sm md:text-[18px] font-light text-black leading-relaxed">
                                We reserve the right to modify itineraries for safety or legal compliance. No refunds are issued for delays or changes caused by force majeure, including extreme weather, government directives, or natural disasters. <strong className="text-[#0f2a4a] font-bold">Comprehensive travel insurance is mandatory.</strong>
                            </p>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 04 */}
                        <section>
                            <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">04</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Health, Fitness &amp; Altitude Risk</h2>
                            <p className="text-sm md:text-[18px] font-light text-black leading-relaxed mb-6">
                                Trekking in Ladakh involves physical exertion at high altitude. <strong className="text-[#0f2a4a] font-bold">High altitude sickness is a genuine and potentially life-threatening condition</strong> that can affect anyone regardless of age or fitness. By booking with us, you confirm that:
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "You are in good general health and have disclosed all relevant medical conditions on your booking form.",
                                    "You have consulted a physician if you have any history of heart, respiratory, or blood pressure conditions.",
                                    "You accept that our guides have final authority on safety decisions, including halting or modifying your trek.",
                                    "You understand that emergency helicopter evacuation, where available, is at your own cost unless covered by insurance.",
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 md:gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4a8fd4] rounded-full mt-2 md:mt-2 flex-shrink-0"></span>
                                        <p className="text-sm md:text-[18px] font-light text-black leading-relaxed">{item}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="note-box bg-[#f0f6ff] border border-[#dde8f5] rounded-2xl p-5 md:p-6 mt-6 text-sm md:text-[18px] text-[#3a5a7a] leading-relaxed">
                                <strong className="text-[#0f2a4a]">Note:</strong> Guides carry oxygen and first aid. In emergencies, our priority is stabilisation and evacuation to the nearest hospital.
                            </div>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 05 */}
                        <section>
                            <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">05</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Travel Insurance &amp; Liability</h2>
                            <p className="text-sm md:text-[18px] font-light text-black leading-relaxed">
                                <strong className="text-[#0f2a4a] font-bold">Comprehensive travel insurance is mandatory.</strong> We are not liable for personal property loss, injuries outside the itinerary, or flight delays. Our maximum liability is limited to the total amount paid for the booking.
                            </p>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 06 */}
                        <section>
                            <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">06</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Guest Responsibilities &amp; Conduct</h2>
                            <ul className="space-y-4">
                                {[
                                    "Environmental responsibility — Leave No Trace principles.",
                                    "Cultural sensitivity — dress modestly and respect local customs.",
                                    "Guide Authority — focus on safety; instructions are final.",
                                    "Conduct — disruptive behaviour may result in removal without refund.",
                                    "Legal — carrying illegal substances results in immediate termination.",
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 md:gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4a8fd4] rounded-full mt-2 md:mt-2 flex-shrink-0"></span>
                                        <p className="text-sm md:text-[18px] font-light text-black leading-relaxed">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 07 */}
                        <section>
                            <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">07</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Photography &amp; Intellectual Property</h2>
                            <p className="text-sm md:text-[18px] font-light text-black leading-relaxed mt-2">
                                We retain all rights to our website and marketing content. By sharing photos featuring our branding, you grant us a non-exclusive license to reshare with credit. Notify your guide if you prefer not to appear in marketing materials.
                            </p>
                        </section>

                        <hr className="border-[#e8edf4]" />

                        {/* SECTION 08 */}
                        <section>
                            <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-2 md:mb-3">08</div>
                            <h2 className="font-['DM_Sans',_sans-serif] text-[20px] md:text-2xl font-bold text-[#0f2a4a] mb-4 md:mb-6">Governing Law &amp; Disputes</h2>
                            <p className="text-sm md:text-[18px] font-light text-black leading-relaxed mt-2">
                                These terms are governed by Indian law. Unresolved disputes will be referred to arbitration in Leh, Ladakh. This does not affect your statutory consumer rights.
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

            <Footer homepageData={safeHomepageData} packages={packagesData} />
        </div>
    );
}

