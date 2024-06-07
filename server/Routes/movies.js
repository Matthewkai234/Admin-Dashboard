const express = require("express");
const router = express.Router();
const {getMovies} = require("../Controller/movies");


const {MoviesTable} = require("../Common/mongo");
router.get("/get-movies", async (req, res) => {
    const movies = await getMovies();
    console.log(movies)
    res.status(200).json(movies);
})

module.exports=router;