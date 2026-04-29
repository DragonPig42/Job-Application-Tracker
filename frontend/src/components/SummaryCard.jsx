import { Link } from "react-router-dom";

export default function SummaryCard({ label, value, tone = "default", to }) {
  const tones = {
    default: "border-l-brand-600",
    blue: "border-l-blue-600",
    green: "border-l-emerald-600",
    orange: "border-l-red-600",
    interview: "border-l-orange-500",
    slate: "border-l-civic",
    wishlist: "border-l-slate-500",
  };

  const cardClass = `rounded-md border border-line border-l-4 bg-white p-5 shadow-soft ${
    tones[tone] || tones.default
  }`;

  if (to) {
    return (
      <Link
        to={to}
        className={`${cardClass} focus-ring block transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md`}
      >
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        <p className="mt-3 text-3xl font-bold tracking-normal text-ink">{value}</p>
      </Link>
    );
  }

  return (
    <section
      className={cardClass}
    >
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-normal text-ink">{value}</p>
    </section>
  );
}
