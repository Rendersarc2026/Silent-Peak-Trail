import dbConnect from "@/lib/db";
import Package from "@/lib/models/Package";
import Homepage from "@/lib/models/Homepage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

// Always read fresh data on every request so admin edits show immediately
export const dynamic = "force-dynamic";

export default async function AboutPage() {
    await dbConnect();

    const [settingsRecords, packages] = await Promise.all([
        Homepage.find().lean(),
        Package.find({ isActive: true }).sort({ createdAt: 1 }).lean(),
    ]);

    // Convert settings array to an object
    const homepageData: Record<string, string> = {};
    settingsRecords.forEach((s: any) => { homepageData[s.key] = s.value; });

    const packagesData = packages.map((p: any) => ({
        id: String(p._id),
        name: p.name,
        slug: p.slug,
    }));

    const safeHomepageData = JSON.parse(JSON.stringify(homepageData));

    return (
        <div className="bg-[#0f2a4a] text-white min-h-screen font-['Lato',_sans-serif]">
            <Navbar homepageData={safeHomepageData} transparent={true} />

            <main className="pt-[80px]">
                {/* HERO */}
                <section className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-20 lg:pt-24 pb-20 px-6 overflow-hidden bg-gradient-to-br from-[#0a1f3a] via-[#1a4a8a] to-[#0f2a4a]">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(74,143,212,0.15)_0%,_transparent_70%)]" />

                    <div className="container mx-auto relative z-10 max-w-6xl">
                        <div className="grid grid-cols-12 gap-y-4 md:gap-y-10 gap-x-6 lg:gap-24 items-center">
                            {/* CONTENT COLUMN */}
                            <div className="text-left col-span-7 md:col-span-7 lg:col-span-6 order-1 lg:order-2 lg:flex lg:flex-col lg:justify-center">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 mb-3 md:mb-8 text-[9px] md:text-[11px] font-bold tracking-[0.14em] uppercase text-[#e8913a] bg-[#e8913a]/15 border border-[#e8913a]/40 rounded-full w-fit">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8913a]" />
                                    <span className="hidden sm:inline">About Silent Peak Trail</span>
                                    <span className="sm:hidden">About Us</span>
                                </div>

                                <h1 className="font-['DM_Sans',_sans-serif] text-[32px] min-[375px]:text-[36px] sm:text-[42px] lg:text-[clamp(42px,5.5vw,68px)] font-normal leading-[1.05] tracking-tight text-white mb-2 md:mb-8">
                                    Born from the<br />
                                    <em className="italic font-normal text-[#4a8fd4] not-italic">Mountains Themselves</em>

                                </h1>

                                <p className="hidden md:block text-lg font-light text-white/70 max-w-xl leading-relaxed mb-12">
                                    We are not a travel company that discovered Ladakh. We are Ladakhis who decided to share what we have always known — that these mountains hold something the world has never seen anywhere else.
                                </p>

                                {/* DESKTOP STATS (Hidden on mobile) */}
                                <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-8 xl:gap-12">
                                    {[
                                        { num: "15", suffix: "+", label: "Years Operating" },
                                        { num: "8,200", suffix: "+", label: "Happy Guests" },
                                        { num: "42", suffix: "+", label: "Unique Routes" },
                                        { num: "98", suffix: "%", label: "Return Rate" },
                                    ].map((stat, idx) => (
                                        <div key={idx} className="text-left group">
                                            <div className="font-['DM_Sans',_sans-serif] text-3xl xl:text-4xl font-bold text-white leading-none transition-colors group-hover:text-[#4a8fd4]">
                                                {stat.num}<span className="text-[#e8913a]">{stat.suffix}</span>
                                            </div>
                                            <div className="mt-2 text-[10px] font-bold tracking-[0.12em] uppercase text-[#6b8cae]">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* IMAGE COMPOSITION */}
                            <div className="relative col-span-5 md:col-span-5 lg:col-span-6 order-2 lg:order-1 lg:px-4">
                                <div className="relative aspect-[4/5] md:aspect-[4/3] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] ring-1 ring-white/10 group">
                                    <img
                                        src="/mountain.jpg"
                                        alt="Ladakh Mountain Range"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f3a]/60 via-transparent to-transparent" />
                                </div>

                                {/* Floating Detail Image */}
                                <div className="absolute -bottom-4 -right-2 md:-bottom-10 md:-right-8 z-20 w-20 sm:w-28 md:w-64 aspect-video rounded-lg md:rounded-3xl overflow-hidden shadow-2xl border-2 md:border-4 border-[#1a4a8a] ring-1 ring-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <img
                                        src="/mountain2.jpg"
                                        alt="Ladakh Bike Expedition"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Decorative Background Elements */}
                                <div className="absolute -top-6 -left-6 md:-top-12 md:-left-12 w-32 md:w-64 h-32 md:h-64 bg-[#4a8fd4]/20 rounded-full blur-[50px] md:blur-[100px] -z-10 animate-pulse" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] border border-white/5 rounded-full pointer-events-none -z-10" />
                            </div>

                            {/* MOBILE ONLY TEXT & STATS (Full Width, Hidden on Desktop) */}
                            <div className="col-span-12 order-3 lg:hidden mt-2 md:mt-0">
                                <p className="md:hidden text-sm font-light text-white/70 max-w-xl leading-relaxed mb-6">
                                    We are not a travel company that discovered Ladakh. We are Ladakhis who decided to share what we have always known — that these mountains hold something the world has never seen anywhere else.
                                </p>

                                <div className="grid grid-cols-2 gap-y-10 gap-x-4 md:grid-cols-4 md:gap-8 w-full justify-items-center sm:justify-items-start">
                                    {[
                                        { num: "15", suffix: "+", label: "Years Operating" },
                                        { num: "8,200", suffix: "+", label: "Happy Guests" },
                                        { num: "42", suffix: "+", label: "Unique Routes" },
                                        { num: "98", suffix: "%", label: "Return Rate" },
                                    ].map((stat, idx) => (
                                        <div key={idx} className="text-center sm:text-left group w-full flex flex-col items-center sm:items-start">
                                            <div className="font-['DM_Sans',_sans-serif] text-2xl sm:text-3xl md:text-3xl font-bold text-white leading-none transition-colors group-hover:text-[#4a8fd4]">
                                                {stat.num}<span className="text-[#e8913a]">{stat.suffix}</span>
                                            </div>
                                            <div className="mt-2 md:mt-2 text-[10px] font-bold tracking-[0.12em] uppercase text-[#6b8cae]">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* OUR STORY */}
                <section className="py-24 px-6 bg-gradient-to-b from-[#0a1f3a] to-[#0f2a4a]">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                            <div className="relative aspect-square sm:aspect-[4/5] max-w-[280px] sm:max-w-[300px] md:max-w-full mx-auto rounded-3xl overflow-hidden shadow-2xl group w-full">
                                <img
                                    src="/nubracamels.png"
                                    alt="Ladakh landscape"
                                    className="w-full h-full object-cover object-[63%_center] opacity-85 transition-transform duration-700 group-hover:scale-110"
                                />

                            </div>

                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-[#4a8fd4] bg-[#4a8fd4]/12 border border-[#4a8fd4]/30 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8913a]" />
                                    Our Story
                                </div>
                                <h2 className="font-['DM_Sans',_sans-serif] text-4xl md:text-5xl font-normal leading-tight text-white">
                                    A Journey That<br />Started <em className="italic font-normal text-[#4a8fd4] not-italic">At Home</em>
                                </h2>
                                <div className="space-y-5 text-white/65 font-light leading-loose">
                                    <p>
                                        Silent Peak Trail was founded in 2009 by <strong className="font-bold text-white">Stanzin Norbu</strong>, a native of Leh who grew up herding yaks on the high plateau and watching foreign trekkers struggle to navigate a landscape he knew like the back of his hand. What began as guiding a few curious travellers through the Markha Valley quickly became something much larger — a mission to share Ladakh not as a tourist destination, but as a living, breathing world.
                                    </p>
                                    <p>
                                        In the early years, it was just Stanzin and two of his childhood friends, operating with nothing more than hand-drawn maps, deep local knowledge, and an unwavering commitment to every person who trusted them with their journey. Word spread quietly — not through advertisements, but through letters home, travel forums, and the kind of whispered recommendations that only come from truly unforgettable experiences.
                                    </p>
                                    <p>
                                        Today, Silent Peak Trail is a team of <strong className="font-bold text-white">over 30 local guides, porters, logistics coordinators, and hospitality staff</strong> — all born and raised across the districts of Leh, Kargil, Nubra, and Zanskar. Every rupee you spend with us stays within the communities you visit. Every trail we take, we take responsibly. And every story you carry home, you carry alongside ours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/5 max-w-6xl mx-auto" />

                {/* WHY TRAVEL WITH US */}
                <section className="py-24 px-6 bg-gradient-to-br from-[#1a4a8a] via-[#0f2a4a] to-[#0a1f3a]">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[11px] font-bold tracking-[0.12em] uppercase text-[#4a8fd4] bg-[#4a8fd4]/12 border border-[#4a8fd4]/30 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8913a]" />
                                    Why Travel With Us
                                </div>
                                <h2 className="font-['DM_Sans',_sans-serif] text-4xl md:text-5xl font-normal leading-tight text-white mb-6">
                                    Expertise That<br /><em className="italic font-normal text-[#4a8fd4] not-italic">Transforms</em> Your Trip
                                </h2>
                                <div className="space-y-5 text-white/65 font-light leading-loose text-lg">
                                    <p>
                                        We craft extraordinary journeys into the Himalayas — guided by people who call these mountains home. Authentic experiences, uncompromising safety, and a deep respect for the land and its people.
                                    </p>
                                    <p>
                                        Our difference is not what we offer on a brochure. It is what happens in the quiet moments — when your guide points to a cluster of stars and tells you the Ladakhi name for the constellation, or when a village elder invites your group in for butter tea because he trusts the people who brought you here.
                                    </p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { icon: "🧭", title: "Born-and-Raised Local Guides", desc: "Our guides are native Ladakhis with ancestral knowledge of every pass, monastery, and hidden lake in the region." },
                                    { icon: "🛡️", title: "Mountain Safety Protocols", desc: "Satellite phones, acclimatization schedules, and a 24/7 emergency response team on every single tour." },
                                    { icon: "🌿", title: "Eco-Friendly Exploration", desc: "We follow Leave No Trace principles and ensure local communities benefit directly from every trip we run." },
                                    { icon: "✦", title: "Fully Tailored Journeys", desc: "Every package adapts to your pace, fitness level, dietary needs, and specific interests — no two trips are identical." },
                                ].map((card, idx) => (
                                    <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors duration-300">
                                        <div className="w-10 h-10 mb-4 bg-[#4a8fd4]/15 rounded-lg flex items-center justify-center text-lg">
                                            {card.icon}
                                        </div>
                                        <h3 className="font-['DM_Sans',_sans-serif] text-lg font-normal text-white mb-2 leading-tight">
                                            {card.title}
                                        </h3>
                                        <p className="text-xs text-white/50 leading-relaxed font-light">
                                            {card.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/5 max-w-6xl mx-auto" />

                {/* VALUES */}
                <section className="py-24 px-6 bg-[#0a1f3a]">
                    <div className="max-w-6xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[11px] font-bold tracking-[0.12em] uppercase text-[#4a8fd4] bg-[#4a8fd4]/12 border border-[#4a8fd4]/30 rounded-full mx-auto">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e8913a]" />
                            What We Stand For
                        </div>
                        <h2 className="font-['DM_Sans',_sans-serif] text-4xl md:text-5xl font-normal text-white mb-6">
                            Our <em className="italic font-normal text-[#4a8fd4] not-italic">Values</em>
                        </h2>
                        <p className="text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
                            These are not words on a wall. They are the principles that guide every decision we make — from the routes we design to the partners we work with.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: "🤝", title: "Community First", desc: "We employ exclusively from local villages. Our homestay partners, kitchen staff, and mule handlers are all members of the communities your journey passes through. Tourism, in our view, should flow wealth inward — not extract it outward." },
                            { icon: "🏔️", title: "Respect for the Land", desc: "Ladakh is one of the most ecologically fragile environments on the planet. We operate with strict waste management protocols, carry all non-biodegradable refuse out of wilderness zones, and refuse to operate in protected areas without proper permits." },
                            { icon: "📖", title: "Cultural Honesty", desc: "We do not present Ladakh as an exotic backdrop. We introduce you to a living culture — its festivals, its faith, its architecture, and its challenges. Our guests leave not just with photographs, but with understanding." },
                            { icon: "🎯", title: "Relentless Quality", desc: "From the stitching on your tent to the freshness of your meal at 4,800m, we obsess over the details that make the difference between a good trip and one you will talk about for the rest of your life." },
                            { icon: "🌐", title: "Transparent Operations", desc: "No hidden costs, no last-minute surprises, no greenwashing. We tell you exactly where your money goes, who it supports, and why every element of your package is priced the way it is." },
                            { icon: "❤️", title: "Safety Without Compromise", desc: "High altitude is beautiful and unforgiving in equal measure. Every member of our team is Wilderness First Responder certified, and we maintain the strictest acclimatization protocols in the industry. Your safety is never negotiable." },
                        ].map((value, idx) => (
                            <div key={idx} className="p-8 pb-10 bg-white/[0.04] border border-white/[0.08] rounded-3xl text-center group hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300">
                                <span className="block text-4xl mb-6">{value.icon}</span>
                                <h3 className="font-['DM_Sans',_sans-serif] text-xl font-normal text-white mb-4">{value.title}</h3>
                                <p className="text-sm text-white/55 font-light leading-loose">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="h-px bg-white/5 max-w-6xl mx-auto" />

                {/* TEAM */}
                <section className="py-24 px-6 bg-gradient-to-b from-[#0f2a4a] to-[#1a4a8a]">
                    <div className="max-w-6xl mx-auto mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[11px] font-bold tracking-[0.12em] uppercase text-[#4a8fd4] bg-[#4a8fd4]/12 border border-[#4a8fd4]/30 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e8913a]" />
                            The People Behind Your Journey
                        </div>
                        <h2 className="font-['DM_Sans',_sans-serif] text-4xl md:text-5xl font-normal text-white mb-6">
                            Meet Our <em className="italic font-normal text-[#4a8fd4] not-italic">Core Team</em>
                        </h2>
                        <p className="text-white/60 font-light max-w-xl leading-relaxed">
                            Every person you encounter on a Ladakh Trails journey has grown up in these mountains. This is not a job for them — it is a calling.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { img: "/nubracamels.png", name: "Stanzin Norbu", role: "Founder & Lead Guide", bio: "Born in Leh in 1981, Stanzin has been traversing the passes of Ladakh since he was a child following his father's yak caravans. He speaks five languages and has summited Stok Kangri eleven times. His philosophy: slow down, look closer, stay longer." },
                            { img: "https://ui-avatars.com/api/?name=?&background=1a4a8a&color=fff&size=512", name: "Dolma Yangchen", role: "Head of Guest Experience", bio: "Dolma joined Ladakh Trails in 2013 after spending years running a guesthouse in Nubra Valley. She is the reason every guest feels not like a tourist, but like a welcome visitor in someone's home. Meticulous, warm, and relentlessly detail-oriented." },
                            { img: "https://ui-avatars.com/api/?name=?&background=1a4a8a&color=fff&size=512", name: "Tsering Wangchuk", role: "Senior Trek Leader", bio: "Tsering grew up in Zanskar and crossed the frozen Chadar river every winter as a child to reach school. He has led over 400 treks across Ladakh and holds a Certificate in Mountain Medicine from the Himalayan Rescue Association." },
                        ].map((member, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center group transition-all duration-300 hover:bg-white/[0.07]">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#4a8fd4]/30 ring-4 ring-[#4a8fd4]/10">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="font-['DM_Sans',_sans-serif] text-xl font-normal text-white mb-1">{member.name}</h3>
                                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#e8913a] mb-4">{member.role}</div>
                                <p className="text-sm text-white/50 font-light leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="h-px bg-white/5 max-w-6xl mx-auto" />

                {/* PROMISE */}
                <section className="py-24 px-6 bg-gradient-to-br from-[#0a1f3a] to-[#1a4a8a]">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 text-[11px] font-bold tracking-[0.12em] uppercase text-[#4a8fd4] bg-[#4a8fd4]/12 border border-[#4a8fd4]/30 rounded-full mx-auto">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e8913a]" />
                            Our Promise to You
                        </div>

                        <figure className="mb-14 relative">
                            <div className="absolute -top-10 -left-4 text-[120px] font-['DM_Sans',_sans-serif] text-[#4a8fd4]/15 opacity-50 select-none">"</div>
                            <blockquote className="font-['DM_Sans',_sans-serif] text-2xl md:text-4xl italic font-normal text-white leading-relaxed mb-6 px-10">
                                The mountains do not care about your itinerary. But we do — and we will make sure both the mountains and your plans work together beautifully.
                            </blockquote>
                            <figcaption className="text-[13px] font-bold tracking-widest uppercase text-[#6b8cae]">
                                — Stanzin Norbu, Founder
                            </figcaption>
                        </figure>

                        <div className="text-left space-y-6 text-white/65 font-light leading-loose text-lg">
                            <p>
                                When you book a journey with Ladakh Trails, you are not purchasing a product. You are entering into a relationship — one built on trust, transparency, and a shared love for one of the most extraordinary places on the planet. We take that seriously in every possible way.
                            </p>
                            <p>
                                We promise to be honest with you about what Ladakh can offer and what it cannot. <strong className="font-bold text-white">We will not oversell the weather, the difficulty, or the comfort.</strong> We will tell you when a route is beyond your current fitness level and suggest a better alternative. We will flag when a village you wanted to visit is inaccessible, and we will replace it with something equally special.
                            </p>
                            <p>
                                We promise that the people guiding you have earned their place through years of experience in these specific mountains — not through a weekend certification course. Your head guide on a Markha Valley trek will have walked that trail dozens of times. <strong className="font-bold text-white">They will know which boulder to shelter behind in a storm, which family offers the best dal, and where the snow leopard was last spotted.</strong>
                            </p>
                            <p>
                                We promise to leave every place we visit exactly as we found it — or better. Our camps produce zero non-biodegradable waste. We contribute annually to trail restoration in the Hemis National Park. We offset vehicle emissions on all road-based legs of our tours. The environment that makes Ladakh extraordinary is the environment we are committed to protecting.
                            </p>
                            <p>
                                And finally, we promise that <strong className="font-bold text-white">this journey will stay with you.</strong> Not just as photographs or checked-off destinations, but as something that quietly reshapes the way you see the world — and your place in it.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-6 bg-[#0f2a4a] text-center">
                    <h2 className="font-['DM_Sans',_sans-serif] text-3xl md:text-6xl font-normal text-white mb-6">
                        Ready to Begin Your<br />
                        <em className="italic font-normal text-[#4a8fd4] not-italic">Ladakh Story?</em>
                    </h2>
                    <p className="text-white/60 font-light text-lg mb-10 max-w-xl mx-auto">
                        Talk to our team about crafting a journey that fits exactly who you are and where you want to go.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/#packages" className="px-10 py-4 bg-[#e8913a] text-white rounded-full font-bold tracking-wider text-sm hover:brightness-110 transition-all">
                            Explore Packages →
                        </Link>
                        <Link href="/#contact" className="px-10 py-4 border-2 border-white/25 text-white/80 rounded-full font-bold tracking-wider text-sm hover:bg-white hover:text-[#0f2a4a] transition-all">
                            Contact Us
                        </Link>
                    </div>
                </section>
            </main>

            <Footer homepageData={safeHomepageData} packages={packagesData} />
        </div>
    );
}
