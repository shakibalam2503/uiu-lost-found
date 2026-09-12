const recoveryService = require("../services/recovery.service");
const claimService = require("../services/claim.service");
const { db } = require("../config/firebase");


// Staff confirms physical handover
const createRecovery = async (req, res) => {
  try {
    const { claimId, notes } = req.body;

    if (!claimId) {
      return res.status(400).json({
        success: false,
        message: "claimId is required",
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    }

    // Get claim
    const claim = await claimService.getClaimById(claimId);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
        error: {
          code: "CLAIM_NOT_FOUND",
        },
      });
    }

    // Claim must be approved
    if (claim.status !== "approved") {
      return res.status(400).json({
        success: false,
        message:
          "Only approved claims can be marked as recovered",
        error: {
          code: "CLAIM_NOT_APPROVED",
        },
      });
    }

    // Make sure this claim hasn't already been recovered
    const existingRecoverySnapshot = await db
      .collection("recoveries")
      .where("claimId", "==", claimId)
      .limit(1)
      .get();

    if (!existingRecoverySnapshot.empty) {
      return res.status(409).json({
        success: false,
        message: "This claim has already been recovered",
        error: {
          code: "ALREADY_RECOVERED",
        },
      });
    }

    // Get lost item
    const lostItemRef = db
      .collection("lost_items")
      .doc(claim.lostItemId);

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

    // Get found item
    const foundItemRef = db
      .collection("found_items")
      .doc(claim.foundItemId);

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

    /*
     * Create recovery record
     */
    const recoveryData = {
      claimId,

      lostItemId: claim.lostItemId,
      foundItemId: claim.foundItemId,

      studentId: claim.claimantId,
      studentName: claim.claimantName,
      studentEmail: claim.claimantEmail,

      verifiedBy: req.user.uid,
      verifiedByName: req.user.name || "",

      notes: notes || null,

      status: "completed",

      recoveredAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const recovery =
      await recoveryService.createRecovery(recoveryData);

    /*
     * Update lost item
     */
    await lostItemRef.update({
      status: "recovered",
      updatedAt: new Date(),
    });

    /*
     * Update found item
     */
    await foundItemRef.update({
      status: "recovered",
      updatedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Item recovery confirmed successfully",
      data: recovery,
    });

  } catch (error) {
    console.error("Create recovery error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to confirm item recovery",
      error: {
        code: "CREATE_RECOVERY_ERROR",
      },
    });
  }
};


// Student views own recoveries
const getMyRecoveries = async (req, res) => {
  try {
    const recoveries =
      await recoveryService.getRecoveriesByUserId(
        req.user.uid
      );

    return res.status(200).json({
      success: true,
      message: "Recoveries retrieved successfully",
      data: recoveries,
    });

  } catch (error) {
    console.error("Get my recoveries error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve recoveries",
      error: {
        code: "GET_RECOVERIES_ERROR",
      },
    });
  }
};


// Staff/Admin views all recoveries
const getRecoveries = async (req, res) => {
  try {
    const recoveries =
      await recoveryService.getRecoveries();

    return res.status(200).json({
      success: true,
      message: "Recoveries retrieved successfully",
      data: recoveries,
    });

  } catch (error) {
    console.error("Get recoveries error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve recoveries",
      error: {
        code: "GET_RECOVERIES_ERROR",
      },
    });
  }
};


// Get individual recovery
const getRecoveryById = async (req, res) => {
  try {
    const { id } = req.params;

    const recovery =
      await recoveryService.getRecoveryById(id);

    if (!recovery) {
      return res.status(404).json({
        success: false,
        message: "Recovery record not found",
        error: {
          code: "RECOVERY_NOT_FOUND",
        },
      });
    }

    const isStaffOrAdmin =
      req.user.role === "staff" ||
      req.user.role === "admin";

    if (
      !isStaffOrAdmin &&
      recovery.studentId !== req.user.uid
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this recovery",
        error: {
          code: "FORBIDDEN",
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recovery retrieved successfully",
      data: recovery,
    });

  } catch (error) {
    console.error("Get recovery error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve recovery",
      error: {
        code: "GET_RECOVERY_ERROR",
      },
    });
  }
};


module.exports = {
  createRecovery,
  getMyRecoveries,
  getRecoveries,
  getRecoveryById,
};