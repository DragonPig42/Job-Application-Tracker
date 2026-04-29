import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ConfirmDialog from "../components/ConfirmDialog.jsx";
import SearchFilterBar from "../components/SearchFilterBar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { deleteApplication, getApplications } from "../services/api.js";

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("date_desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [error, setError] = useState("");

  function loadApplications() {
    setIsLoading(true);
    getApplications({ search, status, sort })
      .then((payload) => {
        setApplications(payload.applications);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    // Small debounce keeps typing in the search box from firing a request per keypress.
    const timeout = setTimeout(loadApplications, 200);

    return () => clearTimeout(timeout);
  }, [search, status, sort]);

  async function handleDelete() {
    if (!applicationToDelete) return;

    setIsDeleting(true);
    try {
      await deleteApplication(applicationToDelete.id);
      setApplicationToDelete(null);
      loadApplications();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

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
                  <tr
                    key={application.id}
                    onClick={() => navigate(`/applications/${application.id}`)}
                    className="cursor-pointer hover:bg-brand-50/60"
                  >
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
                          to={`/applications/${application.id}/edit`}
                          onClick={(event) => event.stopPropagation()}
                          className="font-semibold text-slate-700 hover:text-ink"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setApplicationToDelete(application);
                          }}
                          className="font-semibold text-orange-700 hover:text-orange-600"
                        >
                          Delete
                        </button>
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

      <ConfirmDialog
        open={Boolean(applicationToDelete)}
        title="Delete application?"
        message={
          applicationToDelete
            ? `This will permanently remove ${applicationToDelete.company} - ${applicationToDelete.role}, including notes and status history.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setApplicationToDelete(null)}
        isBusy={isDeleting}
      />
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
