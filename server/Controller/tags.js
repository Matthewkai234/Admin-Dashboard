const { TagsTable } = require("../Common/mongo");

async function getTags(start = 0, length = 10) {
  try {
    const tags = await TagsTable.find().skip(start).limit(length);
    return tags;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

async function getTag(searchQuery) {
    if (searchQuery === "" || searchQuery === null || searchQuery === undefined){
        return await getTags();
    }

    try {
        let query = {};
        if (searchQuery) {
            // Modify the query to search for exact or partial match
            query = { tag: { $regex: searchQuery, $options: 'i' } };
        }
        const tags = await TagsTable.find(query);
        return tags;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

module.exports = { getTags, getTag}; 