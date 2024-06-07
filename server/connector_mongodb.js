const { User } = require("./Common/mongo");
const { validatePassword } = require("./Common/server");
const bcrypt = require("bcrypt");

// async function run() {
//   await client.connect();
// }

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

  const doesEmailExist = await User.findOne({ email });
  if (doesEmailExist) {
    throw "email already exists";
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  
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
    // await client.connect();
    // const database = client.db("web-2-db");
    // const users = database.collection("users");

    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      throw new Error("Email does not exist");
    }
    const isPasswordSame = await bcrypt.compare(password,dbUser.password)
    if (!isPasswordSame) {
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

module.exports = {insertUser, loginUser };
