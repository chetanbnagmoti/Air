const express = require("express");
const route = express.Router();
const tickectController = require("../Controllers/tickect");

route.post("/", tickectController.generateTicket);

module.exports = route;
