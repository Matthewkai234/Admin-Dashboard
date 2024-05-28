const express = require("express");
const router = express.Router();
const {getLinks} = require("../Controller/links");
const links = getLinks();
router.get("/get-links", async (req,res)=>{

    const result = await links.next();
    let csvData = {
        headings: ["movieId", "imdbId", "tmdbId"],
        data: [],
    };

    for (let i = 0; i < result.value.length; i++) {
        csvData.data.push(Object.values(result.value[i]));
    }

    res.status(200).json(csvData);
});

module.exports=router;