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
    if (searchQuery === "" || searchQuery === null || searchQuery === undefined) {
        return await getMovies();
    }

    try {
        let query = {};
        if (searchQuery) {
            query = { title: { $regex: searchQuery, $options: 'i' } };
        }
        const movies = await MoviesTable.find(query);
        return movies;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

async function getMoviesCountPerYear(startYear, endYear) {
    try {
        const matchStage = {};
        if (startYear && endYear) {
            matchStage.$and = [
                { releaseYear: { $gte: parseInt(startYear) } },
                { releaseYear: { $lte: parseInt(endYear) } }
            ];
        }

        const moviesCount = await MoviesTable.aggregate([
            {
                $addFields: {
                    releaseYear: {
                        $convert: {
                            input: {
                                $arrayElemAt: [
                                    { $split: [{ $arrayElemAt: [{ $split: ["$title", "("] }, 1] }, ")"] },
                                    0
                                ]
                            },
                            to: "int",
                            onError: null,
                            onNull: null
                        }
                    }
                }
            },
            { $match: { releaseYear: { $ne: null } } }, // Filter out documents where releaseYear is null
            { $match: matchStage },
            {
                $group: {
                    _id: "$releaseYear",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log("Movies count per year:", moviesCount);
        return moviesCount;
    } catch (error) {
        console.error("Error fetching movies count per year:", error);
        throw error;
    }
}

async function getMoviesCountPerGenre(selectedGenre) {
    try {
        let matchStage = {};

        if (selectedGenre) {
            matchStage = {
                genres: { $regex: new RegExp(selectedGenre, 'i') }
            };
        }

        const genreCount = await MoviesTable.aggregate([
            { $match: matchStage },
            { $project: { genres: { $split: ["$genres", "|"] } } },
            { $unwind: "$genres" },
            { $group: { _id: "$genres", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).exec();

        return genreCount;
    } catch (error) {
        console.error("Error fetching movies count per genre:", error);
        throw error;
    }
}

module.exports = { getMovies, getMovie, getMoviesCountPerYear, getMoviesCountPerGenre };