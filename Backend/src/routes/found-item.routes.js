const express = require("express");
const { upload } = require("../middlewares/upload.middleware");
const {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  updateFoundItem,
  deleteFoundItem,
} = require("../controllers/found-item.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/authorize.middleware");

const router = express.Router();

// Staff/Admin can register found items
router.post(
  "/",
  authenticate,
  authorize("staff", "admin"),
  upload.single("image"),
  createFoundItem
);

// Authenticated users can browse found items
router.get("/", authenticate, getFoundItems);

// Authenticated users can view one found item
router.get("/:id", authenticate, getFoundItemById);

// Staff/Admin can update found items
router.put(
  "/:id",
  authenticate,
  authorize("staff", "admin"),
  updateFoundItem
);

// Staff/Admin can delete found items
router.delete(
  "/:id",
  authenticate,
  authorize("staff", "admin"),
  deleteFoundItem
);

module.exports = router;