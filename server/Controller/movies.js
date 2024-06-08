const path = require("path");
const fs = require("fs");
// const csv = require("csv-parser");
// const readline = require("readline");
// const {Readable} = require("stream");

// async function* getMovies(){
//     const fileStream = fs.createReadStream(path.join("Data", "movies.csv"));
//     const rl = readline.createInterface({
//         input: fileStream,
//         crlfDelay: Infinity
//     });

//     let chunk = [];
//     let lineCount = 0;

//     for await (const line of rl) {
//         chunk.push(line);
//         lineCount++;
//         if (lineCount === 1000) {
//           const chunkString = chunk.join("\n");
//           const results = await parseCSV(chunkString);
        
//           yield results;
//           const keys = chunk.shift();
//           chunk = [];
//           chunk.push(keys);
//           lineCount = 0;
//         }
//       }

//     if (chunk.length > 0) {
//         const chunkString = chunk.join("\n");
//         const results = await parseCSV(chunkString);
//         yield results;
//     }
// }

// function parseCSV(chunkString) {
//     return new Promise((resolve, reject) => {
//         const results = [];
//         const stream = Readable.from(chunkString).pipe(csv());
//         stream.on("data", (data) => results.push(data));
//         stream.on("end", () => resolve(results));
//         stream.on("error", (error) => reject(error));
//     });
// }
// module.exports={
//     getMovies
// }





// const { MoviesTable } = require("../Common/mongo");

// async function getMovies() {
//   try {
//     const movies = await MoviesTable.find();
//     return movies;
//   } catch (error) {
//     console.error("Error fetching movies:", error);
//     throw error;
//   }
// }

// module.exports = { getMovies };


const { MoviesTable } = require("../Common/mongo");

async function getMovies(start = 0, length = 10) {
  try {
    const movies = await MoviesTable.find().skip(start).limit(length);
    return movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

async function getMovie(searchQuery) {
    if (searchQuery === "" || searchQuery === null || searchQuery === undefined){
        return await getMovies();
    }

    try {
        let query = {};
        if (searchQuery) {
            // Modify the query to search for exact or partial match
            query = { title: { $regex: searchQuery, $options: 'i' } };
        }
        const movies = await MoviesTable.find(query);
        return movies;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

module.exports = { getMovies, getMovie}; 