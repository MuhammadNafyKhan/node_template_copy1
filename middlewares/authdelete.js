const jwt = require("jsonwebtoken");
const httpCodes = require("../constants/httpCodes");
const Student = require("../model/student");

const config = process.env;

const verifyToken = async (req, res, next) => {
  let body = req.body;
  const regNo = body.regNo || req.query.regNo || req.params['regNo'];
  if (!regNo) {
    return res
      .status(httpCodes.UNAUTHORIZED)
      .send("RegNo is required for authentication");
  }
  const stdnt = Student.findOne({regNo});
  if (stdnt === null) {
    return res
      .status(httpCodes.BAD_REQUEST)
      .send("Student with this regNo doesn't exist!");
  }

  try {
    const decoded = await jwt.verify(stdnt.token, config.TOKEN_KEY);
    console.log("token verified")
  } catch (err) {
    return res.status(httpCodes.UNAUTHORIZED).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
