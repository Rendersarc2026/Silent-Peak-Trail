import dbConnect from "@/lib/db";
import Package, { IPackage } from "@/lib/models/Package";
import Destination from "@/lib/models/Destination";
import GalleryItem from "@/lib/models/GalleryItem";
import Review from "@/lib/models/Review";
import LehTip from "@/lib/models/LehTip";
import Homepage from "@/lib/models/Homepage";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import Packages from "@/components/Packages";
import Destinations from "@/components/Destinations";
import WhyUs from "@/components/WhyUs";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Stargazing from "@/components/Stargazing";
import Booking from "@/components/Booking";
import LehPrep from "@/components/LehPrep";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

// Always read fresh data on every request so admin edits show immediately
export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();

  const [settingsRecords, packages, destinations, gallery, dbReviews, dbLehTips] = await Promise.all([
    Homepage.find().lean(),
    Package.find({ isActive: true }).sort({ createdAt: 1 }).lean(),
    Destination.find({ isActive: true }).sort({ createdAt: 1 }).lean(),
    GalleryItem.find({ isActive: true }).sort({ createdAt: 1 }).lean(),
    Review.find({ isApproved: true, isActive: true })
      .populate({ path: 'packageId', select: 'name', model: Package })
      .sort({ createdAt: -1 })
      .lean(),
    LehTip.find({ isActive: true })
      .sort({ order: 1 })
      .lean()
  ]);

  // Convert settings array to an object
  const homepageData: Record<string, string> = {};
  settingsRecords.forEach((s) => { homepageData[s.key] = s.value; });

  // Map gallery to format expected by Gallery component
  const galleryImages = gallery.map((g: any) => ({
    id: String(g._id),
    src: g.src,
    alt: g.alt,
    wide: g.wide,
    tall: g.tall,
  }));

  // Map destinations to format expected by Destinations component
  const destinationsData = destinations.map((d: any) => ({
    id: String(d._id),
    name: d.name,
    type: d.type,
    altitude: d.altitude,
    img: d.img,
    big: d.big,
  }));

  // Map packages
  const packagesData = packages.map((p: any) => ({
    id: String(p._id),
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    duration: p.duration,
    price: p.price,
    badge: p.badge,
    badgeGold: p.badgeGold,
    featured: p.featured,
    img: p.img,
    features: (p.features as string[]) || [],
    itinerary: (p.itinerary as { day: string; title: string }[]) || [],
    inclusions: (p.inclusions as string[]) || [],
    exclusions: (p.exclusions as string[]) || [],
  }));

  // Map reviews to testimonials format
  const testimonials = dbReviews.map((r: any) => ({
    id: String(r._id),
    name: r.name,
    place: r.place,
    package: r.packageId?.name || "Tour Package",
    initial: r.initial,
    text: r.message,
    stars: r.rating,
  }));

  // Separate Stargazing package from main list
  const stargazingPkg = packagesData.find(p => p.name.toLowerCase().includes('stargazing'));
  const otherPackages = packagesData.filter(p => !p.name.toLowerCase().includes('stargazing'));

  // Map Leh Tips
  const lehTipsData = dbLehTips.map((t: any) => ({
    id: String(t._id),
    icon: t.icon,
    title: t.title,
    desc: t.desc,
    color: t.color,
    border: t.border,
  }));

  return (
    <>
      <StructuredData
        type="TravelAgency"
        data={{
          description: homepageData.heroSubtitle,
          phone: homepageData.phone,
          address: homepageData.address,
          image: homepageData.heroBgImage,
        }}
      />
      <Navbar />
      <main style={{ paddingTop: "72px" }}>
        <Hero homepageData={homepageData} />
        <StatsStrip homepageData={homepageData} />
        <Packages packages={otherPackages} />
        <Stargazing packageData={stargazingPkg} homepageData={homepageData} />
        <Destinations destinations={destinationsData} />
        <WhyUs homepageData={homepageData} />
        <Gallery images={galleryImages} />

        <Testimonials testimonials={testimonials} />
        <Booking homepageData={homepageData} packages={packagesData.map((p) => ({ id: p.id, name: p.name }))} />
        <LehPrep tips={lehTipsData} />
      </main>
      <Footer />
    </>
  );
}
