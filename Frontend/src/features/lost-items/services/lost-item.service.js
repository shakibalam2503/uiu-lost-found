import { apiRequest } from "../../../services/api.service";
import { auth } from "../../../config/firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Helper to get current Firebase user ID token
 */
async function getIdToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
}

/**
 * Create a new lost item report
 * POST /api/lost-items
 * Uses multipart/form-data for image upload
 */
export async function createLostItem(formData) {
  const token = await getIdToken();
  const url = `${API_BASE_URL}/lost-items`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type; browser sets it with correct boundary for FormData
    },
    body: formData,
  });

  const json = await response.json();
  if (!response.ok || json.success === false) {
    const error = new Error(json.message || "Failed to report lost item");
    error.status = response.status;
    error.code = json.error?.code || "CREATE_FAILED";
    throw error;
  }
  return json.data;
}

/**
 * Fetch all lost items (with filters)
 * GET /api/lost-items
 */
export async function getLostItems(params = {}) {
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
  const endpoint = `/lost-items${qs ? `?${qs}` : ""}`;
  const response = await apiRequest(endpoint, { token });
  return (response.data || []).map((item) => ({
    ...item,
    type: "lost",
    date: item.lostDate || item.createdAt,
  }));
}

/**
 * Fetch the current user's own lost items
 * GET /api/lost-items/my
 */
export async function getMyLostItems(params = {}) {
  const token = await getIdToken();
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.append("limit", params.limit);
  const qs = queryParams.toString();
  const endpoint = `/lost-items/my${qs ? `?${qs}` : ""}`;
  const response = await apiRequest(endpoint, { token });
  return (response.data || []).map((item) => ({
    ...item,
    type: "lost",
    date: item.lostDate || item.createdAt,
  }));
}

/**
 * Fetch a single lost item by ID
 * GET /api/lost-items/:id
 */
export async function getLostItemById(id) {
  const token = await getIdToken();
  const response = await apiRequest(`/lost-items/${id}`, { token });
  return {
    ...response.data,
    type: "lost",
    date: response.data.lostDate || response.data.createdAt,
  };
}

/**
 * Update a lost item by ID
 * PUT /api/lost-items/:id
 */
export async function updateLostItem(id, data) {
  const token = await getIdToken();
  const response = await apiRequest(`/lost-items/${id}`, {
    method: "PUT",
    token,
    body: data,
  });
  return response.data;
}

/**
 * Delete a lost item by ID
 * DELETE /api/lost-items/:id
 */
export async function deleteLostItem(id) {
  const token = await getIdToken();
  const response = await apiRequest(`/lost-items/${id}`, {
    method: "DELETE",
    token,
  });
  return response;
}
