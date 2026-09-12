const {
  checkFirestoreConnection,
} = require("../repository/health.repository");

const checkHealth = async () => {
  try {
    await checkFirestoreConnection();

    return {
      api: "ok",
      firestore: "ok",
    };
  } catch (error) {
    throw new Error("Firestore connection failed");
  }
};

module.exports = {
  checkHealth,
};