const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const {
  getFirestore,
  FieldValue,
} = require("firebase-admin/firestore");

admin.initializeApp();

const db = getFirestore();


// ----------------------------------------
// Calculate match score
// ----------------------------------------

const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;

  // Category = 30
  if (
    lostItem.category &&
    foundItem.category &&
    lostItem.category.toLowerCase() ===
      foundItem.category.toLowerCase()
  ) {
    score += 30;
  }

  // Color = 20
  if (
    lostItem.color &&
    foundItem.color &&
    lostItem.color.toLowerCase() ===
      foundItem.color.toLowerCase()
  ) {
    score += 20;
  }

  // Building = 20
  if (
    lostItem.building &&
    foundItem.building &&
    lostItem.building.toLowerCase() ===
      foundItem.building.toLowerCase()
  ) {
    score += 20;
  }

  // Floor = 10
  if (
    lostItem.floor &&
    foundItem.floor &&
    lostItem.floor.toString() ===
      foundItem.floor.toString()
  ) {
    score += 10;
  }

  // Date = 10
  if (lostItem.lostDate && foundItem.foundDate) {
    const lostDate = new Date(lostItem.lostDate);
    const foundDate = new Date(foundItem.foundDate);

    const differenceInDays =
      Math.abs(foundDate - lostDate) /
      (1000 * 60 * 60 * 24);

    if (differenceInDays <= 3) {
      score += 10;
    }
  }

  // Title = 10
  if (lostItem.title && foundItem.title) {
    const lostTitle = lostItem.title.toLowerCase();
    const foundTitle = foundItem.title.toLowerCase();

    if (
      lostTitle.includes(foundTitle) ||
      foundTitle.includes(lostTitle)
    ) {
      score += 10;
    }
  }

  return score;
};


// ----------------------------------------
// Create match
// ----------------------------------------

const createMatch = async (lostItem, foundItem) => {
  const score = calculateMatchScore(
    lostItem,
    foundItem
  );

  // Ignore weak matches
  if (score < 60) {
    return null;
  }

  const status =
    score >= 80
      ? "strong"
      : "possible";

  /*
   * Deterministic document ID prevents
   * duplicate matches if Firebase retries
   * the Cloud Function.
   */
  const matchId =
    `${lostItem.id}_${foundItem.id}`;

  const matchRef = db
    .collection("matches")
    .doc(matchId);

  await matchRef.set(
    {
      id: matchId,

      lostItemId: lostItem.id,
      foundItemId: foundItem.id,

      matchScore: score,
      status,

      createdAt:
        FieldValue.serverTimestamp(),

      updatedAt:
        FieldValue.serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return {
    matchId,
    score,
    status,
  };
};


// ----------------------------------------
// NEW FOUND ITEM
// Search existing LOST items
// ----------------------------------------

exports.matchFoundItem = onDocumentCreated(
  "found_items/{foundItemId}",
  async (event) => {

    const foundItem = event.data?.data();

    if (!foundItem) {
      return;
    }

    // Use Firestore document ID.
    // Don't depend on an "id" field inside the document.
    foundItem.id = event.params.foundItemId;

    const lostItemsSnapshot = await db
      .collection("lost_items")
      .where("status", "==", "lost")
      .get();

    let matchesCreated = 0;

    for (const doc of lostItemsSnapshot.docs) {

      const lostItem = doc.data();

      const result = await createMatch(
        lostItem,
        foundItem
      );

      if (result) {
        matchesCreated++;
      }
    }

    console.log(
      `Found item ${foundItem.id}: ${matchesCreated} match(es) created`
    );
  }
);


// ----------------------------------------
// NEW LOST ITEM
// Search existing FOUND items
// ----------------------------------------

exports.matchLostItem = onDocumentCreated(
  "lost_items/{lostItemId}",
  async (event) => {

    const lostItem = event.data?.data();

    if (!lostItem) {
      return;
    }

    // Use Firestore document ID.
    lostItem.id = event.params.lostItemId;

    const foundItemsSnapshot = await db
      .collection("found_items")
      .where("status", "==", "found")
      .get();

    let matchesCreated = 0;

    for (const doc of foundItemsSnapshot.docs) {

      const foundItem = doc.data();

      foundItem.id = event.params
        ? doc.id
        : foundItem.id;

      const result = await createMatch(
        lostItem,
        foundItem
      );

      if (result) {
        matchesCreated++;
      }
    }

    console.log(
      `Lost item ${lostItem.id}: ${matchesCreated} match(es) created`
    );
  }
);