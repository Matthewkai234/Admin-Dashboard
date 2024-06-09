const express = require("express");
const router = express.Router();
const { getMovies, getMovie, getMoviesCountPerYear, getMoviesCountPerGenre } = require("../Controller/movies");

router.get("/get-movies", async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const movies = await getMovies(start, length);
    res.status(200).json(movies);
});

router.get("/get-movie", async (req, res) => {
    const { query } = req.query;
    const matched = await getMovie(query);
    res.status(200).json(matched);
});

router.get("/get-movies-count-per-year", async (req, res) => {
    const { startYear, endYear } = req.query;
    const moviesCount = await getMoviesCountPerYear(startYear, endYear);
    res.status(200).json(moviesCount);
});

router.get("/get-movies-count-per-genre", async (req, res) => {
    try {
        const { genre } = req.query;
        const moviesCount = await getMoviesCountPerGenre(genre);
        res.status(200).json(moviesCount);
    } catch (error) {
        console.error("Error in /get-movies-count-per-genre route:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;