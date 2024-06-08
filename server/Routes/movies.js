const express = require("express");
const router = express.Router();
const { getMovies, getMovie } = require("../Controller/movies");

router.get("/get-movies", async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const movies = await getMovies(start, length);
    res.status(200).json(movies);
    
});

router.get("/get-movie", async (req, res) => {
    const { query } = req.query;
  
    console.log(query);
  
    const matched = await getMovie(query);
  
    res.status(200).json(matched);
  });

module.exports = router;