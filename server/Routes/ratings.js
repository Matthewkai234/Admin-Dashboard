const express = require("express");
const router = express.Router();
const {getRatings} = require("../Controller/ratings");

router.get("/get-ratings", async (req,res)=>{
    const tags = await getRatings();
    console.log(tags[0]);
    res.status(200).json(ratings)
})

module.exports=router;