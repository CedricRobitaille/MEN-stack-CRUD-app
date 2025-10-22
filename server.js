const dotenv = require("dotenv")
dotenv.config();

const express = require("express")
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}.`);
})

const Monster = require("./models/monsters.js");
app.use(express.urlencoded({ extended: false}));


app.get("/", async (req, res) => {
  res.render("index.ejs", {
    pageTitle: "Home",
  })
});
































app.listen(3000, () => {
  console.log("Listening on Port 3000")
})