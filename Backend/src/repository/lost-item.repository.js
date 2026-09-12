const { db } = require("../config/firebase");

const LOST_ITEMS_COLLECTION = "lost_items";

const createLostItem = async (lostItemData) => {
  const lostItemRef = db.collection(LOST_ITEMS_COLLECTION).doc();

  const data = {
    id: lostItemRef.id,
    ...lostItemData,
  };

  await lostItemRef.set(data);

  return data;
};

const getLostItemById = async (id) => {
  
  const lostItemRef = db
    .collection(LOST_ITEMS_COLLECTION)
    .doc(id);

  const lostItemSnapshot = await lostItemRef.get();

  if (!lostItemSnapshot.exists) {
    return null;
  }

  return lostItemSnapshot.data();
};
const getLostItems = async (
  limit = 10,
  category = null,
  status = null,
  color = null,
  building = null,
  floor = null
) => {
  let query = db
    .collection(LOST_ITEMS_COLLECTION)
    .orderBy("createdAt", "desc");

  if (category) {
    query = query.where("category", "==", category);
  }

  if (status) {
    query = query.where("status", "==", status);
  }

  if (color) {
    query = query.where("color", "==", color);
  }

  if (building) {
    query = query.where("building", "==", building);
  }

  if (floor) {
    query = query.where("floor", "==", floor);
  }

  const snapshot = await query.limit(limit).get();

  return snapshot.docs.map((doc) => doc.data());
};
const getLostItemsByUserId = async (userId, limit = 10) => {
  const snapshot = await db
    .collection(LOST_ITEMS_COLLECTION)
    .where("reportedBy", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data());
};
const updateLostItem = async (id, updateData) => {
  const lostItemRef = db
    .collection(LOST_ITEMS_COLLECTION)
    .doc(id);

  await lostItemRef.update({
    ...updateData,
    updatedAt: new Date(),
  });

  const updatedSnapshot = await lostItemRef.get();

  return updatedSnapshot.data();
};

const deleteLostItem = async (id) => {
  const lostItemRef = db
    .collection(LOST_ITEMS_COLLECTION)
    .doc(id);

  await lostItemRef.delete();
};
module.exports = {
  createLostItem,
  getLostItemById,
  getLostItems,
  getLostItemsByUserId,
  updateLostItem,
  deleteLostItem,
};