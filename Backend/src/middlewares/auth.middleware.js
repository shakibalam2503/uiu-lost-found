const { adminAuth } = require("../config/firebase");
const { validateUniversityUser } = require("../services/auth.service");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: {
          code: "AUTH_TOKEN_MISSING",
        },
      });
    }

    const idToken = authHeader.split("Bearer ")[1];

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const userValidation = validateUniversityUser(decodedToken.email);

    if (!userValidation.valid) {
      return res.status(403).json({
        success: false,
        message: "University account required",
        error: {
          code: "UNIVERSITY_ACCOUNT_REQUIRED",
        },
      });
    }

    req.user = decodedToken;
    req.user.role = userValidation.role;

    next();
  } catch (error) {
    console.error("Firebase token verification error:");
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
      error: {
        code: "AUTH_TOKEN_INVALID",
      },
    });
  }
};

module.exports = {
  authenticate,
};