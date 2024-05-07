const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb+srv://khsaif5:<password>.jryohb3.mongodb.net/?retryWrites=true&w=majority&appName=adminDB";

const client = new MongoClient(uri);

async function run(data) {
  try {
    await client.connect();
    const database = client.db('web-2-db');
    const users = database.collection('users');

    if(data !== null)
    {
        const result = await users.insertOne(data);
    }

    //console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

module.exports = run;