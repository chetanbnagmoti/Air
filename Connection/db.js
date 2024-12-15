const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://127.0.0.1:27017/practice_node")
//   .then((res) => {
//     console.log("Data Base is connected");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const connectionDb = async (url) => {
  return mongoose.connect(url);
};

module.exports = connectionDb;
