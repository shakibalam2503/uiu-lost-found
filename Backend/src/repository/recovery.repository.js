const { db } = require("../config/firebase");

const RECOVERIES_COLLECTION = "recoveries";

// Create recovery
const createRecovery = async (recoveryData) => {
  const recoveryRef = db.collection(RECOVERIES_COLLECTION).doc();

  const data = {
    id: recoveryRef.id,
    ...recoveryData,
  };

  await recoveryRef.set(data);

  return data;
};

// Get recovery by ID
const getRecoveryById = async (id) => {
  const recoveryRef = db
    .collection(RECOVERIES_COLLECTION)
    .doc(id);

  const snapshot = await recoveryRef.get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data();
};

// Get recoveries for a student
const getRecoveriesByUserId = async (userId, limit = 20) => {
  const snapshot = await db
    .collection(RECOVERIES_COLLECTION)
    .where("studentId", "==", userId)
    .limit(limit)
    .get();

  const recoveries = snapshot.docs.map((doc) => doc.data());

  recoveries.sort((a, b) => {
    const dateA = a.recoveredAt?.toDate
      ? a.recoveredAt.toDate()
      : new Date(a.recoveredAt);

    const dateB = b.recoveredAt?.toDate
      ? b.recoveredAt.toDate()
      : new Date(b.recoveredAt);

    return dateB - dateA;
  });

  return recoveries;
};

// Get all recoveries
const getRecoveries = async (limit = 50) => {
  const snapshot = await db
    .collection(RECOVERIES_COLLECTION)
    .orderBy("recoveredAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

module.exports = {
  createRecovery,
  getRecoveryById,
  getRecoveriesByUserId,
  getRecoveries,
};