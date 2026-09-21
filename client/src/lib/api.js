export async function apiRequest(path, options = {}) {
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`/api${path}`, {
    ...options,
    headers,
  });
}