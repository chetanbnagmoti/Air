const express = require("express");
const router = express.Router();
const flightsController = require("../Controllers/flights");

router.get(
  "/getFlightAccodingToSource",
  flightsController.getFlightAccodingToSource
);

router.post("/getFlightsSecond", flightsController.getFlightsSecond);

router
  .route("/")
  .post(flightsController.addFlight)
  .get(flightsController.getFlights);

router
  .route("/:flightId")
  .delete(flightsController.deleteFlight)
  .put(flightsController.updateFlight)
  .get(flightsController.getFlight);

module.exports = router;
