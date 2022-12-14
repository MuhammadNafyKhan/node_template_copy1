let studentValidator = require("../validators/studentValidator");
let studentServices = require("../services/studentServices");
const jwt = require("jsonwebtoken");
const httpCodes = require("../constants/httpCodes");
const Student = require("../model/student");

exports.loginStudent = async (req, res) => {
  const body = req.body;
  console.log(body);
  const { regNo, password } = body;
  try {
    const validated = await studentValidator.validate(regNo, password);
    if (validated.code === httpCodes.OK) {
      // Create token
      const token = await jwt.sign(
        { user_id: validated.msg._id, regNo },
        process.env.TOKEN_KEY,
        {
          expiresIn: "99000",
        }
      );
      // save user token
      validated.msg.token = token;
      let stdnt = await Student.findOne({regNo});
      stdnt.token = token;
      //console.log(validated.msg);
      // user
      return res
        .status(validated.code)
        .send({ regNo: validated.msg.regNo, token: validated.msg.token });
    } else {
      return res.status(validated.code).send(validated.msg);
    }
  } catch (err) {
    return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

exports.createStudent = async (req, res) => {
  let body = req.body;
  try {
    let field = await studentValidator.fieldcheckStudent(body);
    if (field.code !== httpCodes.OK) {
      return res.status(field.code).send(field.msg);
    }

    const duplicate = await studentValidator.duplicateStudent(body.regNo);
    if (duplicate.code !== httpCodes.OK) {
      return res.status(duplicate.code).send(duplicate.msg);
    }

    const addUser = await studentServices.addnewStudent(req);
    return res.status(addUser.code).send(addUser.msg);
  } catch (err) {
    return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

exports.deleteStudent = async (req, res) => {
  // console.log("token verified");
  try {

    const regNo=req.params['regNo']
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
    let { page=1, size=10 } = req.query;
    //console.log("page:",page, "size", size);
    // If the page is not applied in query.

    if (page < 1) {
      return res.status(httpCodes.BAD_REQUEST).send("page must be greater than 0");
    }
    //  We have to make it integer because
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

exports.updateStudent = async (req, res) => {
  console.log("token verified!");
  try {
    // const inputToken =
    //   req.body.token || req.query.token || req.headers["x-access-token"];
    // //regNo = req.regNo;
    regNumber = req.body.regNo
    const { fName, lName, regNo, gender, password } = req.body;

    if (fName !== undefined && fName.length < 8) {
      return res.status(httpCodes.BAD_REQUEST).send("fName length < 8");
    }
    if (lName !== undefined && lName.length < 4) {
      return res.status(httpCodes.BAD_REQUEST).send("lName length < 4");
    }
    if (gender !== undefined && gender !== "male" && gender !== "female") {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send("gender must be either 'male' or 'female' ");
    }
    if (password !== undefined && password.length < 8) {
      return res.status(httpCodes.BAD_REQUEST).send("password length < 8");
    }
    if (regNo !== undefined && regNo.length < 8) {
      return res.status(httpCodes.BAD_REQUEST).send("regNo length < 8");
    }
    if (fName !== undefined) {
      regNumber = req.decodedregNo;
      var newvalues = { $set: { fName } };
      await Student.updateOne({ regNo:regNumber }, newvalues);
    }

    if (lName !== undefined) {
      regNumber = req.decodedregNo;
      var newvalues = { $set: { lName } };
      await Student.updateOne({ regNo:regNumber }, newvalues);
    }
    if (gender !== undefined) {
      regNumber = req.decodedregNo;
      var newvalues = { $set: { gender } };
      await Student.updateOne({ regNo:regNumber }, newvalues);
    }
    if (password !== undefined) {
      regNumber = req.decodedregNo;
      var newvalues = { $set: { password } };
      await Student.updateOne({ regNo:regNumber }, newvalues);
    }
    if (regNo !== undefined) {
      regNumber = req.decodedregNo;
      var newvalues = { $set: { regNo } };
      await Student.updateOne({ regNo:regNumber }, newvalues);
    }

    return res.status(httpCodes.OK).send("User updated Successfully!");
  } catch (err) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR,
      "Error occured in deleting user!" + err
    );
  }
};
