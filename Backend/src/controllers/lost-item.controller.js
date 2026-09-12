const lostItemService = require("../services/lost-item.service");
const {
  uploadImage,
  getSignedImageUrl,
} = require("../services/r2.service");
const createLostItem = async (req, res) => {
  try {
    console.log("REQ FILE:", req.file);
    const {
      title,
      description,
      category,
      color,
      lostDate,
      building,
      floor,
      locationDescription,
    } = req.body;
    
let imageUrls = [];


if (req.file) {
  const uploadedImage = await uploadImage(
    req.file,
    "lost-items"
  );

  imageUrls.push(uploadedImage.key);
}

    const lostItemData = {
      reportedBy: req.user.uid,
      reporterName: req.user.name || null,
      reporterEmail: req.user.email || null,

      title,
      description,
      category,
      color,
      lostDate,
      building,
      floor,
      locationDescription,

      status: "lost",

      imageUrls: imageUrls,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const lostItem = await lostItemService.createLostItem(lostItemData);

    return res.status(201).json({
      success: true,
      message: "Lost item reported successfully",
      data: lostItem,
    });
  } catch (error) {
    console.error("Create lost item error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to report lost item",
      error: {
        code: "LOST_ITEM_CREATION_FAILED",
      },
    });
  }
};

const getLostItemById = async (req, res) => {
  try {
    
    const { id } = req.params;

    const lostItem = await lostItemService.getLostItemById(id);

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
        error: {
          code: "LOST_ITEM_NOT_FOUND",
        },
      });
    
    }
    console.log("IMAGE KEYS:", lostItem.imageUrls);


    // Convert R2 object keys into temporary signed URLs
    if (lostItem.imageUrls && lostItem.imageUrls.length > 0) {
      lostItem.imageUrls = await Promise.all(
        lostItem.imageUrls.map((key) =>
          getSignedImageUrl(key)
        )
      );
    }

    return res.status(200).json({
      success: true,
      message: "Lost item retrieved successfully",
      data: lostItem,
    });
  } catch (error) {
    console.error("Get lost item error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve lost item",
      error: {
        code: "LOST_ITEM_RETRIEVAL_FAILED",
      },
    });
  }
};
const getLostItems = async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit) || 10;

    const limit = Math.min(
      Math.max(requestedLimit, 1),
      50
    );

    const category = req.query.category || null;
    const status = req.query.status || null;
    const color = req.query.color || null;
    const building = req.query.building || null;
    const floor = req.query.floor || null;

    const lostItems = await lostItemService.getLostItems(
      limit,
      category,
      status,
      color,
      building,
      floor
    );

    // Convert R2 object keys into temporary signed URLs
    for (const item of lostItems) {
      if (item.imageUrls && item.imageUrls.length > 0) {
        item.imageUrls = await Promise.all(
          item.imageUrls.map((key) =>
            getSignedImageUrl(key)
          )
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Lost items retrieved successfully",
      data: lostItems,
    });
  } catch (error) {
    console.error("Get lost items error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve lost items",
      error: {
        code: "LOST_ITEMS_RETRIEVAL_FAILED",
      },
    });
  }
};
const getMyLostItems = async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit) || 10;

    const limit = Math.min(
      Math.max(requestedLimit, 1),
      50
    );

    const lostItems = await lostItemService.getLostItemsByUserId(
      req.user.uid,
      limit
    );

    // Convert R2 object keys into temporary signed URLs
    for (const item of lostItems) {
      if (item.imageUrls && item.imageUrls.length > 0) {
        item.imageUrls = await Promise.all(
          item.imageUrls.map((key) =>
            getSignedImageUrl(key)
          )
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Your lost items retrieved successfully",
      data: lostItems,
    });
  } catch (error) {
    console.error("Get my lost items error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve your lost items",
      error: {
        code: "MY_LOST_ITEMS_RETRIEVAL_FAILED",
      },
    });
  }
};
const updateLostItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await lostItemService.getLostItemById(id);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
        error: {
          code: "LOST_ITEM_NOT_FOUND",
        },
      });
    }

    if (existingItem.reportedBy !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own lost item",
        error: {
          code: "LOST_ITEM_UPDATE_FORBIDDEN",
        },
      });
    }

    const {
      title,
      description,
      category,
      color,
      lostDate,
      building,
      floor,
      locationDescription,
    } = req.body;

    const updateData = {
      title,
      description,
      category,
      color,
      lostDate,
      building,
      floor,
      locationDescription,
    };

    const updatedItem = await lostItemService.updateLostItem(
      id,
      updateData
    );

    return res.status(200).json({
      success: true,
      message: "Lost item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Update lost item error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update lost item",
      error: {
        code: "LOST_ITEM_UPDATE_FAILED",
      },
    });
  }
};
const deleteLostItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await lostItemService.getLostItemById(id);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
        error: {
          code: "LOST_ITEM_NOT_FOUND",
        },
      });
    }

    if (existingItem.reportedBy !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own lost item",
        error: {
          code: "LOST_ITEM_DELETE_FORBIDDEN",
        },
      });
    }

    await lostItemService.deleteLostItem(id);

    return res.status(200).json({
      success: true,
      message: "Lost item deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete lost item error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lost item",
      error: {
        code: "LOST_ITEM_DELETE_FAILED",
      },
    });
  }
};
module.exports = {
  createLostItem,
  getLostItemById,
  getLostItems,
  getMyLostItems,
  updateLostItem,
  deleteLostItem,
};