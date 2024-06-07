// const { MongoClient } = require("mongodb");

// const uri =
//   "mongodb+srv://moh_halim:zp95mOYVHAAgPzS0@admindb.jryohb3.mongodb.net/?retryWrites=true&w=majority&appName=adminDB";

// const client = new MongoClient(uri);

// const database = client.db("web-2-db");
// const usersCollection = database.collection("users");

// module.exports = { client, usersCollection };
const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
/* async function run(){
  mongoose.connect("mongodb+srv://moh_halim:zp95mOYVHAAgPzS0@admindb.jryohb3.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // To suppress deprecation warning for `ensureIndex`
  // useFindAndModify: false // To suppress deprecation warning for `findAndModify`
});
} */

async function run(){
  mongoose.connect("mongodb://localhost:27017/web-2-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // To suppress deprecation warning for `ensureIndex`
  // useFindAndModify: false // To suppress deprecation warning for `findAndModify`
});
}

// Define the schema for the users collection
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
}, { timestamps: true });

// Create a model based on the schema
const User = mongoose.model('users', userSchema);

// Export the User model
module.exports = {User, run};

