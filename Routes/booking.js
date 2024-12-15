const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/booking");

router
  .route("/")
  .post(bookingController.addBookings)
  .put(bookingController.addPassengers);

router.route("/getBookingInfo").post(bookingController.getBookingInfo);

router.route("/getBookingHistory").post(bookingController.getBookingHistory);
router
  .route("/deleteBookingHistory")
  .post(bookingController.deleteBookingHistory);

module.exports = router;
