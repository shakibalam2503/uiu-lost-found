const {
  FieldValue,
} = require("firebase-admin/firestore");

const {
  db,
} = require("../config/firebase");

const {
  uploadImage,
  getSignedImageUrl,
} = require("../services/r2.service");

const foundTicketService = require("../services/found-ticket.service");

const createFoundTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      color,
      foundDate,
      building,
      floor,
      locationDescription,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !foundDate ||
      !building ||
      !locationDescription
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    }

    let imageUrls = [];

    if (req.file) {
      const imageKey = await uploadImage(
        req.file,
        "found-tickets"
      );

      imageUrls.push(imageKey);
    }

    const now = FieldValue.serverTimestamp();

    const ticket = await foundTicketService.createFoundTicket({
      submittedBy: req.user.uid,
      submitterName: req.user.name,
      submitterEmail: req.user.email,

      title,
      description,
      category,
      color: color || null,

      foundDate,
      building,
      floor: floor || null,
      locationDescription,

      imageUrls,

      status: "pending",

      reviewedBy: null,
      reviewedByName: null,
      reviewedAt: null,
      staffNote: null,

      foundItemId: null,

      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json({
      success: true,
      message: "Found item ticket submitted successfully",
      data: ticket,
    });
  } catch (error) {
    console.error("Create found ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create found item ticket",
      error: {
        code: "CREATE_FOUND_TICKET_ERROR",
      },
    });
  }
};
const getMyFoundTickets = async (req, res) => {
  try {
    const tickets =
      await foundTicketService.getMyFoundTickets(req.user.uid);

    const ticketsWithImages = await Promise.all(
      tickets.map(async (ticket) => {
        const imageUrls = await Promise.all(
          (ticket.imageUrls || []).map((key) =>
            getSignedImageUrl(key)
          )
        );

        return {
          ...ticket,
          imageUrls,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Found tickets retrieved successfully",
      data: ticketsWithImages,
    });
  } catch (error) {
    console.error("Get my found tickets error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve found tickets",
      error: {
        code: "GET_MY_FOUND_TICKETS_ERROR",
      },
    });
  }
};
const getFoundTickets = async (req, res) => {
  try {
    const tickets =
      await foundTicketService.getFoundTickets();

    const ticketsWithImages = await Promise.all(
      tickets.map(async (ticket) => {
        const imageUrls = await Promise.all(
          (ticket.imageUrls || []).map((key) =>
            getSignedImageUrl(key)
          )
        );

        return {
          ...ticket,
          imageUrls,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Found tickets retrieved successfully",
      data: ticketsWithImages,
    });
  } catch (error) {
    console.error("Get found tickets error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve found tickets",
      error: {
        code: "GET_FOUND_TICKETS_ERROR",
      },
    });
  }
};
const getFoundTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket =
      await foundTicketService.getFoundTicketById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Found ticket not found",
        error: {
          code: "FOUND_TICKET_NOT_FOUND",
        },
      });
    }

    // Student can only see their own ticket.
    // Staff/admin can see any ticket.
    const isStaff =
      req.user.role === "staff" ||
      req.user.role === "admin";

    if (!isStaff && ticket.submittedBy !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this ticket",
        error: {
          code: "FORBIDDEN",
        },
      });
    }

    const imageUrls = await Promise.all(
      (ticket.imageUrls || []).map((key) =>
        getSignedImageUrl(key)
      )
    );

    return res.status(200).json({
      success: true,
      message: "Found ticket retrieved successfully",
      data: {
        ...ticket,
        imageUrls,
      },
    });
  } catch (error) {
    console.error("Get found ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve found ticket",
      error: {
        code: "GET_FOUND_TICKET_ERROR",
      },
    });
  }
};
const updateFoundTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      staffNote,
    } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected",
        error: {
          code: "INVALID_STATUS",
        },
      });
    }

    const ticketRef = db
      .collection("found_tickets")
      .doc(id);

    const result = await db.runTransaction(async (transaction) => {
      const ticketSnapshot =
        await transaction.get(ticketRef);

      if (!ticketSnapshot.exists) {
        throw new Error("FOUND_TICKET_NOT_FOUND");
      }

      const ticket = ticketSnapshot.data();

      if (ticket.status !== "pending") {
        throw new Error("TICKET_ALREADY_REVIEWED");
      }

      const now = FieldValue.serverTimestamp();

      // =========================
      // REJECT
      // =========================

      if (status === "rejected") {
        transaction.update(ticketRef, {
          status: "rejected",
          reviewedBy: req.user.uid,
          reviewedByName: req.user.name,
          reviewedAt: now,
          staffNote: staffNote || null,
          updatedAt: now,
        });

        return {
          status: "rejected",
          foundItemId: null,
        };
      }

      // =========================
      // ACCEPT
      // =========================

      const foundItemRef =
        db.collection("found_items").doc();

      const foundItem = {
        id: foundItemRef.id,

        registeredBy: req.user.uid,
        registeredByName: req.user.name,
        registeredByEmail: req.user.email,

        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        color: ticket.color,

        foundDate: ticket.foundDate,
        building: ticket.building,
        floor: ticket.floor,
        locationDescription: ticket.locationDescription,

        status: "found",

        imageUrls: ticket.imageUrls || [],

        createdAt: now,
        updatedAt: now,
      };

      // Create official found item
      transaction.set(
        foundItemRef,
        foundItem
      );

      // Update ticket
      transaction.update(ticketRef, {
        status: "accepted",

        reviewedBy: req.user.uid,
        reviewedByName: req.user.name,
        reviewedAt: now,

        staffNote: staffNote || null,

        foundItemId: foundItemRef.id,

        updatedAt: now,
      });

      return {
        status: "accepted",
        foundItemId: foundItemRef.id,
      };
    });

    return res.status(200).json({
      success: true,
      message:
        status === "accepted"
          ? "Found ticket accepted and item registered successfully"
          : "Found ticket rejected successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update found ticket status error:", error);

    if (error.message === "FOUND_TICKET_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Found ticket not found",
        error: {
          code: "FOUND_TICKET_NOT_FOUND",
        },
      });
    }

    if (error.message === "TICKET_ALREADY_REVIEWED") {
      return res.status(409).json({
        success: false,
        message: "This ticket has already been reviewed",
        error: {
          code: "TICKET_ALREADY_REVIEWED",
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update found ticket",
      error: {
        code: "UPDATE_FOUND_TICKET_ERROR",
      },
    });
  }
};
module.exports = {
  createFoundTicket,
  getMyFoundTickets,
  getFoundTickets,
  getFoundTicketById,
  updateFoundTicketStatus,
};