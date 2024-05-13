const express = require("express");
const router = express.Router();
const {getTags} = require("../Controller/tags");

router.get("/get-tags", async (req,res)=>{
    const tags = await getTags();
    console.log(tags[0]);
    res.status(200).json(tags)
})

module.exports=router;