const express = require("express");
const cors = require("cors"); // Add CORS support
const highlightsRoutes = require("./routes/highlights");
const dotenv = require("dotenv");

// Load environment variables from .env file if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON (must come before routes)
app.use(express.json());

// Enable CORS
app.use(cors());

// Register routes
app.use("/api", highlightsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
