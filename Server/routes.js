const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("./models/User");
const { Space } = require("./models/Space");
const upload = require("./utils/multer");
const cloudinary = require("./utils/cloudinary");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1h", // token expiration
    });

    res.status(201).json({
      message: "User signed up successfully",
      token,
      _id: newUser._id,
    });
  } catch (error) {
    console.error("SignUp Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
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

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, _id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add Space Route
router.post("/addSpace", upload.single("image"), async (req, res) => {
  try {
    const {
      spacename,
      publicUrl,
      headerTitle,
      customMessage,
      questions,
      starRatings,
      user_Id,
    } = req.body;

    if (!user_Id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const existingSpace = await Space.findOne({ publicUrl });
    if (existingSpace) {
      return res.status(400).json({ message: "Public URL already exists" });
    }

    // Upload image to Cloudinary
    let imgUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imgUrl = result.secure_url;
    }

    const newSpace = new Space({
      spacename,
      publicUrl,
      headerTitle,
      customMessage,
      questions,
      starRatings,
      user_Id,
      img: imgUrl, 
    });

    const savedSpace = await newSpace.save();
    const spaceLink = `http://localhost:5173/${publicUrl}`;

    console.log('Generated link:', spaceLink);

    res.status(201).json({
            message: "Space created successfully",
      space: savedSpace,
      link: spaceLink,
    });
  } catch (error) {
    console.error("Error creating space:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Get Spaces Route
router.get("/getSpaces", async (req, res) => {
  try {
    const spaces = await Space.find();
    res.status(200).json(spaces);
  } catch (error) {
    console.error("Error fetching spaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get Space by Public URL Route
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
    const { name, email, responses, feedbackType } = req.body;

    const space = await Space.findOne({ publicUrl });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const feedback = {
      name,
      email,
      responses: space.questions.map((question, index) => ({
        question,
        answer: responses[index] || "",
      })),
      feedbackType: feedbackType || "text",
    };

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


router.get("/space/:publicUrl/feedbackDetails", async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const space = await Space.findOne({ publicUrl });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const feedbackDetails = space.feedback.map((fb) => ({
      name: fb.name,
      email: fb.email,
      responses: fb.responses, 
      submittedAt: fb.submittedAt, 
    }));

    res.status(200).json(feedbackDetails);
  } catch (error) {
    console.error("Error fetching feedback details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/space/:publicUrl/feedbackCounts", async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const space = await Space.findOne({ publicUrl });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    // Log feedback to check structure
    console.log("Feedback data:", space.feedback);

    const textFeedbackCount = space.feedback.filter(
      (fb) => fb.feedbackType === "text"
    ).length;
    const videoFeedbackCount = space.feedback.filter(
      (fb) => fb.feedbackType === "video"
    ).length;

    // Log counts to verify
    console.log("Text Feedback Count:", textFeedbackCount);
    console.log("Video Feedback Count:", videoFeedbackCount);

    res.status(200).json({ textFeedbackCount, videoFeedbackCount });
  } catch (error) {
    console.error("Error fetching feedback counts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get All Users Route
router.get("/users", async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Get Specific User by ID Route
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

// Update User by ID Route
router.put("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await Users.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user data", error });
  }
});

router.post("/space/:publicUrl/addLink", async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const { link } = req.body;

    if (!link) {
      return res.status(400).json({ message: "Link is required" });
    }

    const space = await Space.findOne({ publicUrl });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    space.links.push(link); // Append the new link to the links array
    await space.save(); // Save the updated space document

    res.status(200).json({
      message: "Link added successfully",
      space,
    });
  } catch (error) {
    console.error("Error adding link to space:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Spaces by User ID Route
router.get("/getSpacesByUserId/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const spaces = await Space.find({ user_Id: userId });
    if (!spaces.length) {
      return res.status(404).json({ message: "No spaces found for this user" });
    }

    // Extract space names
    const spaceNames = spaces.map(space => space.spacename);

    // Set space names in a cookie
    res.cookie('spaceNames', JSON.stringify(spaceNames), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Send cookie over HTTPS only in production
      maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    });

    res.status(200).json(spaces);
  } catch (error) {
    console.error("Error fetching spaces:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/upload", upload.single("image"), function (req, res) {
  cloudinary.uploader.upload(req.file.path, function (err, result) {
    if (err) {
      console.log("Image cannot be uploaed:", err);
      return res.status(500).json({
        success: false,
        message: "Error uploading image",
      });
    }

    res.status(200).json({
      success: true,
      message: "Uploaded!",
      data: result,
    });
  });
});

router.post("/uploadVideo", upload.single("video"), function (req, res) {
  cloudinary.uploader.upload(
    req.file.path,
    { resource_type: "video" },
    function (err, result) {
      if (err) {
        console.log("Video cannot be uploaded:", err);
        return res.status(500).json({
          success: false,
          message: "Error uploading video",
        });
      }

      res.status(200).json({
        success: true,
        message: "Uploaded!",
        data: result,
      });
    }
  );
});

const transporter = nodemailer.createTransport({
  service: "gmail", // or another service
  auth: {
    user: process.env.EMAIL_SERVICE, // Ensure this is set in your environment
    pass: process.env.EMAIL_PASSWORD, // Ensure this is set in your environment
  },
});

// Forget Password Route
router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate if email is provided
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a 6-digit OTP and set expiration time (10 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP and expiration time in the user's document
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: {
        name: "Nova", // Customize this based on your application
        address: process.env.EMAIL_SERVICE,
      },
      to: email,
      subject: "OTP for password reset",
      text: `Your OTP for resetting the password is: ${otp}. This OTP is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending OTP email:", err);
        return res.status(500).json({ error: "Error sending OTP email" });
      }

      console.log("OTP email sent successfully");
      return res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (err) {
    console.error("Internal server error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
});

// Reset Password Route
router.put("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Log the inputs
    console.log("Email:", email);
    console.log("Received OTP:", otp);

    // Validate that email, OTP, and new password are provided
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, OTP, and new password are required" });
    }

    // Find the user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the stored OTP for comparison
    console.log("Stored OTP:", user.otp);

    // Validate the OTP (trim and lowercase to avoid format issues)
    if (user.otp.trim() !== otp.trim()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (Date.now() > user.otpExpiration) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Reset the password and clear OTP fields
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
});



module.exports = router;
 