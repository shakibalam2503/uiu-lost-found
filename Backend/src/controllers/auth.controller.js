const { getOrCreateUser } = require("../services/user.service");

const getCurrentUser = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.user);

    return res.status(200).json({
      success: true,
      message: "Authenticated user retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get current user error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      error: {
        code: "USER_RETRIEVAL_FAILED",
      },
    });
  }
};
module.exports = {
  getCurrentUser,}