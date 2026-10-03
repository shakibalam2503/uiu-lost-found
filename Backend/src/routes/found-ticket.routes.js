const express = require("express");

const router = express.Router();

const {
  authenticate,
} = require("../middlewares/auth.middleware");
const {authorize}=require("../middlewares/authorize.middleware")
const { upload } = require("../middlewares/upload.middleware");
const {
  createFoundTicket,
  getMyFoundTickets,
  getFoundTickets,
  getFoundTicketById,
  updateFoundTicketStatus,
} = require("../controllers/found-ticket.controller");

// Student submits after-hours found item
router.post(
  "/",
  authenticate,
  authorize("student"),
  upload.single("image"),
  createFoundTicket
);

// Student sees their own tickets
router.get(
  "/my",
  authenticate,
  authorize("student"),
  getMyFoundTickets
);

// Staff/admin sees all tickets
router.get(
  "/",
  authenticate,
  authorize("staff", "admin"),
  getFoundTickets
);

// Student can see own ticket.
// Staff/admin can see any ticket.
router.get(
  "/:id",
  authenticate,
  getFoundTicketById
);

// Staff/admin accepts or rejects
router.patch(
  "/:id/status",
  authenticate,
  authorize("staff", "admin"),
  updateFoundTicketStatus
);

module.exports = router;