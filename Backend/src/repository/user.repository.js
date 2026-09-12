const { db } = require("../config/firebase");

const USERS_COLLECTION = "users";

const getUserById = async (uid) => {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);
  const userSnapshot = await userRef.get();

  if (!userSnapshot.exists) {
    return null;
  }

  return userSnapshot.data();
};

const createUser = async (uid, userData) => {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);

  await userRef.set(userData);

  return userData;
};

const updateUser = async (uid, userData) => {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);

  await userRef.update(userData);

  const updatedSnapshot = await userRef.get();

  return updatedSnapshot.data();
};

module.exports = {
  getUserById,
  createUser,
  updateUser,
};