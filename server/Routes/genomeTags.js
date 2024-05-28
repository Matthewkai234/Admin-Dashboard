const express = require("express");
const router = express.Router();
const {getGenomeTags} = require("../Controller/genomeTags");
const genomeTags = getGenomeTags();
router.get("/get-genome-tags", async (req,res)=>{

    const result = await genomeTags.next();
    let csvData = {
        headings: ["tagId", "tag"],
        data: [],
    };

    for (let i = 0; i < result.value.length; i++) {
        csvData.data.push(Object.values(result.value[i]));
    }

    res.status(200).json(csvData);
});

module.exports=router;