const express = require("express");
const router = express.Router();
const {getGenomeScores} = require("../Controller/genomeScores");
const genomeScores = getGenomeScores();
router.get("/get-genome-scores", async (req,res)=>{

    const result = await genomeScores.next();
    let csvData = {
        headings: ["movieId","tagId", "relevance"],
        data: [],
    };

    for (let i = 0; i < result.value.length; i++) {
        csvData.data.push(Object.values(result.value[i]));
    }

    res.status(200).json(csvData);
});

module.exports=router;