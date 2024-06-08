const express = require("express");
const router = express.Router();
const { getRatings, getRating } = require("../Controller/ratings");

router.get("/get-ratings", async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const ratings = await getRatings(start, length);
    res.status(200).json(ratings);
    
});

router.get("/get-rating", async (req, res) => {
    const { query } = req.query;
  
    console.log(query);
  
    const matched = await getRating(query);
  
    res.status(200).json(matched);
  });

module.exports = router;