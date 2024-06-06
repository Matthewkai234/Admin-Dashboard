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
const { title } = require("process");

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
app.set("views", path.join(__dirname, "..", "client"));

/******************************************************** Routes ********************************************************/

app.get("/", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.render("index");
  }
});

app.get("/login", (req, res) => {
  if (!req.session.loginUser) {
    res.render("login",{
      title: "Login"
    });
  } else {
    res.status(301).redirect("/");
  }
});

app.get("/signup", (req, res) => {
  if (!req.session.loginUser) {
    res.render("register");
  } else {
    res.status(301).redirect("/");
  }
});

app.get("/forget-password", (req, res) => {
  if (!req.session.loginUser) {
    res.render("forget-password");
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
    return res.render("reset-password",{
      title: "Reset password"
    });
  } catch (e) {
    return res.redirect("/forget-password");
  }
});

app.get("/movies-chart", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.render("movies-chart");
  }
});

app.get("/movies-genres-chart", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.render("movies-genres-chart");
  }
});

app.get("/tables-links", (req, res) => {
  res.render("tables-links");
});

app.get("/tables-movies", (req, res) => {
  res.render("tables-movies");
});

app.get("/tables-tags", (req, res) => {
  res.render("tables-tags");
});

app.get("/tables-ratings", (req, res) => {
  res.render("tables-ratings");
});

app.get("/tables-genome-tags", (req, res) => {
  res.render("tables-genome-tags");
});

app.get("/tables-genome-scores", (req, res) => {
  res.render("tables-genome-scores");
});

app.post("/api/sign-up", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
    await insertUser(firstName, lastName, email, password, confirmPassword);
  } catch (e) {
    console.error(e);
    res.status(401).render("register");
  }
  res.redirect("/login");
  console.log("User inserted successfully, now it should redirect to /login");
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await loginUser(email, password, req);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/401");
  }
});

app.get("/api/user", (req, res) => {
  if (req.session.loginUser && req.session.loginUser.isLogged) {
    res.json({
      email: req.session.loginUser.email,
      firstName: req.session.loginUser.firstName,
      lastName: req.session.loginUser.lastName
    });
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
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
app.get('/401', (req, res) => {
  res.render('401', {
      title: 'Error 401',
      errorCode: '401',
      errorMessage: 'Unauthorized',
      errorDescription: 'Access to this resource is denied.',
      additionalInfo: 'If you got here from the login page, check your email and password!',
      returnUrl_1: '/index',
      returnText_1: 'Return to Dashboard',
      returnUrl_2: '/login',
      returnText_2: 'Return to Login'      
  });
});

app.get('/404', (req, res) => {
  res.render('404', {
      title: 'Error 404',
      errorImageSrc: 'assets/img/error-404-monochrome.svg',
      errorMessage: 'This requested URL was not found on this server.',
      returnUrl: '/index',
      returnText: 'Return to Dashboard'     
  });
});

app.get('/500', (req, res) => {
  res.render('500', {
      title: 'Error 500',
      errorCode: '500',
      errorMessage: 'Internal Server Error',
      returnUrl: '/index',  // Use the root route or any other route you have set up in your Express app
      returnText: 'Return to Dashboard'
  });
});

app.use(express.static(path.join(__dirname, "..", "client"))); //serve ejs pages
app.use("/static", express.static(path.join(__dirname, ".", "public"))); //serve the assets

app.use("/api/movie", moviesRouter);
app.use("/api/links", linksRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/ratings", ratingsRouter);
app.use("/api/genome-tags", genomeTagsRouter);
app.use("/api/genome-scores", genomeScoresRouter);
app.use("/api/forgot-password", forgotPasswordRouter);

/******************************************************** Errors ********************************************************/
app.get("/*", (req, res) => {
  res.render("404");
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