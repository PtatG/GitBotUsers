/*
Project name: GitBot User Website
Written by: Phillip Tat
Date written: 10/17/21
For: UCF Senior Design Project
Purpose: Website for github bot users to see their levels, total experience earned,
and commit message data. (if possible, also send anonymous messages.)
*/
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config");
const db = process.env.MONGODB_URI;
const corsOptions = process.env.ORIGIN;
const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: "50mb"}));

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully connected to the database.");
})
.catch(err => {
  console.log(err);
  process.exit();
});

app.get("/", (req, res) => {
  res.json({message: "Welcome to the GitBotUser website."});
});

// if name api back to app, must change this line
require("./api/routes/routes.js")(app);

app.listen(port, () => {
  console.log("Server is running on port %d", port);
});
