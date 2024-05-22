const path = require("path");
const jwt = require("jsonwebtoken");
const express = require("express");

const moviesRouter = require("./Routes/movies");
const linksRouter = require("./Routes/links");
const tagsRouter = require("./Routes/tags");
const ratingsRouter = require("./Routes/ratings");
const genomeTagsRouter = require("./Routes/genomeTags");
const genomeScoresRouter = require("./Routes/genomeScores");
const forgotPasswordRouter = require("./Routes/forgotPassword");
const { PORT } = require("./Common/server");
const { usersCollection } = require("./Common/mongo");
const { JWT_SECRET } = require("./Common/jwt");
const { ObjectId } = require("mongodb");
const { validatePassword } = require("./Common/server");

const app = express();

const { run, insertUser, loginUser } = require("./connector_mongodb");
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "loginUser",
    secret: "HlR4gMmEHgw5Yl1L0Il0GdQWE86QF8LX",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60,
    },
  }),
);
app.set("view engine", "ejs");

/******************************************************** Routes ********************************************************/

app.get("/", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
  }
});

app.get("/layout-static", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.sendFile(path.join(__dirname, "..", "client", "layout-static.html"));
  }
});

app.get("/layout-sidenav-light", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.sendFile(
      path.join(__dirname, "..", "client", "layout-sidenav-light.html"),
    );
  }
});

app.get("/login", (req, res) => {
  if (!req.session.loginUser) {
    res.sendFile(path.join(__dirname, "..", "client", "login.html"));
  } else {
    res.status(301).redirect("/");
  }
});

app.get("/signup", (req, res) => {
  if (!req.session.loginUser) {
    res.sendFile(path.join(__dirname, "..", "client", "register.html"));
  } else {
    res.status(301).redirect("/");
  }
});

app.get("/forget-password", (req, res) => {
  if (!req.session.loginUser) {
    res.sendFile(path.join(__dirname, "..", "client", "password.html"));
  } else {
    res.status(301).redirect("/");
  }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  const objectId = new ObjectId(id);
  const oldUser = await usersCollection.findOne({ _id: objectId });

  if (!oldUser) {
    return res.redirect("/forget-password");
  }

  const secret = JWT_SECRET + oldUser.password;

  try {
    jwt.verify(token, secret);
    return res.render(
      path.join(__dirname, "..", "client", "reset-password.ejs"),
    );
  } catch (e) {
    return res.redirect("/forget-password");
  }
});

app.get("/charts", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.sendFile(path.join(__dirname, "..", "client", "charts.html"));
  }
});

app.get("/tables-links", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "tables-links.html"));
});
app.get("/tables-movies", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "tables-movies.html"));
});

app.get("/tables-tags", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "tables-tags.html"));
});

app.get("/tables-ratings", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "tables-ratings.html"));
});

app.get("/tables-genome-tags", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "tables-genome-tags.html"));
});

app.get("/tables-genome-scores", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "tables-genome-scores.html"));
});

app.post("/api/sign-up", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
    await insertUser(firstName, lastName, email, password, confirmPassword);
  } catch (e) {
    console.error(e);
    res
      .status(401)
      .sendFile(path.join(__dirname, "..", "client", "register.html"));
  }
  res.redirect("/login");
  console.log("User inserted successfully, now it should redirect to /login");
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await loginUser(email, password);
    req.session.loginUser = { email: email, isLogged: true };
    req.session.save();
  } catch (e) {
    console.error(e);
    return;
  }
  res.redirect("/");
});

app.post("/api/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error logging out");
    }

    req.session = null;
    res.redirect("/login");
  });
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.json({ error: "Passwords are not the same" });
  }

  if (!validatePassword(password)) {
    return res.json({ error: "Password is not valid" });
  }

  const objectId = new ObjectId(id);
  const oldUser = await usersCollection.findOne({ _id: objectId });

  if (!oldUser) {
    return res.redirect("/forget-password");
  }

  const secret = JWT_SECRET + oldUser.password;

  try {
    jwt.verify(token, secret);
    await usersCollection.updateOne(
      { _id: objectId },
      { $set: { password: password } },
    );
    return res.status(304).redirect("/login");
  } catch (e) {
    return res.status(500).redirect("/forget-password");
  }
});

/******************************************************** Errors ********************************************************/
app.get("/401", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "401.html"));
});

app.get("/500", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "500.html"));
});

app.use(express.static(path.join(__dirname, "..", "client")));
app.use("/static", express.static(path.join(__dirname, "..", "client")));

app.use("/api/movie", moviesRouter);
app.use("/api/links", linksRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/ratings", ratingsRouter);
app.use("/api/genome-tags", genomeTagsRouter);
app.use("/api/genome-scores", genomeScoresRouter);
app.use("/api/forgot-password", forgotPasswordRouter);

/******************************************************** Errors ********************************************************/
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "404.html"));
});
/***********************************************************************************************************************/
// Start the database connection when the server starts

run()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
//app.listen(42069);
