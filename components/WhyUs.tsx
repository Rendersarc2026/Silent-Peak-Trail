const FEATURES = [
  { icon: "🏔️", title: "Born-and-Raised Local Guides", d: "d1",
    desc: "Our guides are native Ladakhis with ancestral knowledge of every pass, monastery, and hidden lake. No outsider can offer what they can." },
  { icon: "🛡️", title: "Mountain Safety Protocols", d: "d2",
    desc: "Satellite phones, acclimatisation schedules, altitude sickness kits, and a 24/7 emergency response team on every single tour." },
  { icon: "🌿", title: "Responsible & Sustainable Travel", d: "d3",
    desc: "We follow Leave No Trace principles and ensure local communities directly benefit from every trip you take with us." },
  { icon: "✨", title: "Fully Customisable Itineraries", d: "",
    desc: "No two travellers are the same. Every package adapts to your pace, fitness level, dietary needs, and interests." },
];

export default function WhyUs() {
  return (
    <section className="why-section" id="about">
      <div className="section-eyebrow">Why Travel With Us</div>
      <h2 className="section-title">The Silent Peak <em>Difference</em></h2>
      <p className="section-sub">
        We&apos;ve been running tours since 2009 — every guide, route, and stay has been
        tested and perfected over hundreds of journeys.
      </p>

      <div className="why-layout">
        <div className="why-image reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=900&q=80&fit=crop"
            alt="Ladakh mountain guide hiking"
          />
          <div className="why-image-badge">
            <div className="badge-num">8,200+</div>
            <div className="badge-txt">Happy Travellers</div>
          </div>
        </div>

        <div className="why-features">
          {FEATURES.map((f) => (
            <div key={f.title} className={`why-feature reveal ${f.d}`}>
              <div className="why-feature-icon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
