import { apiRequest } from "../../../services/api.service";
import { auth } from "../../../config/firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function getIdToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
}

/**
 * Fetch all found items
 * GET /api/found-items
 */
export async function getFoundItems(params = {}) {
  const token = await getIdToken();
  const queryParams = new URLSearchParams();

  if (params.limit) queryParams.append("limit", params.limit);
  if (params.category && params.category !== "all")
    queryParams.append("category", params.category);
  if (params.color && params.color !== "all")
    queryParams.append("color", params.color);
  if (params.building && params.building !== "all")
    queryParams.append("building", params.building);
  if (params.floor && params.floor !== "all")
    queryParams.append("floor", params.floor);

  const qs = queryParams.toString();
  const endpoint = `/found-items${qs ? `?${qs}` : ""}`;
  const response = await apiRequest(endpoint, { token });
  return (response.data || []).map((item) => ({
    ...item,
    type: "found",
    date: item.foundDate || item.createdAt,
  }));
}

/**
 * Fetch a single found item by ID
 * GET /api/found-items/:id
 */
export async function getFoundItemById(id) {
  const token = await getIdToken();
  const response = await apiRequest(`/found-items/${id}`, { token });
  return {
    ...response.data,
    type: "found",
    date: response.data.foundDate || response.data.createdAt,
  };
}

/**
 * Create a new found item (staff/admin only)
 * POST /api/found-items  — multipart/form-data
 */
export async function createFoundItem(formData) {
  const token = await getIdToken();
  const url = `${API_BASE_URL}/found-items`;

  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const json = await response.json();
  if (!response.ok || json.success === false) {
    const error = new Error(json.message || "Failed to register found item");
    error.status = response.status;
    error.code = json.error?.code || "CREATE_FAILED";
    throw error;
  }
  return json.data;
}

/**
 * Update a found item (staff/admin only)
 * PUT /api/found-items/:id
 */
export async function updateFoundItem(id, data) {
  const token = await getIdToken();
  const response = await apiRequest(`/found-items/${id}`, {
    method: "PUT",
    token,
    body: data,
  });
  return response.data;
}

/**
 * Delete a found item (staff/admin only)
 * DELETE /api/found-items/:id
 */
export async function deleteFoundItem(id) {
  const token = await getIdToken();
  return await apiRequest(`/found-items/${id}`, {
    method: "DELETE",
    token,
  });
}

/**
 * Submit a claim on a found item (student/faculty)
 * POST /api/claims
 */
export async function createClaim({ foundItemId, lostItemId, claimDetails }) {
  const token = await getIdToken();
  const response = await apiRequest("/claims", {
    method: "POST",
    token,
    body: { foundItemId, lostItemId, claimDetails },
  });
  return response.data;
}

