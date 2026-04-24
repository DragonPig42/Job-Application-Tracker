export default function SummaryCard({ label, value, tone = "default" }) {
  const tones = {
    default: "border-l-brand-600",
    blue: "border-l-blue-600",
    green: "border-l-emerald-600",
    orange: "border-l-red-600",
    interview: "border-l-orange-500",
    slate: "border-l-civic",
  };

  return (
    <section
      className={`rounded-md border border-line border-l-4 bg-white p-5 shadow-soft ${
        tones[tone] || tones.default
      }`}
    >
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-normal text-ink">{value}</p>
    </section>
  );
}
