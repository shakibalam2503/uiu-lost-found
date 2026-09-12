const claimService = require("../services/claim.service");
const { db } = require("../config/firebase");

const createClaim = async (req, res) => {
  try {
    const {
      foundItemId,
      lostItemId,
      claimDetails,
    } = req.body;

    // Basic validation
    if (!foundItemId || !claimDetails) {
      return res.status(400).json({
        success: false,
        message: "foundItemId and claimDetails are required",
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    }

    // Get lost item if provided
    let targetLostItemId = null;
    let targetLostItemTitle = null;
    if (lostItemId) {
      const lostItemRef = db
        .collection("lost_items")
        .doc(lostItemId);

      const lostItemSnapshot = await lostItemRef.get();

      if (!lostItemSnapshot.exists) {
        return res.status(404).json({
          success: false,
          message: "Lost item not found",
          error: {
            code: "LOST_ITEM_NOT_FOUND",
          },
        });
      }

      const lostItem = lostItemSnapshot.data();

      // SECURITY CHECK
      // Student must own the lost item
      if (lostItem.reportedBy !== req.user.uid) {
        return res.status(403).json({
          success: false,
          message: "You can only submit a claim for your own lost item",
          error: {
            code: "NOT_ITEM_OWNER",
          },
        });
      }
      targetLostItemId = lostItemId;
      targetLostItemTitle = lostItem.title || null;
    }

    // Get found item
    const foundItemRef = db
      .collection("found_items")
      .doc(foundItemId);

    const foundItemSnapshot = await foundItemRef.get();

    if (!foundItemSnapshot.exists) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
        error: {
          code: "FOUND_ITEM_NOT_FOUND",
        },
      });
    }

    const foundItem = foundItemSnapshot.data();

    // Check found item is still available
    if (foundItem.status !== "found") {
      return res.status(400).json({
        success: false,
        message: "This found item is no longer available for claiming",
        error: {
          code: "ITEM_NOT_AVAILABLE",
        },
      });
    }

    // Prevent duplicate active claims
    const existingClaimsSnapshot = await db
      .collection("claims")
      .where("foundItemId", "==", foundItemId)
      .where("claimantId", "==", req.user.uid)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (!existingClaimsSnapshot.empty) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending claim for this item",
        error: {
          code: "DUPLICATE_CLAIM",
        },
      });
    }

    const claimData = {
      foundItemId,
      foundItemTitle: foundItem.title || null,
      foundItemCategory: foundItem.category || null,

      lostItemId: targetLostItemId || null,
      lostItemTitle: targetLostItemTitle || null,

      claimantId: req.user.uid,
      claimantName: req.user.name || "",
      claimantEmail: req.user.email || "",

      claimDetails,

      status: "pending",

      reviewedBy: null,
      reviewedByName: null,
      staffNote: null,
      reviewedAt: null,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const claim = await claimService.createClaim(claimData);

    return res.status(201).json({
      success: true,
      message: "Ownership claim submitted successfully",
      data: claim,
    });
  } catch (error) {
    console.error("Create claim error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit ownership claim",
      error: {
        code: "CREATE_CLAIM_ERROR",
      },
    });
  }
};

// Student: get own claims
const getMyClaims = async (req, res) => {
  try {
    const claims = await claimService.getClaimsByUserId(
      req.user.uid
    );

    return res.status(200).json({
      success: true,
      message: "Claims retrieved successfully",
      data: claims,
    });
  } catch (error) {
    console.error("Get my claims error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve claims",
      error: {
        code: "GET_CLAIMS_ERROR",
      },
    });
  }
};

// Staff/Admin: get all claims
const getClaims = async (req, res) => {
  try {
    const claims = await claimService.getClaims();

    return res.status(200).json({
      success: true,
      message: "Claims retrieved successfully",
      data: claims,
    });
  } catch (error) {
    console.error("Get claims error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve claims",
      error: {
        code: "GET_CLAIMS_ERROR",
      },
    });
  }
};

// Get one claim
const getClaimById = async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await claimService.getClaimById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
        error: {
          code: "CLAIM_NOT_FOUND",
        },
      });
    }

    // Student can only see own claim
    // Staff/admin can see any claim
    const isStaffOrAdmin =
      req.user.role === "staff" ||
      req.user.role === "admin";

    if (!isStaffOrAdmin && claim.claimantId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this claim",
        error: {
          code: "FORBIDDEN",
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Claim retrieved successfully",
      data: claim,
    });
  } catch (error) {
    console.error("Get claim error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve claim",
      error: {
        code: "GET_CLAIM_ERROR",
      },
    });
  }
};

// Staff/Admin: approve/reject claim
const updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, staffNote } = req.body;

    // Only these statuses can be set by staff
    const allowedStatuses = ["approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either approved or rejected",
        error: {
          code: "INVALID_STATUS",
        },
      });
    }

    const claim = await claimService.getClaimById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
        error: {
          code: "CLAIM_NOT_FOUND",
        },
      });
    }

    // Only pending claims can be reviewed
    if (claim.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending claims can be reviewed",
        error: {
          code: "CLAIM_ALREADY_REVIEWED",
        },
      });
    }

    const updatedClaim = await claimService.updateClaim(id, {
      status,
      staffNote: staffNote || null,

      reviewedBy: req.user.uid,
      reviewedByName: req.user.name || "",
      reviewedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Ownership claim approved successfully"
          : "Ownership claim rejected successfully",
      data: updatedClaim,
    });
  } catch (error) {
    console.error("Update claim status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update claim status",
      error: {
        code: "UPDATE_CLAIM_ERROR",
      },
    });
  }
};

module.exports = {
  createClaim,
  getMyClaims,
  getClaims,
  getClaimById,
  updateClaimStatus,
};