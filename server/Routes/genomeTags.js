const express = require("express");
const router = express.Router();
const { getGenomeTags, getGenomeTag } = require("../Controller/genomeTags");

router.get("/get-genome-tags", async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const genometags = await getGenomeTags(start, length);
    res.status(200).json(genometags);
    
});

router.get("/get-genome-tag", async (req, res) => {
    const { query } = req.query;
  
    console.log(query);
  
    const matched = await getGenomeTag(query);
  
    res.status(200).json(matched);
  });

module.exports = router;