const express = require("express");
const https = require('https');
const database = require("./config/databaseConnection");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

require("./startup/routes")(app);

app.get("/", (req, res) => {
  res.status(200).send("ok");
});

const port = process.env.PORT || 4000;

try {
  // connecting with local mongodb databse
  database
    .connectwithCloudMongoDB()
    .then((message) => {
      console.log(message);
      app.listen(port, () => {
        console.log(`server listening on port ${port}`);
      });
    })
    .catch((err) => console.log(err));

  // connecting with cloud mongodb databse
  // replae @ with %40 in uri string, follow this link
  // https://stackoverflow.com/questions/55753484/mongoparseerror-uri-does-not-have-hostname-domain-name-and-tld
  // database
  //   .connectwithCloudMongoDB()
  //   .then((message) => {
  //     console.log(message);
  //     app.listen(port, () => {
  //       console.log(`server listening on port ${port}`);
  //     });
  //   })
  //   .catch((err) => console.log(err));
} catch (err) {
  console.log(err);
}


// var isCorrupted = require('is-corrupted-jpeg');
// console.log(isCorrupted('/home/tk-lpt-739/Desktop/node_template (copy1)/public/8264027636.jpeg'));
// const isImage = require('is-image');

// console.log(isImage('/home/tk-lpt-739/Desktop/node_template (copy1)/public/8264027636.jpeg');