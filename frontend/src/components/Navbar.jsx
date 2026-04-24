import { NavLink, Link } from "react-router-dom";

const linkClass = ({ isActive }) =>
  [
    "border-b-2 px-1 py-4 text-sm font-semibold transition sm:px-3",
    isActive
      ? "border-brand-600 text-brand-700"
      : "border-transparent text-slate-700 hover:border-line hover:text-ink",
  ].join(" ");

export default function Navbar() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-md bg-civic text-sm font-bold text-white">
              JT
            </span>
            <span>
              <span className="block text-xl font-bold tracking-normal text-ink">
                Job Application Tracker
              </span>
              <span className="block text-sm font-medium text-slate-600">
                Track applications, notes, and outcomes
              </span>
            </span>
          </Link>
          <Link
            to="/applications/new"
            className="focus-ring inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Add Application
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-6 border-t border-line pt-1">
          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/applications" className={linkClass}>
            Applications
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
