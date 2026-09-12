const lostItemRepository = require("../repository/lost-item.repository");

const createLostItem = async (lostItemData) => {
  return await lostItemRepository.createLostItem(lostItemData);
};

const getLostItemById = async (id) => {
  return await lostItemRepository.getLostItemById(id);
};
const getLostItems = async (
  limit,
  category,
  status,
  color,
  building,
  floor
) => {
  return await lostItemRepository.getLostItems(
    limit,
    category,
    status,
    color,
    building,
    floor
  );
};
const getLostItemsByUserId = async (userId, limit = 10) => {
  return await lostItemRepository.getLostItemsByUserId(
    userId,
    limit
  );
};
const updateLostItem = async (id, updateData) => {
  return await lostItemRepository.updateLostItem(
    id,
    updateData
  );
};
const deleteLostItem = async (id) => {
  return await lostItemRepository.deleteLostItem(id);
};
module.exports = {
  createLostItem,
  getLostItemById,
  getLostItems,
  getLostItemsByUserId,
  updateLostItem,
  deleteLostItem,
};