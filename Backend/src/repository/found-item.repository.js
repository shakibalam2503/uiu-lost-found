const { db } = require("../config/firebase");

const FOUND_ITEMS_COLLECTION = "found_items";

// Create a new found item
const createFoundItem = async (foundItemData) => {
  const foundItemRef = db.collection(FOUND_ITEMS_COLLECTION).doc();

  const data = {
    id: foundItemRef.id,
    ...foundItemData,
  };

  await foundItemRef.set(data);

  return data;
};

// Get a found item by ID
const getFoundItemById = async (id) => {
  const foundItemRef = db.collection(FOUND_ITEMS_COLLECTION).doc(id);

  const foundItemSnapshot = await foundItemRef.get();

  if (!foundItemSnapshot.exists) {
    return null;
  }

  return foundItemSnapshot.data();
};

// Get found items
const getFoundItems = async (
  limit = 10,
  category = null,
  status = null,
  color = null,
  building = null,
  floor = null
) => {
  let query = db
    .collection(FOUND_ITEMS_COLLECTION)
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

// Update a found item
const updateFoundItem = async (id, updateData) => {
  const foundItemRef = db.collection(FOUND_ITEMS_COLLECTION).doc(id);

  await foundItemRef.update({
    ...updateData,
    updatedAt: new Date(),
  });

  const updatedSnapshot = await foundItemRef.get();

  return updatedSnapshot.data();
};

// Delete a found item
const deleteFoundItem = async (id) => {
  const foundItemRef = db.collection(FOUND_ITEMS_COLLECTION).doc(id);

  await foundItemRef.delete();
};

module.exports = {
  createFoundItem,
  getFoundItemById,
  getFoundItems,
  updateFoundItem,
  deleteFoundItem,
};