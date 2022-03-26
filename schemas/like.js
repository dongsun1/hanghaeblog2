const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  postNumber: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Like", likeSchema);
