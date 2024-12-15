const express = require("express");
const cors = require("cors");
const connectionDb = require("./Connection/db");
const usersRoutes = require("./Routes/users");
const flightsRoutes = require("./Routes/flights");
const bookingRoutes = require("./Routes/booking");
const tickectRoutes = require("./Routes/tickets");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

//Connection DB:-
connectionDb(process.env.DB_URL)
  .then(() => {
    console.log("Data Base Connected !!");
  })
  .catch((rejecct) => {
    console.log("Something Went Wrong =====>", rejecct);
  });

//Middleware:-
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes:-
app.use("/", usersRoutes);
app.use("/flight", flightsRoutes);
app.use("/booking", bookingRoutes);
app.use("/ticket", tickectRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port -", PORT);
});
