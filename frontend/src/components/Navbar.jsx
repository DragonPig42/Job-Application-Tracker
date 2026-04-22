import { NavLink, Link } from "react-router-dom";

const linkClass = ({ isActive }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-brand-600 text-white shadow-sm"
      : "text-slate-600 hover:bg-white hover:text-ink",
  ].join(" ");

export default function Navbar() {
  return (
    <header className="border-b border-line bg-mist/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm font-bold text-white">
            JT
          </span>
          <span className="text-lg font-semibold tracking-normal">
            Job Application Tracker
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/applications" className={linkClass}>
            Applications
          </NavLink>
          <Link
            to="/applications/new"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus-ring"
          >
            Add Application
          </Link>
        </div>
      </nav>
    </header>
  );
}
