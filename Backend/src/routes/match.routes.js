const express = require("express");

const {
  testMatch,
} = require("../controllers/match.controller");

const {
  authenticate,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/test",
  authenticate,
  testMatch
);

module.exports = router;