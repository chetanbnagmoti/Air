const express = require("express");
const route = express.Router();
const userController = require("../Controllers/users");

route.post("/register", userController.register);
route.post("/login", userController.login);

module.exports = route;
