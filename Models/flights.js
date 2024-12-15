const mongoose = require("mongoose");

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      unique: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    travelDate: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 100,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 1,
      max: 250,
      default: 1,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate a unique flight number
FlightSchema.pre("save", async function (next) {
  console.log("inserting in pre save method");
  const flight = this;
  let flightNumber = "";
  let isUnique = false;

  while (!isUnique) {
    flightNumber = Math.floor(10000 + Math.random() * 90000).toString();

    const isExistFightNumber = await mongoose.models.Flight.findOne({
      flightNumber,
    });

    if (!isExistFightNumber) {
      isUnique = true;
    }
  }

  flight.flightNumber = flightNumber;
  next();
});

// Static method to get all flights
FlightSchema.statics.getAllFlights = function () {
  return this.find({});
};

// Static method to get flight
FlightSchema.statics.getFlight = function (id) {
  return this.findById(id);
};

const flights = mongoose.model("Flight", FlightSchema);

module.exports = flights;
