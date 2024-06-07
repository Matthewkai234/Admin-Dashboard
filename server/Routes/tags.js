const express = require("express");
const router = express.Router();
const {getTags} = require("../Controller/tags");


const {TagsTable} = require("../Common/mongo");
router.get("/get-tags", async (req, res) => {
    const tags = await getTags();
    console.log(tags)
    res.status(200).json(tags);
})

module.exports=router;