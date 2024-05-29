const { client, usersCollection } = require("./Common/mongo");
const { validatePassword } = require("./Common/server");


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

/* async function loginUser(email, password) {
  const dbUser = await usersCollection.findOne({ email });

  if (!dbUser) {
    throw "email does not exist";
  }

  if (dbUser.password !== password) {
    throw "invalid email or password";
  }
} */

async function loginUser(email, password, req) {
  try {
    await client.connect();
    const database = client.db("web-2-db");
    const users = database.collection("users");

    const dbUser = await users.findOne({ email });

    if (!dbUser) {
      throw new Error("Email does not exist");
    }

    if (dbUser.password !== password) {
      throw new Error("Invalid email or password");
    }

    // Store user details in session
    req.session.loginUser = {
      email: email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      isLogged: true
    };
    req.session.save();

  } catch (error) {
    throw error;
  }
}

module.exports = { run, insertUser, loginUser };
