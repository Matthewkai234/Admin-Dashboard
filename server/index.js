const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb+srv://khsaif5:8mgeD8nEWuhz9gD0@admindb.jryohb3.mongodb.net/?retryWrites=true&w=majority&appName=adminDB";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('web-2-db');
    const users = database.collection('users');

    // Query for a movie that has the title 'Back to the Future'
    const query = { name: 'saif' };
    const user = await users.findOne(query);

    console.log(user);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);