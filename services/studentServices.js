const Student = require("../model/student");
let response = require("../helper/responseClass");
const httpCodes = require("../constants/httpCodes");
const bcrypt = require("bcryptjs");

exports.addnewStudent = async (req) => {
  const { fName, lName, regNo, gender, password } = req.body;
  encryptedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

  try {
    // Create user in our database
    const student = await Student.create({
      fName,
      lName,
      regNo,
      gender,
      password: encryptedPassword,
    });

    // return new user
    return new response(
      httpCodes.OK,
      "student added successfully! Details are 👇👇 listed below\n\n" + student
    );
  } catch (err) {
    return new response(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Internal server error occured while (adding user || encrypting password) !\n" +
        err
    );
  }
};

exports.deleteStudent = async (regNo) => {
  try {
    await Student.findOneAndDelete({ regNo });

    // return new user
    return new response(httpCodes.OK, "student deleted successfully!");
  } catch (err) {
    return new response(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Internal server error occured while (deleting user) !\n" + err
    );
  }
};
