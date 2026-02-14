"use client";

function go(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

const PKGS = [
  {
    id: "pangong",
    name: "Pangong Lake Explorer",
    tagline: "Where the sky meets turquoise infinity",
    dur: "7 Days · 6 Nights",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop",
    alt: "Pangong Tso Lake Ladakh",
    price: "₹32,000",
    d: "d1",
    features: [
      "Leh to Pangong Tso via Chang La (5,360m)",
      "Sunrise & sunset at the magical lake",
      "Nubra Valley & Shyok River Valley",
      "Hemis & Thiksey Monastery visits",
      "All accommodation & meals included",
    ],
  },
  {
    id: "golden",
    name: "Golden Triangle of Ladakh",
    tagline: "Lakes, dunes & ancient monasteries",
    dur: "10 Days · 9 Nights",
    img: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?w=800&q=80&fit=crop",
    alt: "Nubra Valley Ladakh sand dunes",
    price: "₹52,000",
    badge: "⭐ Most Popular",
    badgeGold: true,
    featured: true,
    d: "d2",
    features: [
      "Pangong + Nubra Valley + Tso Moriri",
      "Bactrian camel safari in Hunder sand dunes",
      "Khardung La Pass — world's highest motor road",
      "Lamayuru & Diskit Monastery",
      "Premium stays, all meals & local guide",
    ],
  },
  {
    id: "chadar",
    name: "Chadar Trek",
    tagline: "Walk on the world's most epic frozen river",
    dur: "5 Days · 4 Nights",
    img: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80&fit=crop",
    alt: "Chadar trek frozen river Zanskar",
    price: "₹28,000",
    badge: "❄️ Winter Special",
    d: "d3",
    features: [
      "Trek on the frozen Zanskar River",
      "Camp beneath a billion stars nightly",
      "Nerak Waterfall — a stunning frozen cascade",
      "Expert trekking guides & full safety gear",
      "Full-board camping meals included",
    ],
  },
  {
    id: "markha",
    name: "Markha Valley Trek",
    tagline: "Ancient villages through pristine wilderness",
    dur: "8 Days · 7 Nights",
    img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80&fit=crop",
    alt: "Markha Valley trekking Ladakh",
    price: "₹38,000",
    d: "d1",
    features: [
      "Hemis National Park — Snow Leopard habitat",
      "Traditional village homestay experiences",
      "Kongmaru La Summit (5,163m)",
      "Incredible wildlife & bird watching",
      "Camping, tents & all meals provided",
    ],
  },
  {
    id: "moto",
    name: "Manali–Leh Moto Expedition",
    tagline: "The legendary highway to the sky",
    dur: "12 Days · 11 Nights",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop",
    alt: "Motorcycle road trip Ladakh",
    price: "₹68,000",
    badge: "🏍️ Adventure",
    d: "d2",
    features: [
      "Manali to Leh on Royal Enfield Himalayan",
      "Rohtang, Baralacha La, Tanglang La Passes",
      "Sarchu plains camping under stars",
      "Full support vehicle & mechanic",
      "Safety gear, all stays & meals included",
    ],
  },
  {
    id: "monastery",
    name: "Monastery & Culture Circuit",
    tagline: "Sacred silence in a snow-draped land",
    dur: "6 Days · 5 Nights",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80&fit=crop",
    alt: "Ladakh monastery snow winter",
    price: "₹24,000",
    d: "d3",
    features: [
      "Hemis, Thiksey, Chemrey, Phyang Gompas",
      "Tso Kar frozen lake day excursion",
      "Buddhist prayer & puja ceremonies",
      "Losar Festival visit (seasonal)",
      "Heritage homestays & all meals",
    ],
  },
];

export default function Packages() {
  return (
    <section className="packages-bg" id="packages">
      <div className="packages-header">
        <div>
          <div className="section-eyebrow reveal">Our Tour Packages</div>
          <h2 className="section-title reveal">
            Curated <em>Journeys</em><br />Into the Himalayas
          </h2>
        </div>
        <p className="section-sub reveal" style={{ textAlign: "right", maxWidth: "360px" }}>
          Every itinerary is hand-crafted and can be fully personalised to match your
          pace, interests, and travel style.
        </p>
      </div>

      <div className="packages-grid">
        {PKGS.map((p) => (
          <div
            key={p.id}
            className={["pkg-card reveal", p.d, p.featured ? "featured" : ""].join(" ").trim()}
          >
            {p.badge && (
              <div className={["pkg-badge", p.badgeGold ? "gold" : ""].join(" ").trim()}>
                {p.badge}
              </div>
            )}
            <div className="pkg-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.alt} />
              <div className="pkg-img-overlay" />
              <div className="pkg-dur">{p.dur}</div>
            </div>
            <div className="pkg-body">
              <div className="pkg-name">{p.name}</div>
              <div className="pkg-tagline">{p.tagline}</div>
              <ul className="pkg-features">
                {p.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <div className="pkg-footer">
                <div>
                  <div className="pkg-price-from">Starting from</div>
                  <div className="pkg-price-amt">{p.price}</div>
                  <div className="pkg-price-pp">per person</div>
                </div>
                <a
                  href="#contact"
                  className="pkg-btn"
                  onClick={(e) => { e.preventDefault(); go("#contact"); }}
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
