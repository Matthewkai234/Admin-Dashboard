const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://moh_halim:zp95mOYVHAAgPzS0@admindb.jryohb3.mongodb.net/?retryWrites=true&w=majority&appName=adminDB";

const client = new MongoClient(uri);

const database = client.db("web-2-db");
const usersCollection = database.collection("users");

module.exports = { client, usersCollection };
