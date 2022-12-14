const jwt = require("jsonwebtoken");
const httpCodes = require("../constants/httpCodes");

const config = process.env;

const verifyToken = async (req, res, next) => {
  let body = req.body;
  const token = body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(httpCodes.UNAUTHORIZED)
      .send("A token is required for authentication");
  }
  try {
    const decoded = await jwt.verify(token, config.TOKEN_KEY);
    req.user_id = decoded.user_id;
    req.decodedregNo = decoded.regNo;
  } catch (err) {
    return res.status(httpCodes.UNAUTHORIZED).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
