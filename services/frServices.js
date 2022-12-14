const fr = require("../model/fr");
let response = require("../helper/responseClass");
const httpCodes = require("../constants/httpCodes");
const bcrypt = require("bcryptjs");

exports.addnewUser = async (req) => {
  const { userName, password, imageData } = req.body;
  encryptedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
  var base64Data = imageData.replace(/^data:image\/jpeg;base64,/, "");
  var base64Data = await Buffer.from(base64Data, "base64");
  fileName =
    (Math.floor(Math.random() * 100000000000) + 1).toString() + ".jpeg";

  require("fs").writeFileSync(
    __dirname + "/../public/" + fileName,
    base64Data,
    "base64",
    function (err) {
      console.log(err);
    }
  );

  try {
    // Create user in our database
    const user = await fr.create({
      userName: userName,
      password: encryptedPassword,
      imageName: fileName,
      baseURL: "/home/tk-lpt-739/Desktop/node_template (copy1)/public/",
    });
    console.log("user added successfully");

    // return new user
    return new response(
      httpCodes.OK,
      "User added successfully! Details are 👇👇 listed below\n\n"
    );
  } catch (err) {
    return new response(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Internal server error occured while (adding user) !\n" + err
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

