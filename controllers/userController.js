let userValidator = require("../validators/userValidator");
let userServices = require("../services/userServices");
const jwt = require("jsonwebtoken");
const httpCodes = require("../constants/httpCodes");
const User = require("../model/user");

exports.loginStudent = async (req, res) => {
  const body = req.body;
  const { email } = body;
  try {
    validated = await userValidator.validate(body);
    if (validated.code === httpCodes.OK) {
      // Create token
      const token = await jwt.sign(
        { user_id: validated.msg._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "30000",
        }
      );
      // save user token
      validated.msg.token = token;
      //console.log(validated.msg);
      // user
      return res
        .status(validated.code)
        .send({ email: validated.msg.email, token: validated.msg.token });
    } else {
      return res.status(validated.code).send(validated.msg);
    }
  } catch (err) {
    return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

exports.registerStudent = async (req, res) => {
  let body = req.body;
  try {
    let field = await userValidator.fieldCheck(body);
    if (field.code !== httpCodes.OK) {
      return res.status(field.code).send(field.msg);
    }

    const duplicate = await userValidator.duplicateUser(body);
    if (duplicate.code !== httpCodes.OK) {
      return res.status(duplicate.code).send(duplicate.msg);
    }

    const addUser = await userServices.addnewUser(req);
    return res.status(addUser.code).send(addUser.msg);
  } catch (err) {
    return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

exports.deleteStudent = async (req, res) => {
  console.log("token verified");
  try {
    const inputToken =
      req.body.token || req.query.token || req.headers["x-access-token"];

    await User.deleteOne({ email: req.email });
    console.log("user deleted");
    return res.status(httpCodes.OK).send("User Deleted Successfully!");
  } catch (err) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Error occured in deleting user!" + err
    );
  }
};

exports.getstudentRecord = async (req, res) => {
  try {
    let { page, size, sort } = req.query;
    console.log(page, " ", size, " ", sort);
    // If the page is not applied in query.
    if (!page) {
      // Make the Default value one.
      page = 1;
    }

    if (!size) {
      size = 2;
    }
    //  We have to make it integer because
    // query parameter passed is string
    const limit = parseInt(size);
    // We pass 1 for sorting data in
    // ascending order using ids
    const user = await User.find().sort({ votes: 1, _id: 1 }).limit(limit);

    return res
      .status(httpCodes.OK)
      .send({ page, size, Info: user, msg: "User Deleted Successfully!" });
  } catch (err) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Error occured in retrieving users data!" + err
    );
  }
};
