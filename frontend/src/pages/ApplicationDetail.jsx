import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ConfirmDialog from "../components/ConfirmDialog.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { deleteApplication, getApplication } from "../services/api.js";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    // Refetch when the URL id changes, such as navigating between detail pages.
    refreshApplication();
  }, [id]);

  function refreshApplication() {
    // The detail endpoint returns the application plus related notes.
    setIsLoading(true);
    getApplication(id)
      .then((payload) => {
        setApplication(payload.application);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  async function handleDelete() {
    // After deletion, return to the table because the detail record no longer exists.
    setIsDeleting(true);
    try {
      await deleteApplication(id);
      navigate("/applications");
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
      setShowDelete(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md border border-line bg-white p-8 text-center shadow-sm">
        Loading application...
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="rounded-md border border-orange-200 bg-orange-50 p-8 text-center text-orange-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/applications"
        aria-label="Back to applications"
        title="Back to applications"
        className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-xl font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
      >
        &larr;
      </Link>

      {error ? (
        <div className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-800">
          {error}
        </div>
      ) : null}

      <section className="rounded-md border border-line bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-normal text-ink">
                {application.role}
              </h1>
              <StatusBadge status={application.status} />
            </div>
            <p className="mt-2 text-xl font-semibold text-slate-700">
              {application.company}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/applications/${application.id}/edit`}
              className="focus-ring rounded-md border border-line px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="focus-ring rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Delete
            </button>
          </div>
        </div>

        <dl className="mt-6 grid overflow-hidden rounded-md border border-line sm:grid-cols-2">
          <DetailItem label="Company" value={application.company} />
          <DetailItem label="Role" value={application.role} />
          <DetailItem label="Status" value={<StatusBadge status={application.status} />} />
          <DetailItem
            label="Date Applied"
            value={formatDate(application.date_applied)}
          />
          <DetailItem label="Location" value={application.location || "Not set"} />
          <DetailItem label="Salary" value={application.salary || "Not set"} />
          <DetailItem
            label="Job URL"
            value={
              application.job_url ? (
                <a
                  href={application.job_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand-700 hover:text-brand-600"
                >
                  Open job posting
                </a>
              ) : (
                "Not set"
              )
            }
          />
          <DetailItem
            label="Last Updated"
            value={formatDateTime(application.updated_at)}
          />
        </dl>
      </section>

      <section className="rounded-md border border-line bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-ink">Notes</h2>
          <div className="mt-4 space-y-3">
            {application.notes.length ? (
              application.notes.map((item) => (
                <article
                  key={item.id}
                  className="rounded-md border border-line bg-mist p-4"
                >
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {item.content}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    {formatDateTime(item.created_at)}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-600">No notes yet.</p>
            )}
          </div>
        </section>

      <ConfirmDialog
        open={showDelete}
        title="Delete application?"
        message="This will permanently remove the application and its notes."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        isBusy={isDeleting}
      />
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="border-b border-line bg-white px-4 py-4 last:border-b-0 sm:border-r sm:even:border-r-0">
      <dt className="text-xs font-semibold uppercase tracking-normal text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-base font-semibold text-ink">
        {value}
      </dd>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
