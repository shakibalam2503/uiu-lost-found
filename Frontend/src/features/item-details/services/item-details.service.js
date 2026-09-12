import { apiRequest } from "../../../services/api.service";
import { auth } from "../../../config/firebase";

async function getIdToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
}

/**
 * Fetch detailed information for a lost or found item
 * GET /api/lost-items/:id OR GET /api/found-items/:id
 */
export async function getItemDetails(itemType, id) {
  const token = await getIdToken();
  const endpoint = itemType === "lost" ? `/lost-items/${id}` : `/found-items/${id}`;
  const response = await apiRequest(endpoint, { token });
  
  const raw = response.data || {};
  return {
    ...raw,
    type: itemType,
    date: raw.lostDate || raw.foundDate || raw.createdAt,
  };
}

/**
 * Update an existing lost or found item
 * PUT /api/lost-items/:id OR PUT /api/found-items/:id
 */
export async function updateItemDetails(itemType, id, updateData) {
  const token = await getIdToken();
  const endpoint = itemType === "lost" ? `/lost-items/${id}` : `/found-items/${id}`;
  const response = await apiRequest(endpoint, {
    method: "PUT",
    token,
    body: updateData,
  });
  return response.data;
}

/**
 * Delete a lost or found item
 * DELETE /api/lost-items/:id OR DELETE /api/found-items/:id
 */
export async function deleteItemDetails(itemType, id) {
  const token = await getIdToken();
  const endpoint = itemType === "lost" ? `/lost-items/${id}` : `/found-items/${id}`;
  return await apiRequest(endpoint, {
    method: "DELETE",
    token,
  });
}

/**
 * Submit an ownership claim for a found item
 * POST /api/claims
 */
export async function submitOwnershipClaim({ foundItemId, lostItemId, claimDetails }) {
  const token = await getIdToken();
  const response = await apiRequest("/claims", {
    method: "POST",
    token,
    body: { foundItemId, lostItemId, claimDetails },
  });
  return response.data;
}
