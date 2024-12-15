const mongoose = require("mongoose");

const passengersSchema = new mongoose.Schema({
  pname: {
    type: String,
  },
  age: {
    type: Number,
    min: [1, "Min Age is 1"],
    max: [120, "Max Age is 120"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
});

const bookingSchema = new mongoose.Schema({
  userInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  flightInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
  },
  ticketInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
  passengersInfo: {
    type: [passengersSchema],
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS"],
    default: "PENDING",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
