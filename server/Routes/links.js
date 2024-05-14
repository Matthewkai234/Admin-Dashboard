const express = require("express");
const router = express.Router();
const {getLinks} = require("../Controller/links");

router.get("/get-links", async (req,res)=>{
    const links = await getLinks();
    // res.status(200).json(links)
    let html = `

    `
    for(let i=0; i<links.length; i++){
        html+=`    
        <tr>
            <td>${links[i].movieId}</td> 
            <td>${links[i].imdbId}</td>
            <td>${links[i].tmdbId}</td>
        </tr>
    `
    }
    res.status(200).send(html)
})

module.exports=router;