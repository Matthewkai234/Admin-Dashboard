const path = require("path");
const express = require("express");
const moviesRouter = require("./Routes/movies");
const linksRouter = require("./Routes/links");
const tagsRouter = require("./Routes/tags");
const ratingsRouter = require("./Routes/ratings");
const genomeTagsRouter = require("./Routes/genomeTags")

const app = express();

/******************************************************** Routes ********************************************************/ 

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

app.listen(42069);

/***********************************************************************************************************************/