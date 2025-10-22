const mongoose = require("mongoose");

const monsterSchema = new mongoose.Schema({
  name: String,
  region: String,
  background: String,
  classification: String,
})

const Monster = mongoose.model("Monster", monsterSchema);

module.exports = Monster;