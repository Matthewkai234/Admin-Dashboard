const path = require("path");
const express = require("express");

const moviesRouter = require("./Routes/movies");
const linksRouter = require("./Routes/links");
const tagsRouter = require("./Routes/tags");
const ratingsRouter = require("./Routes/ratings");
const genomeTagsRouter = require("./Routes/genomeTags")

const app = express();

const { run, insertUser, loginUser } = require("./connector_mongodb");
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

/******************************************************** Routes ********************************************************/

app.get("/", (req, res) => {
  console.log(!req.session.loginUser);
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
    res.status(301).redirect("/login");
  } else {
    res.sendFile(path.join(__dirname, "..", "client", "password.html"));
  }
});

app.get("/charts", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.sendFile(path.join(__dirname, "..", "client", "charts.html"));
  }
});

app.get("/tables", (req, res) => {
  if (!req.session.loginUser) {
    res.status(301).redirect("/login");
  } else {
    res.sendFile(path.join(__dirname, "..", "client", "tables.html"));
  }
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

/******************************************************** Errors ********************************************************/
app.get("/401", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "401.html"));
});

app.get("/500", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "500.html"));
});

app.use(express.static(path.join(__dirname, "..", "client")));


app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "index.html")); 
})

app.get('/layout-static', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "layout-static.html")); 
})

app.get('/layout-sidenav-light', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "layout-sidenav-light.html")); 
})

app.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "login.html")); 
})

app.get('/signup', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "register.html")); 
})

app.get('/forget-password', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "password.html")); 
})

app.get('/charts', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "charts.html")); 
})

app.get('/tables-links', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "tables-links.html")); 
})
app.get('/tables-movies', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "tables-movies.html")); 
})

app.get('/tables-tags', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "tables-tags.html")); 
})

app.get('/tables-ratings', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "tables-ratings.html")); 
})

app.get('/tables-genome-tags', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "tables-genome-tags.html")); 
})

app.use("/api/movie", moviesRouter);
app.use("/api/links", linksRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/ratings", ratingsRouter);
app.use("/api/genome-tags", genomeTagsRouter);

/******************************************************** Errors ********************************************************/ 
app.get('/401', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "401.html")); 
})
app.get('/500', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "500.html")); 
})
app.get('/*', (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client", "404.html")); 
})
/***********************************************************************************************************************/ 
// Start the database connection when the server starts

run()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

const PORT = process.env.PORT || 42069;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
//app.listen(42069);