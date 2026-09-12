const {
  initializeApp,
  applicationDefault,
} = require("firebase-admin/app");

const {
  getFirestore,
} = require("firebase-admin/firestore");

const {
  getAuth,
} = require("firebase-admin/auth");

initializeApp({
  credential: applicationDefault(),
  projectId: "university-lost-and-foun-cc4e2",
});

const db = getFirestore();
const adminAuth = getAuth();

module.exports = {
  db,
  adminAuth,
};