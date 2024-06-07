const path = require("path");
const fs = require("fs");
const { GenomeTagsTable } = require("../Common/mongo");

async function getGenomeTags() {
  try {
    const genomeTags = await GenomeTagsTable.find();
    return genomeTags;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

module.exports = { getGenomeTags };