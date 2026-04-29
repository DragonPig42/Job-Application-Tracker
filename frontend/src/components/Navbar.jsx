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
            <LogoMark />
            <span>
              <span className="block text-xl font-bold tracking-normal text-ink">
                Job Application Tracker Demo
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

function LogoMark() {
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-brand-200 bg-white shadow-sm">
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="h-9 w-9"
        fill="none"
      >
        <rect
          x="8"
          y="15"
          width="32"
          height="24"
          rx="4"
          className="fill-brand-600"
        />
        <path
          d="M18 15v-3.2A3.8 3.8 0 0 1 21.8 8h4.4A3.8 3.8 0 0 1 30 11.8V15"
          className="stroke-slate-800"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M8 24h32"
          className="stroke-white/35"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="17"
          y="20"
          width="14"
          height="15"
          rx="2"
          className="fill-white"
        />
        <path
          d="m20.5 28.2 2.7 2.7 5.1-6"
          className="stroke-emerald-600"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 39h20"
          className="stroke-slate-900/15"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
