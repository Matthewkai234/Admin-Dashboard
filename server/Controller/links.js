const { LinksTable } = require("../Common/mongo");

async function getLinks(start = 0, length = 10) {
  try {
    const links = await LinksTable.find().skip(start).limit(length);
    return links;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

async function getLink(searchQuery) {
    if (searchQuery === "" || searchQuery === null || searchQuery === undefined){
        return await getLinks();
    }

    try {
        let query = {};
        if (searchQuery) {
            // Modify the query to search for exact or partial match
            query = { movieId: { $regex: searchQuery, $options: 'i' } };
        }
        const links = await LinksTable.find(query);
        return links;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

module.exports = { getLinks, getLink}; 



