const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.post("/register", userController.registerStudent);
router.post("/login", userController.loginStudent);
router.post("/delete", auth, userController.deleteStudent);
router.get("/get", userController.getstudentRecord);

// router.post("/login", userController.loginStudent);
// router.post("/welcome", userController.welcomeStudent);

module.exports = router;
