const express = require("express");
const router = express.Router();
const {getLinks} = require("../Controller/links");


const {LinksTable} = require("../Common/mongo");
router.get("/get-links", async (req, res) => {
    const links = await getLinks();
    console.log(links)
    res.status(200).json(links);
})

module.exports=router;