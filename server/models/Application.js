const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  userId: String,
  serviceType: String,
  status: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Application", applicationSchema);