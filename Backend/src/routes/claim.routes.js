const express = require("express");

const {
  createClaim,
  getMyClaims,
  getClaims,
  getClaimById,
  updateClaimStatus,
} = require("../controllers/claim.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/authorize.middleware");

const router = express.Router();

// Student/Faculty submits ownership claim
router.post(
  "/",
  authenticate,
  authorize("student", "faculty"),
  createClaim
);

// Student/Faculty views own claims
router.get(
  "/my",
  authenticate,
  authorize("student", "faculty"),
  getMyClaims
);

// Staff/Admin views all claims
router.get(
  "/",
  authenticate,
  authorize("staff", "admin"),
  getClaims
);

// View individual claim
router.get(
  "/:id",
  authenticate,
  getClaimById
);

// Staff/Admin approves/rejects
router.patch(
  "/:id/status",
  authenticate,
  authorize("staff", "admin"),
  updateClaimStatus
);

module.exports = router;