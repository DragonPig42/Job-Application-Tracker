import { useMemo, useState } from "react";

import { STATUSES } from "../services/api.js";

const emptyForm = {
  // Defaults used for create mode; edit mode merges fetched data over these values.
  company: "",
  role: "",
  location: "",
  salary: "",
  job_url: "",
  status: "Wishlist",
  date_applied: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function ApplicationForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Application",
  isSaving = false,
}) {
  const startingValues = useMemo(
    // Recompute defaults only when the parent provides new initial data.
    () => ({ ...emptyForm, ...(initialValues || {}) }),
    [initialValues]
  );
  const [form, setForm] = useState(startingValues);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    // Clear that field's validation error as soon as the user edits it.
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate() {
    // The backend validates too; this gives faster feedback before the request.
    const nextErrors = {};
    ["company", "role", "status", "date_applied"].forEach((field) => {
      if (!String(form[field] || "").trim()) {
        nextErrors[field] = "Required";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 rounded-md border border-line bg-white p-5 shadow-sm md:grid-cols-2">
        <Field
          label="Company"
          value={form.company}
          error={errors.company}
          onChange={(value) => updateField("company", value)}
          required
        />
        <Field
          label="Role"
          value={form.role}
          error={errors.role}
          onChange={(value) => updateField("role", value)}
          required
        />
        <Field
          label="Location"
          value={form.location}
          onChange={(value) => updateField("location", value)}
        />
        <Field
          label="Salary"
          value={form.salary}
          onChange={(value) => updateField("salary", value)}
          placeholder="$120k - $140k"
        />
        <Field
          label="Job URL"
          value={form.job_url}
          onChange={(value) => updateField("job_url", value)}
          type="url"
          placeholder="https://..."
        />
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Status</span>
          <select
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
            className="focus-ring mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.status ? (
            <span className="mt-1 block text-xs font-medium text-orange-700">
              {errors.status}
            </span>
          ) : null}
        </label>
        <Field
          label="Date Applied"
          value={form.date_applied}
          error={errors.date_applied}
          onChange={(value) => updateField("date_applied", value)}
          type="date"
          required
        />
        <label className="block md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Notes</span>
          <textarea
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            rows={5}
            className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-3 text-sm"
            placeholder="Interview details, follow-up reminders, recruiter names..."
          />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="focus-ring rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder = "",
  required = false,
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="text-orange-700"> *</span> : null}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="focus-ring mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm"
      />
      {error ? (
        <span className="mt-1 block text-xs font-medium text-orange-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}
