const express = require("express");

const controller = require("../controller/SignupController");
const auth = require("../middleware/Auth");

const routes = express.Router();

routes.post("/signup", controller.signupPost);

routes.post("/login", controller.loginPost);

routes.post("/user-info", auth.authorized, controller.updateUserData);

module.exports = routes;
