const mongoose = require("mongoose");

const frSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    default: "not provided",
  },
  password: {
    type: String,
    required: true,
    default: "not provided",
  },
  imageName: {
    type: String,
    required: true,
    unique: true,
    default: "not provided",
  },
  baseURL: { type: String, required: true, default: "not provided" },
});

module.exports = mongoose.model("userData", frSchema, "userData");

