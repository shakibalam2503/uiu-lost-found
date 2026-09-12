const recoveryRepository = require("../repository/recovery.repository");

const createRecovery = async (recoveryData) => {
  return await recoveryRepository.createRecovery(recoveryData);
};

const getRecoveryById = async (id) => {
  return await recoveryRepository.getRecoveryById(id);
};

const getRecoveriesByUserId = async (userId, limit = 20) => {
  return await recoveryRepository.getRecoveriesByUserId(
    userId,
    limit
  );
};

const getRecoveries = async (limit = 50) => {
  return await recoveryRepository.getRecoveries(limit);
};

module.exports = {
  createRecovery,
  getRecoveryById,
  getRecoveriesByUserId,
  getRecoveries,
};