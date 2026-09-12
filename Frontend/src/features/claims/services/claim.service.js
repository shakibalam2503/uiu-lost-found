import { apiRequest } from "../../../services/api.service";
import { auth } from "../../../config/firebase";

async function getIdToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
}

/**
 * Fetch claims submitted by the logged-in student/faculty user
 * GET /api/claims/my
 */
export async function getMyClaims() {
  const token = await getIdToken();
  const response = await apiRequest("/claims/my", { token });
  return response.data || [];
}

/**
 * Fetch all claims across campus (Staff / Admin only)
 * GET /api/claims
 */
export async function getClaims() {
  const token = await getIdToken();
  const response = await apiRequest("/claims", { token });
  return response.data || [];
}

/**
 * Fetch a single claim by ID
 * GET /api/claims/:id
 */
export async function getClaimById(id) {
  const token = await getIdToken();
  const response = await apiRequest(`/claims/${id}`, { token });
  return response.data;
}

/**
 * Submit an ownership claim for a found item (Student / Faculty)
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

/**
 * Staff / Admin approves or rejects a claim
 * PATCH /api/claims/:id/status
 */
export async function updateClaimStatus(id, { status, staffNote }) {
  const token = await getIdToken();
  const response = await apiRequest(`/claims/${id}/status`, {
    method: "PATCH",
    token,
    body: { status, staffNote },
  });
  return response.data;
}
