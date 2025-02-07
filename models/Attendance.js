const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to the User model
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    selfie: {
      type: String,  // Store URL of the selfie image
      required: true,
    },
  },
  { timestamps: true }
);

// Geospatial Index for location (for query optimization)
attendanceSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Attendance", attendanceSchema);
