const express = require("express");
const router = express.Router();
const {getRatings} = require("../Controller/ratings");


const {RatingsTable} = require("../Common/mongo");
router.get("/get-ratings", async (req, res) => {
    const ratings = await getRatings();
    console.log(ratings)
    res.status(200).json(ratings);
})

module.exports=router;