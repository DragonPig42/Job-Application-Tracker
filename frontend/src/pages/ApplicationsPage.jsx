import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SearchFilterBar from "../components/SearchFilterBar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { getApplications } from "../services/api.js";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("date_desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Small debounce keeps typing in the search box from firing a request per keypress.
    const timeout = setTimeout(() => {
      setIsLoading(true);
      getApplications({ search, status, sort })
        .then((payload) => {
          setApplications(payload.applications);
          setError("");
        })
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }, 200);

    return () => clearTimeout(timeout);
  }, [search, status, sort]);

  return (
    <div className="space-y-6">
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />

      <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold text-ink">Application records</h2>
          <p className="mt-1 text-sm text-slate-600">
            Sorted by application date unless a different order is selected.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <Th>Company</Th>
                <Th>Role</Th>
                <Th>Location</Th>
                <Th>Salary</Th>
                <Th>Status</Th>
                <Th>Date Applied</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-600">
                    Loading applications...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-orange-700">
                    {error}
                  </td>
                </tr>
              ) : applications.length ? (
                applications.map((application) => (
                  <tr key={application.id} className="hover:bg-brand-50/60">
                    <Td className="font-semibold text-ink">{application.company}</Td>
                    <Td>{application.role}</Td>
                    <Td>{application.location || "Not set"}</Td>
                    <Td>{application.salary || "Not set"}</Td>
                    <Td>
                      <StatusBadge status={application.status} />
                    </Td>
                    <Td>{formatDate(application.date_applied)}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/applications/${application.id}`}
                          className="font-semibold text-brand-700 hover:text-brand-600"
                        >
                          View
                        </Link>
                        <Link
                          to={`/applications/${application.id}/edit`}
                          className="font-semibold text-slate-700 hover:text-ink"
                        >
                          Edit
                        </Link>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-600">
                    No applications match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

function Td({ children, className = "" }) {
  return <td className={`whitespace-nowrap px-4 py-4 ${className}`}>{children}</td>;
}

function formatDate(value) {
  // Adding T00:00:00 avoids timezone shifts when formatting date-only values.
  if (!value) return "Not set";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
