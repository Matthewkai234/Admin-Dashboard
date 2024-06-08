// const { MongoClient } = require("mongodb");

// const uri =
//   "mongodb+srv://moh_halim:zp95mOYVHAAgPzS0@admindb.jryohb3.mongodb.net/?retryWrites=true&w=majority&appName=adminDB";

// const client = new MongoClient(uri);

// const database = client.db("web-2-db");
// const usersCollection = database.collection("users");

// module.exports = { client, usersCollection };
const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
async function run(){
mongoose.connect("mongodb://localhost:27017/collections", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // To suppress deprecation warning for `ensureIndex`
  // useFindAndModify: false // To suppress deprecation warning for `findAndModify`
});
}

// Define the schema for the users collection
const userSchema = new mongoose.Schema({
  // Define your schema fields here
  // For example:
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  // Add more fields as needed
});
const User = mongoose.model('users', userSchema);

//////////////////////////////////////////////////////////////////////////////////////////////////

const moviesTableSchema = new mongoose.Schema({
  movieId: Number,
  title: String,
  genres: String,
});
const MoviesTable = mongoose.model('moviestable', moviesTableSchema);

const linksTableSchema = new mongoose.Schema({
  movieId: String,
  imdbId: String,
  tmdbId: String,
});
const LinksTable = mongoose.model('linkstable', linksTableSchema);

const ratingsTableSchema = new mongoose.Schema({
  userId: String,
  movieId: String,
  rating: String,
  timestamp: String,
});
const RatingsTable = mongoose.model('ratingstable', ratingsTableSchema);


const tagsTableSchema = new mongoose.Schema({
  userId: String,
  movieId: String,
  tag: String,
  timestamp: String,
});
const TagsTable = mongoose.model('tagstable', tagsTableSchema);


const genomeTagsTableSchema = new mongoose.Schema({
  tagId: String,
  tag: String,
});
const GenomeTagsTable = mongoose.model('genometagstable', genomeTagsTableSchema);


const genomeScoresTableSchema = new mongoose.Schema({
  movieId: String,
  tagId: String,
  relevance: String,
});
const GenomeScoresTable = mongoose.model('genomescorestable', genomeScoresTableSchema);

// Create a model based on the schema


// Export the User model
module.exports = {User, run, MoviesTable, LinksTable, RatingsTable, TagsTable, GenomeTagsTable, GenomeScoresTable};

