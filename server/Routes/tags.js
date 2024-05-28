const express = require("express");
const router = express.Router();
const {getTags} = require("../Controller/tags");
const tags = getTags();
router.get("/get-tags", async (req,res)=>{

    const result = await tags.next();
    let csvData = {
      headings: ["userId", "movieId", "tag", "timestamp"],
      data: [],
    };
  
    for (let i = 0; i < result.value.length; i++) {
      csvData.data.push(Object.values(result.value[i]));
    }
  
    res.status(200).json(csvData);
  });

module.exports=router;