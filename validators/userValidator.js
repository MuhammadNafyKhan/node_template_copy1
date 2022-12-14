let Response = require("../helper/responseClass");
const User = require("../model/user");
const httpCodes = require("../constants/httpCodes");
let emailValidator = require("email-validator");
const bcrypt = require("bcryptjs");

// user input-field check {first-name not provided or it's length is less than 8 }
// email format is not correct || password length less than 8
exports.fieldCheck = async (body) => {
  const { first_name, last_name, email, password } = body;

  if (first_name === undefined) {
    return new Response(httpCodes.BAD_REQUEST, "first-name not provided");
  } else if (last_name === undefined) {
    return new Response(httpCodes.BAD_REQUEST, "last-name not provided");
  } else if (email === undefined) {
    return new Response(httpCodes.BAD_REQUEST, "email not provided");
  } else if (password === undefined) {
    return new Response(httpCodes.BAD_REQUEST, "password not provided");
  } else if (first_name.length < 8) {
    return new Response(
      httpCodes.BAD_REQUEST,
      "first-name length is less than 8"
    );
  } else if (last_name.length < 8) {
    return new Response(
      httpCodes.BAD_REQUEST,
      "last-name length is less than 8"
    );
  } else if (email.length < 8) {
    return new Response(httpCodes.BAD_REQUEST, "email format is wrong");
  } else if (password.length < 8) {
    return new Response(
      httpCodes.BAD_REQUEST,
      "password length is less than 8"
    );
  } else {
    const validEmail = await emailValidator.validate(email);
    if (validEmail) return new Response(httpCodes.OK, "fieldcheck is ok!");
    return new Response(httpCodes.BAD_REQUEST, "Please provide valid email !");
  }
};

// Validate if user exist in our database
exports.duplicateUser = async (body) => {
  const { email } = body;
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser === null) {
      return new Response(httpCodes.OK, "no existing user found");
    }
    return new Response(
      httpCodes.BAD_REQUEST,
      "already user exists with this email"
    );
  } catch (err) {
    return new Response(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Internal Server Error occured while finding user!"
    );
  }
};

exports.validate = async (body) => {
  const { email, password } = body;

  try {
    if (email !== undefined) {
      const validEmail = await emailValidator.validate(email);
      if (!validEmail)
        return new Response(
          httpCodes.BAD_REQUEST,
          "Email format is incorrect!"
        );
    }

    if (!(email && password)) {
      return new Response(
        httpCodes.BAD_REQUEST,
        "Either email or password is missing!"
      );
    }

    const findUser = await User.findOne({ email });

    if (findUser === null) {
      return new Response(
        httpCodes.BAD_REQUEST,
        "User with this email doesn't exist! Kindly Register first"
      );
    }
    comparePassword = await bcrypt.compare(password, findUser.password);

    if (comparePassword) {
      return new Response(httpCodes.OK, findUser);
    }
    res.status(httpCodes.BAD_REQUEST).send("invalid credentials!");
  } catch (err) {
    return new Response(httpCodes.BAD_REQUEST, "Wrong Password!\n" + err);
  }
};
