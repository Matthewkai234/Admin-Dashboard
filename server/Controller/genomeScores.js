const { GenomeScoresTable } = require("../Common/mongo");

async function getGenomeScores(start = 0, length = 10) {
  try {
    const genomescores = await GenomeScoresTable.find().skip(start).limit(length);
    return genomescores;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

async function getGenomeScore(searchQuery) {
    if (searchQuery === "" || searchQuery === null || searchQuery === undefined){
        return await getGenomeScores();
    }

    try {
        let query = {};
        if (searchQuery) {
            // Modify the query to search for exact or partial match
            query = { movieId: { $regex: searchQuery, $options: 'i' } };
        }
        const genomescores = await GenomeScoresTable.find(query);
        return genomescores;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

module.exports = { getGenomeScores, getGenomeScore };