const path = require("path");
const fs = require("fs");

const { LinksTable } = require("../Common/mongo");

async function getLinks() {
  try {
    const links = await LinksTable.find();
    return links;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

module.exports = { getLinks };