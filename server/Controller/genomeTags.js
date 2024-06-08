const { GenomeTagsTable } = require("../Common/mongo");

async function getGenomeTags(start = 0, length = 10) {
  try {
    const genometags = await GenomeTagsTable.find().skip(start).limit(length);
    return genometags;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

async function getGenomeTag(searchQuery) {
    if (searchQuery === "" || searchQuery === null || searchQuery === undefined){
        return await getGenomeTags();
    }

    try {
        let query = {};
        if (searchQuery) {
            // Modify the query to search for exact or partial match
            query = { tagId: { $regex: searchQuery, $options: 'i' } };
        }
        const genometags = await GenomeTagsTable.find(query);
        return genometags;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

module.exports = { getGenomeTags, getGenomeTag };