import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ApplicationForm from "../components/ApplicationForm.jsx";
import {
  addNote,
  createApplication,
  getApplication,
  updateApplication,
} from "../services/api.js";

export default function ApplicationFormPage() {
  const { id } = useParams();
  // The same route component handles both create and edit; id means edit mode.
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [initialNote, setInitialNote] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    // In edit mode, fetch the existing record and prefill the reusable form.
    getApplication(id)
      .then((payload) => {
        const { notes, status_history, ...application } = payload.application;
        const latestNote = notes?.[0]?.content || "";
        setInitialValues({ ...application, notes: latestNote });
        setInitialNote(latestNote);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode]);

  async function handleSubmit(form) {
    setIsSaving(true);
    setError("");

    try {
      const payload = isEditMode
        ? await updateApplication(id, form)
        : await createApplication(form);

      const applicationId = payload.application.id;
      const trimmedNote = form.notes.trim();
      // Notes are append-only, so only create a new note when the note text changed.
      if (trimmedNote && (!isEditMode || trimmedNote !== initialNote.trim())) {
        await addNote(applicationId, trimmedNote);
      }

      navigate(`/applications/${applicationId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md border border-line bg-white p-8 text-center shadow-sm">
        Loading application...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-md border border-line bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-600">
          You are at {isEditMode ? "Edit application" : "New application"}
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-700">
            {isEditMode ? "Edit application" : "New application"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">
            {isEditMode ? "Update application details" : "Add a new opportunity"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Enter the key role details and keep notes for follow-up actions.
          </p>
        </div>
        <Link
          to={isEditMode ? `/applications/${id}` : "/applications"}
          className="text-sm font-semibold text-brand-700 hover:text-brand-600"
        >
          Back
        </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-800">
          {error}
        </div>
      ) : null}

      <ApplicationForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel={isEditMode ? "Update Application" : "Create Application"}
        isSaving={isSaving}
      />
    </div>
  );
}
