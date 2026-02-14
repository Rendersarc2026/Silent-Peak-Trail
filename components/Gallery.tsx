const GALLERY = [
   { src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80&fit=crop", alt: "Ladakh mountains wide",  cls: "wide tall", d: "" },
  { src: "https://www.exploreourindia.com/backend/web/images/post/big/6446_Hunder%20Sand%20Dunes%20Leh%20Ladakh.webp", alt: "Nubra camels",          cls: "",          d: "d1" },
  { src: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600&q=80&fit=crop", alt: "Tso Moriri reflection", cls: "",          d: "d2" },
  { src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80&fit=crop",    alt: "Ladakh monastery",     cls: "",          d: "d1" },
  { src: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&q=80&fit=crop", alt: "Ladakh mountain road",  cls: "",          d: "d2" },
  { src: "https://discoverlehladakh.in/wp-content/uploads/2020/06/Thiksey-monastery-leh-ladakh-1088x530.jpg", alt: "Thiksey Monastery",    cls: "wide",      d: "" },
];

export default function Gallery() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="section-eyebrow reveal">Photo Gallery</div>
      <h2 className="section-title reveal">Ladakh Through <em>Our Lens</em></h2>
      <p className="section-sub reveal">
        A glimpse of the breathtaking landscapes, vibrant culture, and unforgettable
        moments waiting for you.
      </p>

      <div className="gallery-grid">
        {GALLERY.map((g, i) => (
          <div
            key={i}
            className={["gallery-item reveal", g.cls, g.d].filter(Boolean).join(" ")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.src} alt={g.alt} />
          </div>
        ))}
      </div>
    </section>
  );
}
