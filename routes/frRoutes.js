const express = require("express");
const router = express.Router();
frController = require("../controllers/frController");
let authorize = require("../middlewares/auth");
let authorize_delete = require("../middlewares/authdelete");


router.post("/create", frController.createUser);
router.post("/update", authorize, frController.updateUser);
router.post("/login", frController.loginUser);
router.post("/recognize", authorize, frController.recognizeUser);
// router.delete("/delete/:regNo",authorize_delete, studentController.deleteStudent);
// router.post("/update", authorize, studentController.updateStudent);


module.exports = router;
