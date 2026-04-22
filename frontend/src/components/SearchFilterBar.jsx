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
    <div className="grid gap-3 rounded-md border border-line bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_190px]">
      <label className="block">
        <span className="sr-only">Search by company or role</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search company or role"
          className="focus-ring h-11 w-full rounded-md border border-line bg-white px-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="sr-only">Filter by status</span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="focus-ring h-11 w-full rounded-md border border-line bg-white px-3 text-sm"
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
        <span className="sr-only">Sort by date applied</span>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="focus-ring h-11 w-full rounded-md border border-line bg-white px-3 text-sm"
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
        </select>
      </label>
    </div>
  );
}
