import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ConfirmDialog from "../components/ConfirmDialog.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import {
  addNote,
  deleteApplication,
  getApplication,
  STATUSES,
  updateStatus,
} from "../services/api.js";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    // Refetch when the URL id changes, such as navigating between detail pages.
    refreshApplication();
  }, [id]);

  function refreshApplication() {
    // The detail endpoint returns the application plus notes and status history.
    setIsLoading(true);
    getApplication(id)
      .then((payload) => {
        setApplication(payload.application);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  async function handleStatusChange(newStatus) {
    // Status changes use the lightweight PATCH endpoint and refresh local state.
    try {
      const payload = await updateStatus(id, newStatus);
      setApplication(payload.application);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddNote(event) {
    event.preventDefault();
    if (!note.trim()) return;

    setIsSavingNote(true);
    try {
      // Adding a note creates a new row, then reloads to show the newest note first.
      await addNote(id, note.trim());
      setNote("");
      refreshApplication();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSavingNote(false);
    }
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
      {error ? (
        <div className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-800">
          {error}
        </div>
      ) : null}

      <section className="rounded-md border border-line bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-slate-600">
          You are at Application details
        </p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-normal">
                {application.role}
              </h1>
              <StatusBadge status={application.status} />
            </div>
            <p className="mt-2 text-lg text-slate-600">{application.company}</p>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem label="Location" value={application.location || "Not set"} />
              <DetailItem label="Salary" value={application.salary || "Not set"} />
              <DetailItem
                label="Date Applied"
                value={formatDate(application.date_applied)}
              />
              <DetailItem
                label="Job URL"
                value={
                  application.job_url ? (
                    <a
                      href={application.job_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-700 hover:text-brand-600"
                    >
                      Open posting
                    </a>
                  ) : (
                    "Not set"
                  )
                }
              />
            </dl>
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
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Update status</h2>
          <label className="mt-4 block">
            <span className="sr-only">Status</span>
            <select
              value={application.status}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="focus-ring h-11 w-full rounded-md border border-line bg-white px-3 text-sm"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <h2 className="mt-8 text-lg font-semibold text-ink">Status history</h2>
          <ol className="mt-4 space-y-3">
            {application.status_history.length ? (
              application.status_history.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-md border border-line bg-mist p-3 text-sm"
                >
                  <p className="font-medium">
                    {entry.old_status ? `${entry.old_status} to ${entry.new_status}` : `Created as ${entry.new_status}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(entry.changed_at)}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-600">No status changes yet.</li>
            )}
          </ol>
        </section>

        <section className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Notes</h2>
          <form onSubmit={handleAddNote} className="mt-4 space-y-3">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              placeholder="Add interview notes, follow-ups, or next steps"
              className="focus-ring w-full rounded-md border border-line bg-white px-3 py-3 text-sm"
            />
            <button
              type="submit"
              disabled={isSavingNote || !note.trim()}
              className="focus-ring rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingNote ? "Adding..." : "Add Note"}
            </button>
          </form>

          <div className="mt-6 space-y-3">
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
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete application?"
        message="This will permanently remove the application, notes, and status history."
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
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-ink">{value}</dd>
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
