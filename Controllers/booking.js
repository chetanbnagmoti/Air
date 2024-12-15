const Booking = require("../Models/booking");
const Flight = require("../Models/flights");
const User = require("../Models/users");

const addBookings = async (req, res) => {
  try {
    const { flightId, userId, numberOfSeatsToBook, bookingId } = req.body;
    const isAlredyBooking = await Booking.findById(bookingId);
    const isFlightFind = await Flight.findById(flightId);
    const isUserFind = await User.findById(userId);

    if (isAlredyBooking) {
      return res
        .status(200)
        .json({ msg: `Exit Booking Id`, data: { _id: bookingId } });
    }

    if (!isFlightFind) {
      return res.status(403).json({ msg: `Flight Not Found` });
    }

    if (isFlightFind.availableSeats <= numberOfSeatsToBook) {
      return res.status(403).json({
        msg: `AvailableSeats are Only ${isFlightFind.availableSeats}`,
      });
    }
    if (!isUserFind) {
      return res.status(403).json({ msg: "User Not Exit" });
    }
    const addBooking = await Booking.create({
      userInfo: userId,
      flightInfo: flightId,
    });

    return res
      .status(200)
      .json({ msg: "Booking Done Please Added Passengers", data: addBooking });
  } catch (error) {
    return res.status(200).json({ msg: "Something Went Wrong" });
  }
};

const getBookingInfo = async (req, res) => {
  try {
    const { bid } = req.body;
    const bookingData = await Booking.findById({ _id: bid })
      .populate("flightInfo")
      .populate("userInfo")
      .populate("ticketInfo");

    return res
      .status(200)
      .json({ msg: "Booking Information", data: bookingData });
  } catch (error) {
    return res.status(500).json({ msg: "Something Went Wrong" });
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    const bookingHistory = await Booking.find({
      userInfo: userId,
    })
      .populate("flightInfo")
      .populate("ticketInfo");

    return res
      .status(200)
      .json({ msg: "Booking History Of User", data: bookingHistory });
  } catch (error) {
    return res.status(500).json({ msg: "Something Went Wrong" });
  }
};

const deleteBookingHistory = async (req, res) => {
  try {
    const { bid } = req.body;
    const deleteBookingHitory = await Booking.findByIdAndDelete(bid);
    if (!deleteBookingHitory) {
      return res.status(403).json({ msg: "Booking Id Not Present" });
    }
    return res.status(200).json({ msg: "Booking Is Deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Something Went Wrong" });
  }
};

const addPassengers = async (req, res) => {
  try {
    const { passengersData, bid } = req.body;
    const updateBooking = await Booking.findByIdAndUpdate(
      { _id: bid },
      { $set: { passengersInfo: passengersData } },
      { new: true }
    );
    return res.status(200).json({
      msg: "Booking Updated With Passenger Details",
      data: updateBooking,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Something Went Wrong" });
  }
};

module.exports = {
  addBookings,
  getBookingInfo,
  addPassengers,
  getBookingHistory,
  deleteBookingHistory,
};
