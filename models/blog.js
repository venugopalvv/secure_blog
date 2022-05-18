const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
    required: false,
  },
  postedAt: {
    type: String,
    default: new Date().toString(),
  },
});

module.exports = new mongoose.model("Blog", BlogSchema);