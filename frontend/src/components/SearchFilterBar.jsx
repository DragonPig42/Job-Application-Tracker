import { STATUSES } from "../services/api.js";

export default function SearchFilterBar({
  search,
  setSearch,
  status,
  setStatus,
  sort,
  setSort,
}) {
  return (
    <div className="rounded-md border border-line bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-ink">Find applications</h2>
        <p className="text-sm text-slate-600">
          Search by company or role, then narrow the list by status.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_180px_190px]">
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">
          Company or role
        </span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search company or role"
          className="focus-ring mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Status</span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="focus-ring mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Date order</span>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="focus-ring mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm"
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
        </select>
      </label>
      </div>
    </div>
  );
}
