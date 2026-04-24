const statusStyles = {
  Wishlist: "bg-slate-100 text-slate-700 ring-slate-300",
  Applied: "bg-brand-50 text-brand-700 ring-brand-100",
  OA: "bg-amber-50 text-amber-800 ring-amber-200",
  Interviewing: "bg-sky-50 text-sky-700 ring-sky-200",
  Offer: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-orange-50 text-orange-700 ring-orange-200",
  Ghosted: "bg-zinc-100 text-zinc-700 ring-zinc-300",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        statusStyles[status] || statusStyles.Wishlist
      }`}
    >
      {status}
    </span>
  );
}
