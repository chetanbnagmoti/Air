const Flights = require("../Models/flights");

const addFlight = async (req, res) => {
  try {
    const {
      source,
      destination,
      travelDate,
      arrivalTime,
      departureTime,
      price,
      availableSeats,
    } = req.body;

    const newFlight = new Flights({
      source,
      destination,
      travelDate,
      arrivalTime,
      departureTime,
      price,
      availableSeats,
    });
    console.log("newFlight =========>", newFlight);
    const save = await newFlight.save();

    return res
      .status(201)
      .json({ message: "Flight Added Succeffully !!", data: save });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((error) => ({
        field: error.path,
        message: error.message,
      }));

      return res.status(400).json({
        message: "Flight validation failed",
        errors: errors,
      });
    }
    console.log("Something went wrong ====>", error);
  }
};

// Service method to fetch all flights:-
const getFlights = async (req, res) => {
  try {
    const flights = await Flights.getAllFlights();
    return res.status(200).json(flights);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getFlightsSecond = async (req, res) => {
  try {
    console.log("Filter data:", req.body);
    const { searchValue, filterFlights, sortConfig } = req.body;

    // Build the MongoDB query
    let query = {};

    // Search based on source and destination
    if (searchValue && searchValue.source && searchValue.destination) {
      query.$and = [
        { source: { $regex: new RegExp(searchValue.source, "i") } }, // case-insensitive
        { destination: { $regex: new RegExp(searchValue.destination, "i") } }, // case-insensitive
      ];
    }

    // Add filters for price and available seats
    if (filterFlights) {
      if (filterFlights.price) {
        query.price = { $lte: Number(filterFlights.price) }; // Price less than or equal to
      }
      if (filterFlights.seats) {
        query.availableSeats = { $gte: Number(filterFlights.seats) }; // Seats greater than or equal to
      }
    }

    // Define sort order
    let sort = {};
    if (sortConfig && sortConfig.key && sortConfig.direction) {
      sort[sortConfig.key] = sortConfig.direction === "asc" ? 1 : -1; // 1 for ascending, -1 for descending
    }

    // Fetch flights from MongoDB using the query and sort
    const data = await Flights.find(query).sort(sort);

    // Return the filtered and sorted flight data
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// const getFlightsSecond = async (req, res) => {
//   try {
//     console.log("Filter data:", req.body);
//     const { searchValue, filterFlights, sortConfig } = req.body;

//     // Get all flights
//     let data = await Flights.getAllFlights();

//     // Apply searchValue filter (source and destination)
//     if (searchValue && searchValue.source && searchValue.destination) {
//       data = data.filter(
//         (flight) =>
//           flight.source.toLowerCase() === searchValue.source.toLowerCase() &&
//           flight.destination.toLowerCase() ===
//             searchValue.destination.toLowerCase()
//       );
//     }

//     // Apply filterFlights filter (price and seats)
//     if (filterFlights) {
//       if (filterFlights.price) {
//         data = data.filter(
//           (flight) => flight.price <= Number(filterFlights.price)
//         );
//       }
//       console.log(data);
//       if (filterFlights.seats) {
//         data = data.filter(
//           (flight) => flight.availableSeats >= Number(filterFlights.seats)
//         );
//       }
//     }

//     // Apply sortConfig sorting
//     if (sortConfig && sortConfig.key && sortConfig.direction) {
//       data.sort((a, b) => {
//         const aValue = a[sortConfig.key];
//         const bValue = b[sortConfig.key];

//         if (sortConfig.direction === "asc") {
//           return aValue > bValue ? 1 : -1;
//         } else if (sortConfig.direction === "desc") {
//           return aValue < bValue ? 1 : -1;
//         }
//       });
//     }

//     // Return the filtered and sorted flight data
//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

//Find Flight:-
const getFlight = async (req, res) => {
  try {
    const id = req.params.flightId;

    const data = await Flights.getFlight(id);

    if (!data) {
      return res.status(404).json({ message: "Flight not found!" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Find Flights according to sourc,destination,date:-
const getFlightAccodingToSource = async (req, res) => {
  try {
    const query = req.query;
    console.log(query);
    const findFlights = await Flights.find(query);
    res.status(200).json(findFlights);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Service method to remove flight from database:-
const deleteFlight = async (req, res) => {
  try {
    const flightData = req.body;
    const id = req.params.flightId;

    if (!id) {
      return res.status(400).json({ message: "Flight ID is required!" });
    }

    const deleteFlight = await Flights.findByIdAndDelete(id);

    if (!deleteFlight) {
      return res.status(404).json({ message: "Flight not found!" });
    }

    return res.status(200).json({ message: "Flight Delete Successfuly!" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Service method to make changes in an existing flight:-
const updateFlight = async (req, res) => {
  try {
    const flightData = req.body;
    const id = req.params.flightId;

    if (!id) {
      return res.status(400).json({ message: "Flight ID is required!" });
    }

    const updatedFlight = await Flights.findByIdAndUpdate(id, flightData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFlight) {
      return res.status(404).json({ message: "Flight not found!" });
    }

    return res
      .status(200)
      .json({ message: "Flight updated successfully!", data: updatedFlight });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  addFlight,
  getFlights,
  getFlight,
  getFlightAccodingToSource,
  deleteFlight,
  updateFlight,
  getFlightsSecond,
};
