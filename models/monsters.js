const mongoose = require("mongoose");

const monsterSchema = new mongoose.Schema({
  name: String,
  region: String,
  background: String,
  evil: Boolean,
})

const Monster = mongoose.model("Monster", monsterSchema);

module.exports = Monster;