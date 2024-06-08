const express = require("express");
const router = express.Router();
const { getTags, getTag } = require("../Controller/tags");

router.get("/get-tags", async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const tags = await getTags(start, length);
    res.status(200).json(tags);
    
});

router.get("/get-tag", async (req, res) => {
    const { query } = req.query;
  
    console.log(query);
  
    const matched = await getTag(query);
  
    res.status(200).json(matched);
  });

module.exports = router;