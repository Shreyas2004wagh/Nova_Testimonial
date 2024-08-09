const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("./models/User");
const { Space } = require("./models/Space");

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

    res.status(201).json({ message: "User signed up successfully", token, _id: newUser._id });
  } catch (error) {
    console.error("SignUp Error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const username = user.username;
    jwt.sign(
      { email: user.email, username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("Error signing JWT:", err);
          return res.status(500).json({ message: "Error generating token" });
        }
        res.status(200).json({ message: "Login successful", token, username, _id: user._id });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/addSpace', async (req, res) => {
  try {
    const { spacename, publicUrl, headerTitle, customMessage, questions, starRatings, user_Id } = req.body;

    if (!user_Id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if a space with the same publicUrl already exists
    const existingSpace = await Space.findOne({ publicUrl });
    if (existingSpace) {
      return res.status(400).json({ message: 'Public URL already exists' });
    }

    // Create a new space document
    const newSpace = new Space({
      spacename,
      publicUrl,
      headerTitle,
      customMessage,
      questions,
      starRatings,
      user_Id,
    });

    // Save the new space document to the database
    const savedSpace = await newSpace.save();
    const spaceLink = `http://localhost:5173/${publicUrl}`;
    // Send a success response
    res.status(201).json({
      message: "Space created successfully",
      space: savedSpace,
      link: spaceLink,
    });
  } catch (error) {
    console.error('Error creating space:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/getSpaces', async (req, res) => {
  try {
    const spaces = await Space.find();
    res.status(200).json(spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

router.get('/getSpacesByUserId/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const spaces = await Space.find({ user_Id: userId });
    if (!spaces.length) {
      return res.status(404).json({ message: 'No spaces found for this user' });
    }
    res.status(200).json(spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/space/:publicUrl", async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const space = await Space.findOne({ publicUrl });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    res.status(200).json(space);
  } catch (error) {
    console.error("Error fetching space:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/space/:publicUrl/feedback", async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const { name, email, responses } = req.body;

    const space = await Space.findOne({ publicUrl });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    // Create the feedback object
    const feedback = {
      name,
      email,
      responses: space.questions.map((question, index) => ({
        question,
        answer: responses[index] || "",
      })),
    };

    // Add feedback to the space
    space.feedback.push(feedback);
    await space.save();

    res
      .status(201)
      .json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/space/:publicUrl/feedbackDetails', async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const space = await Space.findOne({ publicUrl });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    // Extract the feedback array from the space document
    const feedbackDetails = space.feedback.map(fb => ({
      name: fb.name,
      email: fb.email,
      responses: fb.responses, // array of question-answer pairs
      submittedAt: fb.submittedAt, // includes submission date and time
    }));

    res.status(200).json(feedbackDetails);
  } catch (error) {
    console.error("Error fetching feedback details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;


 