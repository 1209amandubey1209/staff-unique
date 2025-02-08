const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const attendanceRoutes = require("./routes/attendanceRoutes.js")

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(express.json({limit:"100mb"}));
app.use(express.urlencoded({limit:"10mb",extended:true}));
app.use(cors({origin:"*", credentials: true}));

app.use(morgan("dev"));

// Routes
app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/auth", require("./routes/authRoutes"));
// Use the attendance routes
app.use("/api/attendance", attendanceRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
