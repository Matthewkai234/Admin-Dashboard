const { MoviesTable } = require("../Common/mongo");

async function getMovies(start = 0, length = 10) {
  try {
    const movies = await MoviesTable.find().skip(start).limit(length);
    return movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

async function getMovie(searchQuery) {
    if (searchQuery === "" || searchQuery === null || searchQuery === undefined){
        return await getMovies();
    }

    try {
        let query = {};
        if (searchQuery) {
            // Modify the query to search for exact or partial match
            query = { title: { $regex: searchQuery, $options: 'i' } };
        }
        const movies = await MoviesTable.find(query);
        return movies;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

module.exports = { getMovies, getMovie}; 