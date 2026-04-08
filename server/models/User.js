const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  phone: String,
  address: String,
  aadhaar: String,
  dob: String,
  gender: String,

  role: { type: String, default: "citizen" }
});

module.exports = mongoose.model("User", userSchema);