import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import StatusBadge from "../components/StatusBadge.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import { getDashboardSummary, STATUSES } from "../services/api.js";

const statusBarStyles = {
  Wishlist: "bg-slate-500",
  Applied: "bg-blue-600",
  OA: "bg-amber-500",
  Interviewing: "bg-orange-500",
  Offer: "bg-emerald-600",
  Rejected: "bg-red-600",
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load dashboard data once when the page first renders.
    getDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err.message));
  }, []);

  const maxStatusCount = useMemo(() => {
    // Prevent divide-by-zero and scale bars relative to the largest status count.
    if (!summary) return 1;
    return Math.max(1, ...Object.values(summary.by_status));
  }, [summary]);

  if (error) {
    return <StateMessage title="Could not load dashboard" message={error} />;
  }

  if (!summary) {
    return <StateMessage title="Loading dashboard" message="Fetching your pipeline..." />;
  }

  return (
    <div className="space-y-7">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard label="Total applications" value={summary.total} tone="slate" />
        <SummaryCard label="Applied" value={summary.by_status.Applied || 0} tone="blue" />
        <SummaryCard
          label="Interviewing"
          value={summary.by_status.Interviewing || 0}
          tone="interview"
        />
        <SummaryCard label="Offer" value={summary.by_status.Offer || 0} tone="green" />
        <SummaryCard
          label="Rejected"
          value={summary.by_status.Rejected || 0}
          tone="orange"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-md border border-line bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Applications by status</h2>
          </div>
          <div className="space-y-4">
            {STATUSES.map((status) => {
              const count = summary.by_status[status] || 0;
              const width = `${(count / maxStatusCount) * 100}%`;
              return (
                <div key={status}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-md bg-slate-100">
                    <div
                      className={`h-full rounded-md ${
                        statusBarStyles[status] || "bg-brand-600"
                      }`}
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-md border border-line bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Recent applications</h2>
            <Link
              to="/applications"
              className="text-sm font-semibold text-brand-700 hover:text-brand-600"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {summary.recent_applications.length ? (
              summary.recent_applications.map((application) => (
                <Link
                  key={application.id}
                  to={`/applications/${application.id}`}
                  className="block rounded-md border border-line p-4 transition hover:border-brand-600 hover:bg-brand-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{application.company}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {application.role}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-600">No applications yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StateMessage({ title, message }) {
  return (
    <div className="rounded-md border border-line bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
    </div>
  );
}
