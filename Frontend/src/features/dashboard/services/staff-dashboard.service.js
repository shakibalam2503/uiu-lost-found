import { getLostItems } from "../../lost-items/services/lost-item.service";
import { getFoundItems } from "../../found-items/services/found-item.service";
import { getClaims } from "../../claims/services/claim.service";
import { getRecoveries } from "../../recovery/services/recovery.service";

/**
 * Fetch and aggregate all staff dashboard statistics and recent activity sections
 */
export async function getStaffDashboardData() {
  const [lostRes, foundRes, claimsRes, recoveriesRes] = await Promise.allSettled([
    getLostItems(),
    getFoundItems(),
    getClaims(),
    getRecoveries(),
  ]);

  const lostItems = lostRes.status === "fulfilled" && Array.isArray(lostRes.value) ? lostRes.value : [];
  const foundItems = foundRes.status === "fulfilled" && Array.isArray(foundRes.value) ? foundRes.value : [];
  const claims = claimsRes.status === "fulfilled" && Array.isArray(claimsRes.value) ? claimsRes.value : [];
  const recoveries = recoveriesRes.status === "fulfilled" && Array.isArray(recoveriesRes.value) ? recoveriesRes.value : [];

  // Calculate statistics
  const stats = {
    totalLostItems: lostItems.length,
    totalFoundItems: foundItems.length,
    pendingClaims: claims.filter((c) => c.status === "pending").length,
    approvedClaims: claims.filter((c) => c.status === "approved").length,
    recoveredItems: recoveries.length,
  };

  // Sort and slice recent activity sections
  const pendingClaims = claims
    .filter((c) => c.status === "pending")
    .sort((a, b) => new Date(b.createdAt || b.submittedAt || 0) - new Date(a.createdAt || a.submittedAt || 0))
    .slice(0, 6);

  const recentFoundItems = [...foundItems]
    .sort((a, b) => new Date(b.createdAt || b.foundDate || 0) - new Date(a.createdAt || a.foundDate || 0))
    .slice(0, 6);

  const recentLostItems = [...lostItems]
    .sort((a, b) => new Date(b.createdAt || b.lostDate || 0) - new Date(a.createdAt || a.lostDate || 0))
    .slice(0, 6);

  const recentRecoveries = [...recoveries]
    .sort((a, b) => new Date(b.createdAt || b.recoveredAt || 0) - new Date(a.createdAt || a.recoveredAt || 0))
    .slice(0, 6);

  return {
    stats,
    pendingClaims,
    recentFoundItems,
    recentLostItems,
    recentRecoveries,
    rawCounts: {
      lost: lostItems.length,
      found: foundItems.length,
      claims: claims.length,
      recoveries: recoveries.length,
    },
  };
}
