const express = require("express");

const {
  createRecovery,
  getMyRecoveries,
  getRecoveries,
  getRecoveryById,
} = require("../controllers/recovery.controller");

const {
  authenticate,
} = require("../middlewares/auth.middleware");

const {
  authorize,
} = require("../middlewares/authorize.middleware");

const router = express.Router();


// Staff/Admin confirms physical recovery
router.post(
  "/",
  authenticate,
  authorize("staff", "admin"),
  createRecovery
);


// Student views own recovery records
router.get(
  "/my",
  authenticate,
  authorize("student", "faculty"),
  getMyRecoveries
);


// Staff/Admin views all recovery records
router.get(
  "/",
  authenticate,
  authorize("staff", "admin"),
  getRecoveries
);


// Get individual recovery
router.get(
  "/:id",
  authenticate,
  getRecoveryById
);


module.exports = router;