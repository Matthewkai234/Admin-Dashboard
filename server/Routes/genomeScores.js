const express = require("express");
const router = express.Router();
const {getGenomeScores} = require("../Controller/genomeScores");


const {GenomeScoresTable} = require("../Common/mongo");
router.get("/get-genome-scores", async (req, res) => {
    const genomeScores = await getGenomeScores();
    console.log(genomeScores)
    res.status(200).json(genomeScores);
})

module.exports=router;