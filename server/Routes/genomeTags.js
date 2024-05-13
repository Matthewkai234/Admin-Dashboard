const express = require("express");
const router = express.Router();
const {getGenomeTags} = require("../Controller/genomeTags");

router.get("/get-genome-tags", async (req,res)=>{
    const links = await getGenomeTags();
    res.status(200).json(links)
})

module.exports=router;