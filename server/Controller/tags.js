const path = require("path");
const fs = require("fs");

const { TagsTable } = require("../Common/mongo");

async function getTags() {
  try {
    const tags = await TagsTable.find();
    return tags;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

module.exports = { getTags };