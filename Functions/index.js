const {setGlobalOptions} = require("firebase-functions");

const {
  matchFoundItem,
  matchLostItem,
} = require("./src/matching");

setGlobalOptions({
  maxInstances: 10,
});

exports.matchFoundItem = matchFoundItem;
exports.matchLostItem = matchLostItem;
