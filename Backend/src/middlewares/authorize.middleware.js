const userRepository = require("../repository/user.repository");

const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
          error: {
            code: "AUTHENTICATION_REQUIRED",
          },
        });
      }

      const user = await userRepository.getUserById(req.user.uid);

      if (!user) {
        return res.status(403).json({
          success: false,
          message: "Application user not found",
          error: {
            code: "USER_NOT_FOUND",
          },
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource",
          error: {
            code: "INSUFFICIENT_PERMISSIONS",
          },
        });
      }

      req.user.role = user.role;
      req.user.applicationUser = user;

      next();
    } catch (error) {
      console.error("Authorization error:");
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to verify user permissions",
        error: {
          code: "AUTHORIZATION_FAILED",
        },
      });
    }
  };
};

module.exports = {
  authorize,
};