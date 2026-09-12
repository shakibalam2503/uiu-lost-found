const { db } = require("../config/firebase");

const MATCHES_COLLECTION = "matches";

// Create a new match
const createMatch = async (matchData) => {
  const matchRef = db.collection(MATCHES_COLLECTION).doc();

  const data = {
    id: matchRef.id,
    ...matchData,
  };

  await matchRef.set(data);

  return data;
};

// Get a match by ID
const getMatchById = async (id) => {
  const matchRef = db
    .collection(MATCHES_COLLECTION)
    .doc(id);

  const snapshot = await matchRef.get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data();
};

// Get matches for a lost item
const getMatchesByLostItemId = async (lostItemId) => {
  const snapshot = await db
    .collection(MATCHES_COLLECTION)
    .where("lostItemId", "==", lostItemId)
    .orderBy("matchScore", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

// Get matches for a found item
const getMatchesByFoundItemId = async (foundItemId) => {
  const snapshot = await db
    .collection(MATCHES_COLLECTION)
    .where("foundItemId", "==", foundItemId)
    .orderBy("matchScore", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

module.exports = {
  createMatch,
  getMatchById,
  getMatchesByLostItemId,
  getMatchesByFoundItemId,
};