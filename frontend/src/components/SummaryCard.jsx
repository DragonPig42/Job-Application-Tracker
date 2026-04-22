export default function SummaryCard({ label, value, tone = "default" }) {
  const tones = {
    default: "bg-white text-ink",
    blue: "bg-brand-600 text-white",
    green: "bg-emerald-600 text-white",
    orange: "bg-orange-600 text-white",
    slate: "bg-slate-800 text-white",
  };

  return (
    <section className={`rounded-md p-5 shadow-soft ${tones[tone] || tones.default}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-normal">{value}</p>
    </section>
  );
}
