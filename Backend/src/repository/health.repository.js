const { db } = require("../config/firebase");

const checkFirestoreConnection = async () => {
  const healthRef = db.collection("system").doc("health-check");

  await healthRef.set({
    status: "ok",
    checkedAt: new Date(),
  });

  await healthRef.get();

  return true;
};

module.exports = {
  checkFirestoreConnection,
};