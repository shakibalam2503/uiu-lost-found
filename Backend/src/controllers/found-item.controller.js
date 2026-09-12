const foundItemService = require("../services/found-item.service");
const { uploadImage,getSignedImageUrl } = require("../services/r2.service");

// Create a found item
const createFoundItem = async (req, res) => {
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

    let imageUrls = [];
    

    if (req.file) {
      const uploadedImage = await uploadImage(
        req.file,
        "found-items"
      );

      imageUrls.push(uploadedImage.key);
    }

    const foundItemData = {
      registeredBy: req.user.uid,
      registeredByName: req.user.name || "",
      registeredByEmail: req.user.email || "",

      title,
      description,
      category,
      color,
      foundDate,
      building,
      floor,
      locationDescription,

      status: "found",
      imageUrls: imageUrls,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const foundItem = await foundItemService.createFoundItem(foundItemData);

    return res.status(201).json({
      success: true,
      message: "Found item registered successfully",
      data: foundItem,
    });
  } catch (error) {
    console.error("Create found item error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to register found item",
      error: {
        code: "FOUND_ITEM_CREATION_FAILED",
      },
    });
  }
};

// Get all found items
const getFoundItems = async (req, res) => {
  try {
    let {
      limit,
      category,
      status,
      color,
      building,
      floor,
    } = req.query;

    limit = parseInt(limit, 10) || 10;

    if (limit < 1) {
      limit = 1;
    }

    if (limit > 50) {
      limit = 50;
    }

    const foundItems = await foundItemService.getFoundItems(
      limit,
      category,
      status,
      color,
      building,
      floor
    );

    // Convert R2 object keys into temporary signed URLs
    for (const item of foundItems) {
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
      message: "Found items retrieved successfully",
      data: foundItems,
    });
  } catch (error) {
    console.error("Get found items error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve found items",
      error: {
        code: "FOUND_ITEMS_RETRIEVAL_FAILED",
      },
    });
  }
};

// Get one found item
const getFoundItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundItem = await foundItemService.getFoundItemById(id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
        error: {
          code: "FOUND_ITEM_NOT_FOUND",
        },
      });
    }

    // Convert R2 object keys into temporary signed URLs
    if (foundItem.imageUrls && foundItem.imageUrls.length > 0) {
      foundItem.imageUrls = await Promise.all(
        foundItem.imageUrls.map((key) =>
          getSignedImageUrl(key)
        )
      );
    }

    return res.status(200).json({
      success: true,
      message: "Found item retrieved successfully",
      data: foundItem,
    });
  } catch (error) {
    console.error("Get found item by ID error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve found item",
      error: {
        code: "FOUND_ITEM_RETRIEVAL_FAILED",
      },
    });
  }
};

// Update a found item
const updateFoundItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await foundItemService.getFoundItemById(id);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
        error: {
          code: "FOUND_ITEM_NOT_FOUND",
        },
      });
    }

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

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (color !== undefined) updateData.color = color;
    if (foundDate !== undefined) updateData.foundDate = foundDate;
    if (building !== undefined) updateData.building = building;
    if (floor !== undefined) updateData.floor = floor;
    if (locationDescription !== undefined) {
      updateData.locationDescription = locationDescription;
    }

    const updatedItem = await foundItemService.updateFoundItem(
      id,
      updateData
    );

    return res.status(200).json({
      success: true,
      message: "Found item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Update found item error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update found item",
      error: {
        code: "FOUND_ITEM_UPDATE_FAILED",
      },
    });
  }
};

// Delete a found item
const deleteFoundItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await foundItemService.getFoundItemById(id);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
        error: {
          code: "FOUND_ITEM_NOT_FOUND",
        },
      });
    }

    await foundItemService.deleteFoundItem(id);

    return res.status(200).json({
      success: true,
      message: "Found item deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete found item error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete found item",
      error: {
        code: "FOUND_ITEM_DELETION_FAILED",
      },
    });
  }
};

module.exports = {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  updateFoundItem,
  deleteFoundItem,
};