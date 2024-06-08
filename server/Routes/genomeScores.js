const express = require("express");
const router = express.Router();
const { getGenomeScores, getGenomeScore } = require("../Controller/genomeScores");

router.get("/get-genome-scores", async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const genomescores = await getGenomeScores(start, length);
    res.status(200).json(genomescores);
    
});

router.get("/get-genome-score", async (req, res) => {
    const { query } = req.query;
  
    console.log(query);
  
    const matched = await getGenomeScore(query);
  
    res.status(200).json(matched);
  });

module.exports = router;