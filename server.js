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
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")))

const multer = require("multer");

const uploadPath = path.join(__dirname, 'public', 'images')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Extension Name
  }
});

const upload = multer({ storage: storage })







app.get("/", async (req, res) => {
  res.render("index.ejs", {
    pageTitle: "The Bestiary Compendium",
  })
});

app.get("/bestiary/new", async (req, res) => {
  res.render("bestiary/new.ejs", {
    pageTitle: "Create a New Monster",
  })
})

app.get('/bestiary', async (req, res) => {
  const allMonsters = await Monster.find();
  res.render("bestiary/index.ejs", {
    pageTitle: "The Bestiary",
    monsters: allMonsters,
  })
})

app.get("/bestiary/:monsterId", async (req, res) => {
  const monsterData = await Monster.findById(req.params.monsterId);
  res.render(`bestiary/show.ejs`, {
    pageTitle: `${monsterData.name}`,
    monster: monsterData,
  });
})

app.get("/bestiary/:monsterId/edit", async (req, res) => {
  const monsterData = await Monster.findById(req.params.monsterId);
  res.render(`bestiary/edit.ejs`, {
    pageTitle: `${monsterData.name}`,
    monster: monsterData,
  })
})






app.post("/bestiary", upload.single("file"), async (req, res, next) => {
  const image = req.file ? req.file.filename : null;
  req.body.file = image;

  await Monster.create(req.body);
  res.redirect("/bestiary");
})

app.delete("/bestiary/:monsterId", async (req, res) => {
  await Monster.findByIdAndDelete(req.params.monsterId);
  res.redirect("/bestiary")
})

app.put("/bestiary/:monsterId", upload.single("file"), async (req, res) => {
  const image = req.file ? req.file.filename : null;
  if (image != null) {
    req.body.file = image;
  } else {
    delete req.body.file;
  }
  
  await Monster.findByIdAndUpdate(req.params.monsterId, req.body);
  res.redirect(`/bestiary/${req.params.monsterId}`);
})







app.listen(3000, () => {
  console.log("Listening on Port 3000")
})