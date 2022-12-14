const mongoose = require("mongoose");
mongoose.promise = global.promise;
const dotenv = require("dotenv");

dotenv.config();

const { MONGO_URI, CLOUD_MONGO_URI } = process.env;

// Connecting to the local mongodb database
exports.connect = () => {
  // console.log("MONGO_URI :", MONGO_URI);

  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useUnifiedTopology: true,
      });
      resolve("local database connection successfull!");
    } catch (err) {
      console.log(err);
      reject("local database connection failed");
    }
  });
};

// Connecting to the cloud mongodb database
exports.connectwithCloudMongoDB = () => {
  // console.log("CLOUD_MONGO_URI :", CLOUD_MONGO_URI);
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(CLOUD_MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useUnifiedTopology: true,
      });
      resolve("cloud database connection successfull!");
    } catch (err) {
      console.log(err);
      reject("cloud database connection failed");
    }
  });
};
