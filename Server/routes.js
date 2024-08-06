const express = require('express');
const router = express.Router();
const { UserModal } = require('./models/User'); // Assuming User.js is renamed to User.js and exports UserModal
const bcrypt = require('bcrypt');

// POST /createUser - Create a new user
router.post("/createUser", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Check if the user already exists
    const existingUser = await UserModal.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hashing the password when signing up
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating a new user
    const newUser = new UserModal({ 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      password: hashedPassword 
    });

    // Saving the user to the database
    await newUser.save();

    // Responding with the user data (excluding password)
    res.status(201).json({ 
      message: "User created successfully", 
      user: { 
        firstName: newUser.firstName, 
        lastName: newUser.lastName, 
        email: newUser.email, 
        phoneNumber: newUser.phoneNumber 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
