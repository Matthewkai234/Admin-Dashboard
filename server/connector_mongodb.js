const { client, usersCollection } = require("./Common/mongo");
const { validatePassword } = require("./Common/server");

// Replace the uri string with your connection string.

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

  const doesEmailExist = await usersCollection.findOne({ email });
  if (doesEmailExist) {
    throw "email already exists";
  }
  await usersCollection.insertOne({
    firstName,
    lastName,
    email,
    password,
    //createdAt : new Date()
  });

  //console.log(`A document was inserted with the _id: ${result.insertedId}`);
}

async function loginUser(email, password) {
  const dbUser = await usersCollection.findOne({ email });

  if (!dbUser) {
    throw "email does not exist";
  }

  if (dbUser.password !== password) {
    throw "invalid email or password";
  }
}

module.exports = { run, insertUser, loginUser };
