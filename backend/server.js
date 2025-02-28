require("dotenv").config(); // Load environment variables early
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = ["http://localhost:5173", "http://example.com"]; // Add more allowed origins as needed

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" })); // Allow large payloads
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.get("/api/test",(req,res)=>{
  console.log("Test api");
  res.json({"hii":"Test api"});
});


app.use("/api/resumes", resumeRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
