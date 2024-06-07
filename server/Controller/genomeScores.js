const path = require("path");
const fs = require("fs");
const { GenomeScoresTable } = require("../Common/mongo");

async function getGenomeScores() {
  try {
    const genomeScores = await GenomeScoresTable.find();
    return genomeScores;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

module.exports = { getGenomeScores };