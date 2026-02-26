require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const accountRoutes = require("./routes/accountRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const rawClientUrl = process.env.CLIENT_URL || "";
const allowedOrigins = rawClientUrl
  .split(",")
  .map((url) => url.trim().replace(/^"+|"+$/g, ""))
  .filter(Boolean);

const defaultDevOrigins = ["http://localhost:5173", "http://localhost:5175"];
const corsOrigins = allowedOrigins.length ? allowedOrigins : defaultDevOrigins;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

app.use("/api", accountRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
