const { RatingsTable } = require("../Common/mongo");

async function getRatings(start = 0, length = 10) {
  try {
    const ratings = await RatingsTable.find().skip(start).limit(length);
    return ratings;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

async function getRating(searchQuery) {
    if (searchQuery === "" || searchQuery === null || searchQuery === undefined){
        return await getRatings();
    }

    try {
        let query = {};
        if (searchQuery) {
            // Modify the query to search for exact or partial match
            query = { rating: { $regex: parseFloat(searchQuery), $options: 'i' } };
        }
        
        const ratings = await RatingsTable.find(query); 
        console.log(ratings)
        return ratings;
        
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

module.exports = { getRatings, getRating}; 