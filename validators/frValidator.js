let Response = require("../helper/responseClass");
const fr = require("../model/fr");
const httpCodes = require("../constants/httpCodes");
// let emailValidator = require("email-validator");
const bcrypt = require("bcryptjs");

// user input-field check {first-name not provided or it's length is less than 8 }
// email format is not correct || password length less than 8
exports.fieldcheckUser = async (body) => {
  const { userName, password, imageData } = body;

  if (!userName || !imageData || !password) {
    return new Response(httpCodes.BAD_REQUEST, "input missing");
  }

  if (userName.length < 6) {
    return new Response(
      httpCodes.BAD_REQUEST,
      "user-name length is less than 6"
    );
  } else if (password.length < 6) {
    return new Response(
      httpCodes.BAD_REQUEST,
      "password length is less than 6"
    );
  } else {
    return new Response(httpCodes.OK, "fieldcheck is ok!");
  }
};

// Validate if user exist in our database
exports.duplicateUser = async (userName) => {
  try {
    const oldUser = await fr.findOne({ userName });
    if (oldUser === null) {
      return new Response(httpCodes.OK, "no existing user found");
    }
    return new Response(
      httpCodes.BAD_REQUEST,
      "already student exists with this userName"
    );
  } catch (err) {
    return new Response(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Internal Server Error occured while finding student!"
    );
  }
};

exports.validate = async (userName, password) => {
  try {
    if (!userName && !password) {
      return new Response(
        httpCodes.BAD_REQUEST,
        "userName and password is not provided"
      );
    }
    if (!userName) {
      return new Response(httpCodes.BAD_REQUEST, "regNo is not provided");
    }
    if (!password) {
      return new Response(httpCodes.BAD_REQUEST, "password is not provided");
    }
    if (userName.length < 6) {
      return new Response(
        httpCodes.BAD_REQUEST,
        "RegNo must be atleast 8 character!"
      );
    }
    if (password.length < 6) {
      return new Response(
        httpCodes.BAD_REQUEST,
        "Password must be atleast 8 character!"
      );
    }

    const findUser = await fr.findOne({ userName });

    if (findUser === null) {
      return new Response(
        httpCodes.BAD_REQUEST,
        "User with this username doesn't exist! Kindly Register first"
      );
    }
    comparePassword = await bcrypt.compare(password, findUser.password);

    if (comparePassword) {
      return new Response(httpCodes.OK, findUser);
    }
    return new Response(
      httpCodes.BAD_REQUEST,
      "password is incorrect, plz try again!"
    );
  } catch (err) {
    return new Response(httpCodes.BAD_REQUEST, "some error occured!\n" + err);
  }
};

exports.fieldcheckrecognizeUser = async (req) => {
  const { imageData } = req.body;

  if (!imageData) {
    return new Response(httpCodes.BAD_REQUEST, "input missing");
  } else {
    return new Response(httpCodes.OK, "fieldcheck is ok!");
  }
};
