const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Custom error class for API response errors.
 */
export class ApiError extends Error {
  constructor(message, status, code = "API_ERROR", data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

/**
 * Generic API request wrapper.
 * @param {string} endpoint - API path (e.g. "/auth/me")
 * @param {Object} options - Fetch options including method, headers, token, body
 */
export async function apiRequest(endpoint, { method = "GET", token = null, body = null, headers = {} } = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new ApiError(
      "Network error. Please check your connection and try again.",
      0,
      "NETWORK_ERROR"
    );
  }

  let jsonResult = null;
  try {
    jsonResult = await response.json();
  } catch (e) {
    if (!response.ok) {
      throw new ApiError(
        `Server returned error status: ${response.status}`,
        response.status,
        "SERVER_ERROR"
      );
    }
  }

  if (!response.ok || (jsonResult && jsonResult.success === false)) {
    const message = jsonResult?.message || `Request failed with status ${response.status}`;
    const code = jsonResult?.error?.code || `HTTP_${response.status}`;
    throw new ApiError(message, response.status, code, jsonResult);
  }

  return jsonResult;
}
