let Response = require("../helper/responseClass");
const Student = require("../model/student");
const httpCodes = require("../constants/httpCodes");
// let emailValidator = require("email-validator");
const bcrypt = require("bcryptjs");

// user input-field check {first-name not provided or it's length is less than 8 }
// email format is not correct || password length less than 8
exports.fieldcheckStudent = async (body) => {
  const { fName, lName, regNo, gender, password } = body;

  if (fName === undefined) {
    return new Response(httpCodes.BAD_REQUEST, "first-name not provided");
  } else if (lName === undefined) {
    return new Response(httpCodes.BAD_REQUEST, "last-name not provided");
  } else if (regNo === undefined) {
    return new Response(httpCodes.BAD_REQUEST, "regNo not provided");
  } else if (gender === undefined) {
    return new Response(httpCodes.BAD_REQUEST, "gender not provided");
  } else if (password === undefined) {
    return new Response(httpCodes.BAD_REQUEST, "password not provided");
  } else if (fName.length < 8) {
    return new Response(
      httpCodes.BAD_REQUEST,
      "first-name length is less than 8"
    );
  } else if (lName.length < 4) {
    return new Response(
      httpCodes.BAD_REQUEST,
      "last-name length is less than 8"
    );
  } else if (regNo.length < 8) {
    return new Response(
      httpCodes.BAD_REQUEST,
      "reg No is less than 8 characters"
    );
  } else if (gender != "male" && gender != "female") {
    return new Response(
      httpCodes.BAD_REQUEST,
      "gender is either male or female"
    );
  } else if (password.length < 8) {
    return new Response(httpCodes.BAD_REQUEST, "password length < 8");
  } else {
    return new Response(httpCodes.OK, "fieldcheck is ok!");
  }
};

// Validate if user exist in our database
exports.duplicateStudent = async (regNo) => {
  try {
    const oldUser = await Student.findOne({ regNo });
    if (oldUser === null) {
      return new Response(httpCodes.OK, "no existing user found");
    }
    return new Response(
      httpCodes.BAD_REQUEST,
      "already student exists with this regNo"
    );
  } catch (err) {
    return new Response(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Internal Server Error occured while finding student!"
    );
  }
};

exports.validate = async (regNo, password) => {
  try {
    if (!regNo && !password) {
      return new Response(
        httpCodes.BAD_REQUEST,
        "regNo and passwordis not provided"
      );
    }
    if (!regNo) {
      return new Response(httpCodes.BAD_REQUEST, "regNo is not provided");
    }
    if (!password) {
      return new Response(httpCodes.BAD_REQUEST, "password is not provided");
    }
    if (regNo.length < 8) {
      return new Response(
        httpCodes.BAD_REQUEST,
        "RegNo must be atleast 8 character!"
      );
    }
    if (password.length < 8) {
      return new Response(
        httpCodes.BAD_REQUEST,
        "Password must be atleast 8 character!"
      );
    }

    const findStudent = await Student.findOne({ regNo });

    if (findStudent === null) {
      return new Response(
        httpCodes.BAD_REQUEST,
        "Student with this regNo doesn't exist! Kindly Register first"
      );
    }
    comparePassword = await bcrypt.compare(password, findStudent.password);

    if (comparePassword) {
      return new Response(httpCodes.OK, findStudent);
    }
    return new Response(
      httpCodes.BAD_REQUEST,
      "password is incorrect, plaz try again!"
    );
  } catch (err) {
    return new Response(httpCodes.BAD_REQUEST, "some error occured!\n" + err);
  }
};
