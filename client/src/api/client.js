const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function buildHeaders(token, hasJson = true) {
  const headers = {};

  if (hasJson) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Произошла ошибка запроса.");
  }

  return data;
}

export const api = {
  get: (path, token) => request(path, { headers: buildHeaders(token, false) }),
  post: (path, body, token) =>
    request(path, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(body)
    }),
  put: (path, body, token) =>
    request(path, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify(body)
    }),
  patch: (path, body, token) =>
    request(path, {
      method: "PATCH",
      headers: buildHeaders(token),
      body: JSON.stringify(body)
    }),
  delete: (path, token) =>
    request(path, {
      method: "DELETE",
      headers: buildHeaders(token, false)
    })
};
