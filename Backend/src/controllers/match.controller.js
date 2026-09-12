const matchService = require("../services/match.service");
const lostItemService = require("../services/lost-item.service");
const foundItemService = require("../services/found-item.service");

const testMatch = async (req, res) => {
  try {
    const { lostItemId, foundItemId } = req.body;

    if (!lostItemId || !foundItemId) {
      return res.status(400).json({
        success: false,
        message: "lostItemId and foundItemId are required",
        error: {
          code: "MISSING_ITEM_IDS",
        },
      });
    }

    // Get lost item
    const lostItem =
      await lostItemService.getLostItemById(lostItemId);

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
        error: {
          code: "LOST_ITEM_NOT_FOUND",
        },
      });
    }

    // Get found item
    const foundItem =
      await foundItemService.getFoundItemById(foundItemId);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
        error: {
          code: "FOUND_ITEM_NOT_FOUND",
        },
      });
    }

    // Calculate match score
    const matchScore =
      matchService.calculateMatchScore(
        lostItem,
        foundItem
      );

    // Determine match status
    let status;

    if (matchScore >= 80) {
      status = "strong";
    } else if (matchScore >= 60) {
      status = "possible";
    } else {
      status = "weak";
    }

    // Save match
    const match = await matchService.createMatch(
      lostItem,
      foundItem
    );

    return res.status(201).json({
      success: true,
      message: "Match calculated successfully",
      data: {
        matchId: match.id,
        lostItemId,
        foundItemId,
        matchScore,
        status,
      },
    });

  } catch (error) {
    console.error("Test match error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to calculate match",
      error: {
        code: "MATCH_CALCULATION_ERROR",
      },
    });
  }
};

module.exports = {
  testMatch,
};