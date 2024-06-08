const path = require("path");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt")

const moviesRouter = require("./Routes/movies");
const linksRouter = require("./Routes/links");
const tagsRouter = require("./Routes/tags");
const ratingsRouter = require("./Routes/ratings");
const genomeTagsRouter = require("./Routes/genomeTags");
const genomeScoresRouter = require("./Routes/genomeScores");
const forgotPasswordRouter = require("./Routes/forgotPassword");
const { PORT } = require("./Common/server");
const { User, run } = require("./Common/mongo");
const { JWT_SECRET } = require("./Common/jwt");
const { ObjectId } = require("mongodb");
const { validatePassword } = require("./Common/server");

const app = express();

const { insertUser, loginUser } = require("./connector_mongodb");
const session = require("express-session");
const { title } = require("process");
const { timeEnd } = require("console");

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

app.use(express.static(path.join(__dirname, "..", "client"))); //serve ejs pages
app.use("/static", express.static(path.join(__dirname, ".", "public"))); //serve the assets

/******************************************************** Routes ********************************************************/
app.get("/", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.render("index",{
      title: "Home"
    });
  }
});

app.get("/login", (req, res) => {
  if (!req.session.loginUser) {
    res.render("auth/login",{
      title: "Login"
    });
  } else {
    res.status(301).redirect("/");
  }
});

app.get("/signup", (req, res) => {
  if (!req.session.loginUser) {
    res.render(path.join(__dirname, "..", "client", "auth", "register"),{
      title: "Create new account"
    });
  } else {
    res.status(301).redirect("/");
  }
});

app.get("/forget-password", (req, res) => {
  if (!req.session.loginUser) {
    res.render("auth/forget-password",{
      title: "Password Recovery"
    });
  } else {
    res.status(301).redirect("/");
  }
});

app.get('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;

  const objectId = new ObjectId(id);
  const oldUser = await User.findOne({ _id: objectId });

  if (!oldUser) {
    return res.redirect('/forget-password');
  }

  const secret = JWT_SECRET + oldUser.password;

  try {
    jwt.verify(token, secret);
    return res.render('auth/reset-password', {
      title: 'Reset Password'
    });
  } catch (e) {
    return res.redirect('/forget-password');
  }
});

/************************************* Charts **************************************/
app.get("/movies-per-year-chart", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.render("tables/movies-per-year-chart",{
      title: "Movies per year chart"
    });
  }
});

app.get("/movies-per-genre-chart", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.render("tables/movies-per-genre-chart",{
      title: "Movies per genre cart"
    });
  }
});

/************************************* Data tables **************************************/
app.get("/table-links", (req, res) => {
  res.render("tables/table-links",{
    title: "Links table"
  });
});

app.get("/table-movies", (req, res) => {
  res.render("tables/table-movies",{
    title: "Movies"
  });
});

app.get("/table-tags", (req, res) => {
  res.render("tables/table-tags",{
    title: "Tags table"
  });
});

app.get("/table-ratings", (req, res) => {
  res.render("tables/table-ratings",{
    title:"Ratings table"
  });
});

app.get("/table-genome-tags", (req, res) => {
  res.render("tables/table-genome-tags",{
    title: "Genome Tags"
  });
});

app.get("/table-genome-scores", (req, res) => {
  res.render("tables/table-genome-scores",
    {
      title: "Genome Scores"
    }
  );
});

/************************************* Authentication Handlers **************************************/
app.post("/api/sign-up", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
    await insertUser(firstName, lastName, email, password, confirmPassword);
  } catch (e) {
    console.error(e);
    res.status(401).render(path.join(__dirname, "..", "client", "auth", "register"),{
      title: "Create new account"
    });
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
  if (req.session.loginUser?.isLogged) {
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
  const oldUser = await User.findOne({ _id: objectId });

  if (!oldUser) {
    return res.redirect("/forget-password");
  }

  const secret = JWT_SECRET + oldUser.password;

  try {
    jwt.verify(token, secret);
    const hashedPassword = await bcrypt.hash(password)
    await User.updateOne(
      { _id: objectId },
      { $set: { password: hashedPassword } },
    );
    return res.status(304).redirect("/login");
  } catch (e) {
    return res.status(500).redirect("/forget-password");
  }
});

/******************************************************** Errors ********************************************************/
app.get('/401', (req, res) => {
  res.render('error/401', {
      title: 'Error 401',
      errorCode: '401',
      errorMessage: 'Unauthorized',
      errorDescription: 'Access to this resource is denied.',
      additionalInfo: 'If you got here from the login page, check your email and password!',
      returnUrl_1: '/',
      returnText_1: 'Return to Dashboard',
      returnUrl_2: '/login',
      returnText_2: 'Return to Login'      
  });
});

app.get('/404', (req, res) => {
  res.render('error/404', {
      title: 'Error 404',
      errorMessage: 'This requested URL was not found on this server.',
      returnUrl: '/',
      returnText: 'Return to Dashboard'     
  });
});

app.get('/500', (req, res) => {
  res.render('error/500', {
      title: 'Error 500',
      errorCode: '500',
      errorMessage: 'Internal Server Error',
      returnUrl: '/',  
      returnText: 'Return to Dashboard'
  });
});

/******************************************************** External Routes ********************************************************/
app.use("/api/movie", moviesRouter);
app.use("/api/links", linksRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/ratings", ratingsRouter);
app.use("/api/genome-tags", genomeTagsRouter);
app.use("/api/genome-scores", genomeScoresRouter);
app.use("/api/forgot-password", forgotPasswordRouter);

/******************************************************** 404 Error ********************************************************/
app.get("/*", (req, res) => {
  res.redirect("404");
});

/***********************************************************************************************************************/
// Start the database connection then the server.
run()
  .then( () => {
    console.log("Database connected successfully!");

    
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

  app.listen(PORT,  () => {
    console.log(`Server is listening on port ${PORT}, http://localhost:${PORT}/`);

    // Dynamically import the 'open' package
    // try {
    //   const open = await import('open');
    //   await open.default(`http://localhost:${PORT}/`);
    //   console.log("Browser opened successfully!");
    // } catch (err) {
    //   console.error("Error opening the browser:", err);
    // }
  });