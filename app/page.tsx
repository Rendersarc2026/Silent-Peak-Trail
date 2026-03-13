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
import TripVideos from "@/components/TripVideos";
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
    GalleryItem.find({ isActive: true }).sort({ isHero: -1, createdAt: 1 }).lean(),
    Review.find({ isApproved: true, isActive: true })
      .populate({ path: 'packageId', select: 'name', model: Package })
      .sort({ createdAt: -1 })
      .limit(10)
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
    isHero: g.isHero,
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
    videos: (p.videos as string[]) || [],
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
    image: r.image,
  }));

  // Separate Stargazing package from main list
  const stargazingPkg = packagesData.find(p => p.name?.toLowerCase().includes('stargazing'));
  const otherPackages = packagesData.filter(p => !p.name?.toLowerCase().includes('stargazing'));

  // Map Leh Tips
  const lehTipsData = dbLehTips.map((t: any) => ({
    id: String(t._id),
    icon: t.icon,
    title: t.title,
    desc: t.desc,
    color: t.color,
    border: t.border,
  }));

  // Deep clone everything passed to client components to ensure no hidden Mongoose ObjectIds / Dates
  const safeHomepageData = JSON.parse(JSON.stringify(homepageData));
  const safeOtherPackages = JSON.parse(JSON.stringify(otherPackages));
  const safeStargazingPkg = JSON.parse(JSON.stringify(stargazingPkg || null));
  const safeDestinationsData = JSON.parse(JSON.stringify(destinationsData));
  const safeGalleryImages = JSON.parse(JSON.stringify(galleryImages));
  const safeTestimonials = JSON.parse(JSON.stringify(testimonials));
  const safePackagesForBooking = packagesData.map((p) => ({ id: p.id, name: p.name }));
  const safeLehTipsData = JSON.parse(JSON.stringify(lehTipsData));

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
      <Navbar homepageData={safeHomepageData} transparent={true} />
      <main style={{ paddingTop: "72px" }}>
        <Hero homepageData={safeHomepageData} />
        <StatsStrip homepageData={safeHomepageData} />
        <Packages packages={safeOtherPackages} />
        <Stargazing packageData={safeStargazingPkg} homepageData={safeHomepageData} />
        <Destinations destinations={safeDestinationsData} />
        <WhyUs homepageData={safeHomepageData} />
        <Gallery images={safeGalleryImages} />
        <TripVideos packages={packagesData} />
        <Testimonials testimonials={safeTestimonials} />
        <Booking homepageData={safeHomepageData} packages={safePackagesForBooking} />
        <LehPrep tips={safeLehTipsData} homepageData={safeHomepageData} />
      </main>
      <Footer homepageData={safeHomepageData} packages={packagesData} />
    </>
  );
}
