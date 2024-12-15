const Users = require("../Models/users");
const bcrypt = require("bcrypt");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, fname, email, password, phone } = req.body;

    const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_KEY));
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new Users({
      username,
      fname,
      email,
      password: hashPassword,
      phone,
    });

    await newUser.save();

    return res.status(201).json({ message: "User Created" });
  } catch (error) {
    if (error.code === 11000) {
      const keyValue = Object.entries(error.keyValue).map(
        ([key, value]) =>
          `This ${
            key.charAt(0).toUpperCase() + key.slice(1)
          }:${value} is alredy present ! `
      );
      return res.status(409).json({ message: `${keyValue}` });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((error) => ({
        field: error.path,
        message: error.message,
      }));

      return res.status(400).json({
        message: "User validation failed",
        errors: errors,
      });
    }
    console.log("Something went wrong ====>", error);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "UserName or Password Is Required !!" });
    }

    const checkUser = await Users.findOne({ username: username }).lean();

    if (!checkUser) {
      return res.status(403).json({ message: "UserName Not Found !!" });
    }

    const hashPassword = checkUser.password;
    const checkPassword = await bcrypt.compare(password, hashPassword);

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    delete checkUser.password;

    return res
      .status(200)
      .json({ message: "Login User Successfully !!", data: checkUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
};
