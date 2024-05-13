const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");

async function getMovies(){
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(path.join("Data", "movies.csv")).pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    })
}
module.exports={
    getMovies
}