const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  bid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
  ticketNumber: {
    type: String,
    required: [true, "TicketNumber is required"],
  },
  total_pay: {
    type: Number,
    default: 0,
    required: [true, "Total Payment is required"],
  },
  booking_date: {
    type: String,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
