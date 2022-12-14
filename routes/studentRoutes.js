const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
let authorize = require("../middlewares/auth");
let authorize_delete = require("../middlewares/authdelete");

// router.post("/delete", auth, userController.deleteStudent);
router.get("/list", studentController.getstudentData);
router.post("/create", studentController.createStudent);
router.post("/login", studentController.loginStudent);
router.delete("/delete/:regNo",authorize_delete, studentController.deleteStudent);
router.post("/update", authorize, studentController.updateStudent);


module.exports = router;
