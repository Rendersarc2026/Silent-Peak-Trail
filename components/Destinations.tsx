const DESTS = [
  {
    id: "pangong", big: true, d: "",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85&fit=crop",
    alt: "Pangong Tso Lake", type: "High-Altitude Lake",
    name: "Pangong Tso", sub: "4,350m · 134km long · extends into Tibet",
  },
  {
    id: "nubra", big: false, d: "d1",
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/b9/e6/1c/nubra-valley.jpg?w=1200&h=1200&s=1",
    alt: "Nubra Valley Ladakh", type: "Sand Dunes & Camel Safari",
    name: "Nubra Valley", sub: "3,048m altitude",
  },
  {
    id: "leh", big: false, d: "d2",
    img: "https://t3.ftcdn.net/jpg/05/42/14/96/360_F_542149645_TRXuoftJI0OemvvkplsLL8Hvs4QCgcye.jpg",
    alt: "Leh Palace monastery Ladakh", type: "Historic Palace & City",
    name: "Leh City", sub: "3,524m altitude",
  },
  {
    id: "tso-moriri", big: false, d: "d1",
    img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=700&q=80&fit=crop",
    alt: "Tso Moriri lake Ladakh", type: "Remote Wilderness Lake",
    name: "Tso Moriri", sub: "4,522m altitude",
  },
  {
    id: "zanskar", big: false, d: "d2",
    img: "https://cdn.pixabay.com/photo/2018/12/06/06/16/zanskar-river-3859214_1280.jpg",
    alt: "Zanskar valley mountains", type: "Gorges & Frozen River",
    name: "Zanskar Valley", sub: "3,500m altitude",
  },
];

const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 11 L11 2 M3 2 L11 2 L11 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Destinations() {
  return (
    <section className="dest-section" id="destinations">
      <div className="dest-header">
        <div>
          <div className="section-eyebrow reveal">Where We Go</div>
          <h2 className="section-title reveal">
            Iconic <em>Destinations</em><br />of Ladakh
          </h2>
        </div>
        <p className="section-sub reveal" style={{ textAlign: "right", maxWidth: "340px" }}>
          From sky-mirroring lakes to towering sand dunes, each corner of Ladakh tells a different story.
        </p>
      </div>

      <div className="dest-grid">
        {DESTS.map((d) => (
          <div key={d.id} className={["dest-card reveal", d.d, d.big ? "big" : ""].join(" ").trim()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.img} alt={d.alt} />
            <div className="dest-overlay" />
            <div className="dest-info">
              <div className="dest-type">{d.type}</div>
              <div className="dest-name">{d.name}</div>
              <div className="dest-alt">{d.sub}</div>
            </div>
            <div className="dest-arrow"><Arrow /></div>
          </div>
        ))}
      </div>
    </section>
  );
}
