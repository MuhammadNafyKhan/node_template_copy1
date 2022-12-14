const bcrypt = require("bcryptjs");
const User = require("../model/user");
let response = require("../helper/responseClass");
const httpCodes = require("../constants/httpCodes");

exports.addnewUser = async (req) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    //console.log("Password envrypted successfully!");
    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // return new user
    return new response(
      httpCodes.OK,
      "user added successfully! Details are 👇👇 listed below\n\n" + user
    );
  } catch (err) {
    return new response(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Internal server error occured while (adding user || encrypting password) !\n" +
        err
    );
  }
};
