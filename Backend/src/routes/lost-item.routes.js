const express = require("express");
const { upload } = require("../middlewares/upload.middleware");
const {
  createLostItem,
  getLostItemById,
  getLostItems,
  getMyLostItems,
  updateLostItem,
  deleteLostItem,
} = require("../controllers/lost-item.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/authorize.middleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("student", "faculty"),
  upload.single("image"),
  createLostItem
);
router.get(
  "/",
  authenticate,
  getLostItems
);
router.get(
  "/my",
  authenticate,
  getMyLostItems
);
router.put(
  "/:id",
  authenticate,
  authorize("student", "faculty"),
  updateLostItem
);
router.delete(
  "/:id",
  authenticate,
  authorize("student", "faculty"),
  deleteLostItem
);
router.get(
  "/:id",
  authenticate,
  getLostItemById
);

module.exports = router;