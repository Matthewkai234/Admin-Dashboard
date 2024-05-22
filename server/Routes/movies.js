const express = require("express");
const router = express.Router();
const {getMovies} = require("../Controller/movies");
const movies = getMovies();
router.get("/get-movies", async (req, res) => {

    const result = await movies.next();
    let csvData = {
        headings: ["movieId", "title", "genres"],
        data: [],
    };

    for (let i = 0; i < result.value.length; i++) {
        csvData.data.push(Object.values(result.value[i]));
    }

    res.status(200).json(csvData);
});

module.exports=router;