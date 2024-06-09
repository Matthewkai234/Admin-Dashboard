const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
async function run(){
  mongoose.connect("mongodb://localhost:27017/collections");
}

/******************************************** User Schema ********************************************/
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
}, { timestamps: true });
const User = mongoose.model('users', userSchema);

/******************************************** Movies Table Schema ********************************************/
const moviesTableSchema = new mongoose.Schema({
  movieId: Number,
  title: String,
  genres: String,
});
const MoviesTable = mongoose.model('moviestable', moviesTableSchema);

/******************************************** Links Table Schema ********************************************/
const linksTableSchema = new mongoose.Schema({
  movieId: String,
  imdbId: String,
  tmdbId: String,
});
const LinksTable = mongoose.model('linkstable', linksTableSchema);

/******************************************** Ratings Table Schema ********************************************/
const ratingsTableSchema = new mongoose.Schema({
  userId: String,
  movieId: String,
  rating: String,
  timestamp: String,
});
const RatingsTable = mongoose.model('ratingstable', ratingsTableSchema);

/******************************************** Tags Table Schema ********************************************/
const tagsTableSchema = new mongoose.Schema({
  userId: String,
  movieId: String,
  tag: String,
  timestamp: String,
});
const TagsTable = mongoose.model('tagstable', tagsTableSchema);

/******************************************** Genome Tags Table Schema ********************************************/
const genomeTagsTableSchema = new mongoose.Schema({
  tagId: String,
  tag: String,
});
const GenomeTagsTable = mongoose.model('genometagstable', genomeTagsTableSchema);

/******************************************** Genome Scores Table Schema ********************************************/
const genomeScoresTableSchema = new mongoose.Schema({
  movieId: String,
  tagId: String,
  relevance: String,
});
const GenomeScoresTable = mongoose.model('genomescorestable', genomeScoresTableSchema);


// Export the User model
module.exports = {User, run, MoviesTable, LinksTable, RatingsTable, TagsTable, GenomeTagsTable, GenomeScoresTable};

