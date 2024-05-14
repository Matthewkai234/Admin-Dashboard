const express = require("express");
const router = express.Router();
const {getMovies} = require("../Controller/movies");

router.get("/get-movies", async (req,res)=>{
    const movies = await getMovies();
    // res.status(200).json(movies)
    let html = `

    `
    for(let i=0; i<movies.length; i++){
        html+=`    
        <tr>
            <td>${movies[i].movieId}</td> 
            <td>${movies[i].title}</td>
            <td>${movies[i].genres}</td>
        </tr>
    `
    }
    res.status(200).send(html)
})

module.exports=router;