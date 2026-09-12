const foundItemRepository = require("../repository/found-item.repository");

const createFoundItem = async (foundItemData) => {
  return await foundItemRepository.createFoundItem(foundItemData);
};

const getFoundItemById = async (id) => {
  return await foundItemRepository.getFoundItemById(id);
};

const getFoundItems = async (
  limit,
  category,
  status,
  color,
  building,
  floor
) => {
  return await foundItemRepository.getFoundItems(
    limit,
    category,
    status,
    color,
    building,
    floor
  );
};

const updateFoundItem = async (id, updateData) => {
  return await foundItemRepository.updateFoundItem(id, updateData);
};

const deleteFoundItem = async (id) => {
  return await foundItemRepository.deleteFoundItem(id);
};

module.exports = {
  createFoundItem,
  getFoundItemById,
  getFoundItems,
  updateFoundItem,
  deleteFoundItem,
};