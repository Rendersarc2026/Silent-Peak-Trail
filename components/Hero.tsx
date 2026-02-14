"use client";

function go(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1900&q=85&fit=crop"
          alt="Ladakh Himalayan landscape"
        />
      </div>
      <div className="hero-overlay" />
      <div className="hero-overlay-bottom" />

      <div className="hero-content">
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          Award-winning Ladakh specialists since 2009
        </div>
        <h1 className="hero-title">
          Discover the<br />Magic of <em>Ladakh</em>
        </h1>
        <p className="hero-sub">
          Journey to the roof of the world — where turquoise lakes mirror snowcapped peaks,
          ancient monasteries kiss the clouds, and every road leads to wonder.
        </p>
        <div className="hero-actions">
          <a href="#packages" className="btn-white" onClick={(e) => { e.preventDefault(); go("#packages"); }}>
            Explore Packages
          </a>
          <a href="#destinations" className="btn-outline-white" onClick={(e) => { e.preventDefault(); go("#destinations"); }}>
            View Destinations
          </a>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3 L9 15 M4 10 L9 15 L14 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
