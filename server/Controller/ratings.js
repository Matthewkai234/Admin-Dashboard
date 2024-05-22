const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const readline = require("readline");
const {Readable} = require("stream");

async function* getRatings(){
    const fileStream = fs.createReadStream(path.join("Data", "ratings.csv"));
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let chunk = [];
    let lineCount = 0;

    for await (const line of rl) {
        chunk.push(line);
        lineCount++;
        if (lineCount === 1000) {
          const chunkString = chunk.join("\n");
          const results = await parseCSV(chunkString);
        
          yield results;
          const keys = chunk.shift();
          chunk = [];
          chunk.push(keys);
          lineCount = 0;
        }
      }

    if (chunk.length > 0) {
        const chunkString = chunk.join("\n");
        const results = await parseCSV(chunkString);
        yield results;
    }
}

function parseCSV(chunkString) {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = Readable.from(chunkString).pipe(csv());
        stream.on("data", (data) => results.push(data));
        stream.on("end", () => resolve(results));
        stream.on("error", (error) => reject(error));
    });
}

module.exports={
    getRatings
}