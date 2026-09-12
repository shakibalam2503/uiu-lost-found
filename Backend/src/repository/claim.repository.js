const { db } = require("../config/firebase");

const CLAIMS_COLLECTION = "claims";

// Create claim
const createClaim = async (claimData) => {
  const claimRef = db.collection(CLAIMS_COLLECTION).doc();

  const data = {
    id: claimRef.id,
    ...claimData,
  };

  await claimRef.set(data);

  return data;
};

// Get claim by ID
const getClaimById = async (id) => {
  const claimRef = db.collection(CLAIMS_COLLECTION).doc(id);
  const snapshot = await claimRef.get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data();
};

// Get claims submitted by a student
const getClaimsByUserId = async (userId, limit = 20) => {
  const snapshot = await db
    .collection(CLAIMS_COLLECTION)
    .where("claimantId", "==", userId)
    .limit(limit)
    .get();

  const claims = snapshot.docs.map((doc) => doc.data());

  // Sort newest first
  claims.sort((a, b) => {
    const dateA = a.createdAt?.toDate
      ? a.createdAt.toDate()
      : new Date(a.createdAt);

    const dateB = b.createdAt?.toDate
      ? b.createdAt.toDate()
      : new Date(b.createdAt);

    return dateB - dateA;
  });

  return claims;
};

// Get all claims for staff/admin
const getClaims = async (limit = 50) => {
  const snapshot = await db
    .collection(CLAIMS_COLLECTION)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

// Update claim
const updateClaim = async (id, updateData) => {
  const claimRef = db.collection(CLAIMS_COLLECTION).doc(id);

  await claimRef.update({
    ...updateData,
    updatedAt: new Date(),
  });

  const snapshot = await claimRef.get();

  return snapshot.data();
};

module.exports = {
  createClaim,
  getClaimById,
  getClaimsByUserId,
  getClaims,
  updateClaim,
};