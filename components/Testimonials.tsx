const TESTIMONIALS = [
  {
    text: `"Watching the sunrise over Pangong Tso was the most beautiful moment of my life. The shifting colours left me in tears. Silent Peak Trail made every detail effortless."`,
    name: "Rohit Sharma", place: "Mumbai, India · Pangong Package", initial: "R", d: "d1",
  },
  {
    text: `"The Chadar Trek was genuinely life-changing. I've travelled 42 countries and nothing compares to walking the frozen Zanskar River under a sky full of stars. Absolutely flawless."`,
    name: "Sophie Laurent", place: "Lyon, France · Chadar Trek", initial: "S", d: "d2",
  },
  {
    text: `"The moto expedition exceeded every expectation. The team handled permits, bikes, and safety so we could focus purely on the incredible ride. Already booked again for next year!"`,
    name: "Arjun Menon", place: "Bengaluru, India · Moto Expedition", initial: "A", d: "d3",
  },
];

export default function Testimonials() {
  return (
    <section className="testi-section">
      <div className="section-eyebrow reveal">Traveller Stories</div>
      <h2 className="section-title reveal">What Our Guests <em>Say</em></h2>

      <div className="testi-grid">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className={`testi-card reveal ${t.d}`}>
            <div className="testi-stars">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="testi-text">{t.text}</p>
            <div className="testi-author">
              <div className="testi-avatar">{t.initial}</div>
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-place">{t.place}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
