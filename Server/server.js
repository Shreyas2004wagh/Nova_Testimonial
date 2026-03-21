const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Router = require("./routes.js");
const { isConnected, connected } = require("./db.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  try {
    res.json({
      database: isConnected() ? "connected" : "disconnected",
    });
  } catch (err) {
    console.log(err);
  }
});

app.use(Router);

if (require.main === module) {
  connected();
  app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
  });
}
