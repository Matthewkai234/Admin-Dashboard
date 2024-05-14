const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://khsaif5:8mgeD8nEWuhz9gD0@admindb.jryohb3.mongodb.net/?retryWrites=true&w=majority&appName=adminDB";

const client = new MongoClient(uri);

async function run() {
  await client.connect();
}

async function insertUser(
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
) {
  const database = client.db("web-2-db");
  const users = database.collection("users");
  if (password != confirmPassword) {
    throw "passwords do not match";
  }

  if (!validatePassword(password)) {
    throw "invalid password";
  }

  const validateEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!validateEmail.test(email)) {
    throw "invalid email";
  }

  const doesEmailExist = await users.findOne({ email });
  if (doesEmailExist) {
    throw "email already exists";
  }
  await users.insertOne({
    firstName,
    lastName,
    email,
    password
    //createdAt : new Date() 
  });

  //console.log(`A document was inserted with the _id: ${result.insertedId}`);
}

async function loginUser(email, password) {
  const database = client.db("web-2-db");
  const users = database.collection("users");

  const dbUser = await users.findOne({ email });

  if (!dbUser) {
    throw "email does not exist";
  }

  if (dbUser.password !== password) {
    throw "invalid email or password";
  }
}

function validatePassword(password) {
  if (password.length < 8 || password.length > 16) {
    return false;
  }
  const capitalRegex = /[A-Z]/;
  const smallRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const symbolRegex = /[@!_$%#]/;

  if (
    !capitalRegex.test(password) ||
    !smallRegex.test(password) ||
    !numberRegex.test(password) ||
    !symbolRegex.test(password)
  ) {
    return false;
  }
  return true;
}

module.exports = { run, insertUser, loginUser };