const express = require("express");
const router = express.Router();
const { getLinks, getLink } = require("../Controller/links");

router.get("/get-links", async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const links = await getLinks(start, length);
    res.status(200).json(links);
    
});

router.get("/get-link", async (req, res) => {
    const { query } = req.query;
  
    console.log(query);
  
    const matched = await getLink(query);
  
    res.status(200).json(matched);
  });

module.exports = router;