const { checkHealth } = require("../services/health.service");

const getHealth = async (req, res) => {
  try {
    const health = await checkHealth();

    res.status(200).json({
      success: true,
      message: "Lost & Found API is healthy",
      data: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Lost & Found API is unhealthy",
      error: {
        code: "FIRESTORE_UNAVAILABLE",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = {
  getHealth,
};