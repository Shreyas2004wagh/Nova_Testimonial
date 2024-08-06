const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("./models/User");

router.post("/SignUp", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNum } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNum) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      firstName,
      lastName,
      email,
      phoneNum,
      password: hashedPassword,
    });

    await newUser.save();
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET);

    res.status(201).json({ message: "User signed up successfully", token });
  } catch (error) {
    console.error("SignUp Error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } already exists`;
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
