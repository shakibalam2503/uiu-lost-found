const matchRepository = require("../repository/match.repository");

// Calculate match score between a lost item and found item
const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;

  // Category = 30 points
  if (
    lostItem.category &&
    foundItem.category &&
    lostItem.category.toLowerCase() === foundItem.category.toLowerCase()
  ) {
    score += 30;
  }

  // Color = 20 points
  if (
    lostItem.color &&
    foundItem.color &&
    lostItem.color.toLowerCase() === foundItem.color.toLowerCase()
  ) {
    score += 20;
  }

  // Building = 20 points
  if (
    lostItem.building &&
    foundItem.building &&
    lostItem.building.toLowerCase() === foundItem.building.toLowerCase()
  ) {
    score += 20;
  }

  // Floor = 10 points
  if (
    lostItem.floor &&
    foundItem.floor &&
    lostItem.floor.toString() === foundItem.floor.toString()
  ) {
    score += 10;
  }

  // Date = 10 points
  if (lostItem.lostDate && foundItem.foundDate) {
    const lostDate = new Date(lostItem.lostDate);
    const foundDate = new Date(foundItem.foundDate);

    const differenceInDays =
      Math.abs(foundDate - lostDate) / (1000 * 60 * 60 * 24);

    if (differenceInDays <= 3) {
      score += 10;
    }
  }

  // Title similarity = 10 points
  if (lostItem.title && foundItem.title) {
    const lostTitle = lostItem.title.toLowerCase();
    const foundTitle = foundItem.title.toLowerCase();

    if (
      lostTitle.includes(foundTitle) ||
      foundTitle.includes(lostTitle)
    ) {
      score += 10;
    }
  }

  return score;
};


// Create a match between a lost item and found item
const createMatch = async (lostItem, foundItem) => {
  const matchScore = calculateMatchScore(lostItem, foundItem);

  const matchData = {
    lostItemId: lostItem.id,
    foundItemId: foundItem.id,

    matchScore,

    status:
      matchScore >= 80
        ? "strong"
        : matchScore >= 60
        ? "possible"
        : "weak",

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return await matchRepository.createMatch(matchData);
};


const getMatchById = async (id) => {
  return await matchRepository.getMatchById(id);
};


const getMatchesByLostItemId = async (lostItemId) => {
  return await matchRepository.getMatchesByLostItemId(lostItemId);
};


const getMatchesByFoundItemId = async (foundItemId) => {
  return await matchRepository.getMatchesByFoundItemId(foundItemId);
};


module.exports = {
  calculateMatchScore,
  createMatch,
  getMatchById,
  getMatchesByLostItemId,
  getMatchesByFoundItemId,
};