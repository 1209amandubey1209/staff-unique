const User = require("../models/User.js");

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password from response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error, unable to fetch users." });
  }
};

// Controller to fetch logged-in employee details
const getEmployeeDetails = async (req, res) => {
    try {
        const employee = await User.findById(req.user.id).select("-password");

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error("Error fetching employee details:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllUsers,getEmployeeDetails };
