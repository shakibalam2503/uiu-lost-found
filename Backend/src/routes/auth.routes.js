const express = require("express");

const {getCurrentUser} = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/authorize.middleware");

const router = express.Router();

router.get("/me", authenticate, getCurrentUser);


module.exports = router;