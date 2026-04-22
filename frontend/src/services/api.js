const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  // Central fetch wrapper: every API call gets JSON headers and consistent errors.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    // DELETE returns 204 No Content, so there is no JSON body to parse.
    return null;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Something went wrong");
  }

  return payload;
}

export const STATUSES = [
  // Keep this list in sync with backend/models.py.
  "Wishlist",
  "Applied",
  "OA",
  "Interviewing",
  "Offer",
  "Rejected",
  "Ghosted",
];

export function getDashboardSummary() {
  return request("/dashboard/summary");
}

export function getApplications(params = {}) {
  // Only include active filters in the query string.
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return request(`/applications${query ? `?${query}` : ""}`);
}

export function getApplication(id) {
  return request(`/applications/${id}`);
}

export function createApplication(data) {
  return request("/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateApplication(id, data) {
  return request(`/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteApplication(id) {
  return request(`/applications/${id}`, {
    method: "DELETE",
  });
}

export function addNote(id, content) {
  return request(`/applications/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function updateStatus(id, status) {
  return request(`/applications/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
