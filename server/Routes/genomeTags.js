const express = require("express");
const router = express.Router();
const {getGenomeTags} = require("../Controller/genomeTags");


const {GenomeTagsTable} = require("../Common/mongo");
router.get("/get-genome-tags", async (req, res) => {
    const genomeTags = await getGenomeTags();
    console.log(genomeTags)
    res.status(200).json(genomeTags);
})

module.exports=router;