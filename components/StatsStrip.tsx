const STATS = [
  { num: "5,400m", lbl: "Max Altitude",      d: "" },
  { num: "24+",    lbl: "Tour Packages",     d: "d1" },
  { num: "8,200+", lbl: "Happy Travellers",  d: "d2" },
  { num: "15 Yrs", lbl: "Experience",        d: "d3" },
  { num: "98%",    lbl: "Satisfaction",      d: "d4" },
];

export default function StatsStrip() {
  return (
    <div className="stats-strip">
      {STATS.map((s) => (
        <div key={s.lbl} className={`stat-cell reveal ${s.d}`}>
          <div className="stat-num">{s.num}</div>
          <div className="stat-lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}
