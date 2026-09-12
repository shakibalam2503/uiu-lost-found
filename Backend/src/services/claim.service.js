const claimRepository = require("../repository/claim.repository");

const createClaim = async (claimData) => {
  return await claimRepository.createClaim(claimData);
};

const getClaimById = async (id) => {
  return await claimRepository.getClaimById(id);
};

const getClaimsByUserId = async (userId, limit = 20) => {
  return await claimRepository.getClaimsByUserId(userId, limit);
};

const getClaims = async (limit = 50) => {
  return await claimRepository.getClaims(limit);
};

const updateClaim = async (id, updateData) => {
  return await claimRepository.updateClaim(id, updateData);
};

module.exports = {
  createClaim,
  getClaimById,
  getClaimsByUserId,
  getClaims,
  updateClaim,
};