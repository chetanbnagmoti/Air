const Booking = require("../Models/booking");
const Flights = require("../Models/flights");
const Ticket = require("../Models/tickets");

const generateTicket = async (req, res) => {
  try {
    const { bid } = req.body;

    const tickectWithBID = await Ticket.findById(bid);
    if (tickectWithBID) {
      return res
        .status(403)
        .json({ msg: "Alredy Ticket is genereted with this booking id" });
    }

    const booking_date = new Date().toISOString().split("T")[0];

    const bookingData = await Booking.findById({ _id: bid })
      .populate({
        path: "flightInfo",
        select: "price availableSeats",
      })
      .select("passengersInfo");
    let ticketNumber = "";
    for (let i = 0; i <= 5; i++) {
      let newNumber = Math.round(Math.random() * 10);
      ticketNumber += newNumber;
    }

    ticketNumber = "TK" + ticketNumber;

    const total_pay =
      bookingData.passengersInfo.length * bookingData.flightInfo.price;

    const newTicket = await Ticket.create({
      bid,
      ticketNumber,
      total_pay,
      booking_date,
    });

    await Booking.findByIdAndUpdate(
      bid,
      { $set: { paymentStatus: "SUCCESS", ticketInfo: newTicket._id } },
      { new: true }
    );

    const updatedAvailableSeats =
      bookingData.flightInfo.availableSeats - bookingData.passengersInfo.length;

    if (updatedAvailableSeats < 0) {
      return res
        .status(403)
        .json({ msg: "Not enough available seats for this booking" });
    }

    await Flights.findByIdAndUpdate(
      bookingData.flightInfo._id,
      {
        availableSeats: updatedAvailableSeats,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ msg: "New Ticket Genereted", data: newTicket });
  } catch (error) {
    return res.status(500).json("Something Went Wrong");
  }
};

module.exports = {
  generateTicket,
};
