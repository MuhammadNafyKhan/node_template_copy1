const userRoutes = require("../routes/userRoutes");
const studentRoutes = require("../routes/studentRoutes");
const frRoutes = require("../routes/frRoutes");
showRequest = (req, res, next) => {
  console.log("(" + req.method + "):", req.originalUrl);
  next();
};
module.exports = function (app) {
  app.use("/api/user", showRequest, userRoutes);
  app.use("/api/student", showRequest, studentRoutes);
  app.use("/api/fr/", showRequest, frRoutes);
};
