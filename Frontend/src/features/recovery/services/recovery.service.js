import { apiRequest } from "../../../services/api.service";
import { auth } from "../../../config/firebase";

async function getIdToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
}

/**
 * Fetch recovery records for the logged-in student / faculty user
 * GET /api/recoveries/my
 */
export async function getMyRecoveries() {
  const token = await getIdToken();
  const response = await apiRequest("/recoveries/my", { token });
  return response.data || [];
}

/**
 * Fetch all campus recovery records (Staff / Admin only)
 * GET /api/recoveries
 */
export async function getRecoveries() {
  const token = await getIdToken();
  const response = await apiRequest("/recoveries", { token });
  return response.data || [];
}

/**
 * Fetch a single recovery record by ID
 * GET /api/recoveries/:id
 */
export async function getRecoveryById(id) {
  const token = await getIdToken();
  const response = await apiRequest(`/recoveries/${id}`, { token });
  return response.data;
}

/**
 * Confirm physical handover & create recovery record (Staff / Admin only)
 * POST /api/recoveries
 */
export async function createRecovery({ claimId, notes }) {
  const token = await getIdToken();
  const response = await apiRequest("/recoveries", {
    method: "POST",
    token,
    body: { claimId, notes: notes ? notes.trim() : null },
  });
  return response.data;
}
