const express = require("express");
const router = express.Router();
const {getRatings} = require("../Controller/ratings");
const ratings = getRatings();
router.get("/get-ratings", async (req,res)=>{

    const result = await ratings.next();
    let csvData = {
      headings: ["userId", "movieId", "rating", "timestamp"],
      data: [],
    };
  
    for (let i = 0; i < result.value.length; i++) {
      csvData.data.push(Object.values(result.value[i]));
    }
  
    res.status(200).json(csvData);
  });

module.exports=router;