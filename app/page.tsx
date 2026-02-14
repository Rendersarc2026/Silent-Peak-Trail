import Navbar       from "@/components/Navbar";
import Hero         from "@/components/Hero";
import StatsStrip   from "@/components/StatsStrip";
import Packages     from "@/components/Packages";
import Destinations from "@/components/Destinations";
import WhyUs        from "@/components/WhyUs";
import Gallery      from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Booking      from "@/components/Booking";
import Footer       from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "72px" }}>
        <Hero />
        <StatsStrip />
        <Packages />
        <Destinations />
        <WhyUs />
        <Gallery />
        <Testimonials />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
