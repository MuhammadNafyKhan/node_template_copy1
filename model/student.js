const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fName: { type: String, default: "not provided" },
  lName: { type: String, default: "not provided" },
  regNo: { type: String, unique: true, required: true },
  gender: { type: String, default: "not specified" },
  password: { type: String, required: true },
});

module.exports = mongoose.model(
  "studentinfoscopy",
  studentSchema,
  "studentinfoscopy"
);
