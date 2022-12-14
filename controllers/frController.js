let frValidator = require("../validators/frValidator");
let frServices = require("../services/frServices");
const jwt = require("jsonwebtoken");
const httpCodes = require("../constants/httpCodes");
const fr = require("../model/fr");
const fs = require("fs");

exports.loginUser = async (req, res) => {
  const body = req.body;
  console.log("Body : ", body);
  const { userName, password } = body;
  try {
    const validated = await frValidator.validate(userName, password);
    if (validated.code === httpCodes.OK) {
      // Create token
      const token = await jwt.sign(
        { user_id: validated.msg._id, userName },
        process.env.TOKEN_KEY,
        {
          expiresIn: String(300 * 10000),
        }
      );
      // save user token
      validated.msg.token = token;
      let user = await fr.findOne({ userName });
      user.token = token;
      //console.log(validated.msg);

      const imageContent = fs.readFileSync(
        validated.msg.baseURL + validated.msg.imageName,
        { encoding: "base64" }
      );
      console.log("logged in successfully");

      return res.status(validated.code).send({
        userName: validated.msg.userName,
        token: validated.msg.token,
        imageData: imageContent,
      });
    } else {
      console.log("log in failed");

      return res.status(validated.code).send(validated.msg);
    }
  } catch (err) {
    return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

exports.createUser = async (req, res) => {
  let body = req.body;
  try {
    let field = await frValidator.fieldcheckUser(body);
    if (field.code !== httpCodes.OK) {
      return res.status(field.code).send(field.msg);
    }
    const duplicate = await frValidator.duplicateUser(body.userName);
    if (duplicate.code !== httpCodes.OK) {
      return res.status(duplicate.code).send(duplicate.msg);
    }
    const addUser = await frServices.addnewUser(req);
    return res.status(addUser.code).send(addUser.msg);
  } catch (err) {
    return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

exports.deleteStudent = async (req, res) => {
  // console.log("token verified");
  try {
    const regNo = req.params["regNo"];
    const findStudent = await Student.findOne({ regNo });

    // if (findStudent === null) {
    //   return res
    //     .status(httpCodes.BAD_REQUEST)
    //     .send("Student with this regNo doesn't exist!");
    // }

    // console.log("Student to be deleted ======>\n ",findStudent)

    const studentDeleted = await studentServices.deleteStudent(regNo);

    return res.status(studentDeleted.code).send(studentDeleted.msg);
  } catch (err) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Error occured in deleting user!" + err
    );
  }
};

exports.getstudentData = async (req, res) => {
  try {
    let { page = 1, size = 10 } = req.query;
    //console.log("page:",page, "size", size);
    // If the page is not applied in query.

    if (page < 1) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send("page must be greater than 0");
    }
    //  We have to make it integer becausehttps://github.com/MuhammadNafyKhan/node_template_copy1.githttps://github.com/MuhammadNafyKhan/node_template_copy1.git
    // query parameter passed is string
    const limit = parseInt(size);

    const student = await Student.find()
      .sort({ regNo: "asc" })
      .skip((page - 1) * size)
      .limit(size);

    return res.status(httpCodes.OK).send({
      page,
      size,
      Data: student,
      msg: "Student Data Sent Successfully!",
    });
  } catch (err) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Error occured in retrieving users data!" + err
    );
  }
};

exports.recognizeUser = async (req, res) => {
  console.log("token verified!");
  try {
    let field = await frValidator.fieldcheckrecognizeUser(req);
    if (field.code !== httpCodes.OK) {
      return res.status(field.code).send(field.msg);
    }


    let userName = req.userName; //imageData
    let userid = req.user_id; //imageData
    let user = await frServices.findUser(userName);
    ref_img = user.baseURL + user.imageName;

    targetimgPath =
      "/home/tk-lpt-739/Desktop/node_template_copy1/temp/trg_img.jpeg";

    let saveimgResponse = await frServices.saveImg(
      req.body.imageData,
      targetimgPath
    );

    if (saveimgResponse.code === httpCodes.OK) {
      console.log("saving image success");
      return res.status(httpCodes.OK).send("recognized user!");
    }
    console.log("saving image failed");
    return res.status(saveimgResponse.code).send(saveimgResponse.msg);
  } catch (err) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Error occured in deleting user!" + err
    );
  }
};
