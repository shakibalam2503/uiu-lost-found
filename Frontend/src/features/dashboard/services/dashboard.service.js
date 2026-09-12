import { apiRequest } from "../../../services/api.service";
import { auth } from "../../../config/firebase";

/**
 * Helper to get current Firebase user ID token
 */
async function getIdToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
}

/**
 * Fetch lost items from backend API
 * GET /api/lost-items
 */
export async function fetchLostItems(params = {}) {
  const token = await getIdToken();
  const queryParams = new URLSearchParams();

  if (params.limit) queryParams.append("limit", params.limit);
  if (params.category && params.category !== "all") queryParams.append("category", params.category);
  if (params.status && params.status !== "all") queryParams.append("status", params.status);
  if (params.color && params.color !== "all") queryParams.append("color", params.color);
  if (params.building && params.building !== "all") queryParams.append("building", params.building);
  if (params.floor && params.floor !== "all") queryParams.append("floor", params.floor);

  const queryString = queryParams.toString();
  const endpoint = `/lost-items${queryString ? `?${queryString}` : ""}`;

  const response = await apiRequest(endpoint, { token });
  return (response.data || []).map((item) => ({
    ...item,
    type: "lost",
    date: item.lostDate || item.createdAt,
  }));
}

/**
 * Fetch found items from backend API
 * GET /api/found-items
 */
export async function fetchFoundItems(params = {}) {
  const token = await getIdToken();
  const queryParams = new URLSearchParams();

  if (params.limit) queryParams.append("limit", params.limit);
  if (params.category && params.category !== "all") queryParams.append("category", params.category);
  if (params.status && params.status !== "all") queryParams.append("status", params.status);
  if (params.color && params.color !== "all") queryParams.append("color", params.color);
  if (params.building && params.building !== "all") queryParams.append("building", params.building);
  if (params.floor && params.floor !== "all") queryParams.append("floor", params.floor);

  const queryString = queryParams.toString();
  const endpoint = `/found-items${queryString ? `?${queryString}` : ""}`;

  const response = await apiRequest(endpoint, { token });
  return (response.data || []).map((item) => ({
    ...item,
    type: "found",
    date: item.foundDate || item.createdAt,
  }));
}

/**
 * Fetch single lost item by ID
 * GET /api/lost-items/:id
 */
export async function fetchLostItemById(id) {
  const token = await getIdToken();
  const response = await apiRequest(`/lost-items/${id}`, { token });
  return {
    ...response.data,
    type: "lost",
    date: response.data.lostDate || response.data.createdAt,
  };
}

/**
 * Fetch single found item by ID
 * GET /api/found-items/:id
 */
export async function fetchFoundItemById(id) {
  const token = await getIdToken();
  const response = await apiRequest(`/found-items/${id}`, { token });
  return {
    ...response.data,
    type: "found",
    date: response.data.foundDate || response.data.createdAt,
  };
}
