const express = require("express");
const dotenv = require("dotenv");
const Router = require("./routes");
const { connected, isConnected } = require('./Config/db');
const cors = require("cors");

dotenv.config(); // Load environment variables

const port = process.env.PORT || 3000;
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Route for checking database connection status
app.get("/", (req, res) => {
  try {
    res.json({
      database: isConnected() ? "connected" : "disconnected",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Mounting router
app.use(Router);

async function startServer() {
  try {
    await connected(); // Connect to the database
    app.listen(port, () => {
      console.log(`🚀 Server running on PORT: ${port}`);
    });
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;
