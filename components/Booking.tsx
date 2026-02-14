"use client";
import { useState } from "react";

export default function Booking() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  }

  return (
    <section className="booking-section" id="contact">
      <div className="section-eyebrow reveal">Ready to Go?</div>
      <h2 className="section-title reveal">
        Start Planning Your <em>Dream Trip</em>
      </h2>

      <div className="booking-layout">
        {/* Left col */}
        <div className="reveal">
          <div className="booking-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://media.istockphoto.com/id/1061972184/photo/landscape-of-snow-mountains-and-mountain-road-to-nubra-valley-in-leh-ladakh-india.jpg?s=612x612&w=0&k=20&c=i0pA6oVMEzUgBLp5V7CblN1wPwOO7A2D3orhfi7HGe4="
              alt="Ladakh mountain valley scenery"
            />
          </div>
          <div className="contact-cards">
            {[
              { icon: "📞", lbl: "Phone & WhatsApp", val: "+91 94190 55555" },
              { icon: "✉️", lbl: "Email",            val: "explore@silentpeaktrail.com" },
              { icon: "📍", lbl: "Our Office",       val: "Fort Road, Leh, Ladakh — 194 101" },
              { icon: "🗓️", lbl: "Best Season",      val: "May–Oct (Summer) · Jan–Feb (Chadar)" },
            ].map((c) => (
              <div key={c.lbl} className="contact-card">
                <div className="contact-card-icon">{c.icon}</div>
                <div>
                  <div className="contact-lbl">{c.lbl}</div>
                  <div className="contact-val">{c.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col — form */}
        <div className="booking-form reveal d2">
          <h3>Send Us an Enquiry</h3>
          <p>We&apos;ll reply within 24 hours with a personalised itinerary and quote just for you.</p>

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" placeholder="Rahul" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Sharma" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="you@email.com" />
              </div>
              <div className="form-group">
                <label>Phone / WhatsApp</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Preferred Package</label>
                <select defaultValue="">
                  <option value="" disabled>Choose a package</option>
                  <option>Pangong Lake Explorer (7D/6N)</option>
                  <option>Golden Triangle (10D/9N)</option>
                  <option>Chadar Trek (5D/4N)</option>
                  <option>Markha Valley Trek (8D/7N)</option>
                  <option>Manali–Leh Moto Expedition (12D)</option>
                  <option>Monastery &amp; Culture Circuit (6D/5N)</option>
                  <option>Custom / Not Sure Yet</option>
                </select>
              </div>
              <div className="form-group">
                <label>Number of Travellers</label>
                <select>
                  <option>1 Person</option>
                  <option>2 People</option>
                  <option>3–5 People</option>
                  <option>6–10 People</option>
                  <option>10+ (Group)</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Travel Month</label>
                <select>
                  <option>January (Chadar)</option>
                  <option>February (Chadar)</option>
                  <option>May</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                  <option>October</option>
                  <option>Flexible</option>
                </select>
              </div>
              <div className="form-group">
                <label>Budget Range</label>
                <select>
                  <option>Under ₹30,000</option>
                  <option>₹30,000 – ₹50,000</option>
                  <option>₹50,000 – ₹80,000</option>
                  <option>₹80,000+</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Special Requests or Questions</label>
              <textarea placeholder="Dietary needs, fitness level, special occasion, or anything else..." />
            </div>

            <button type="submit" className={`form-submit${sent ? " success" : ""}`}>
              {sent ? "✅ Enquiry sent! We'll be in touch within 24 hours." : "📩 Send My Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
