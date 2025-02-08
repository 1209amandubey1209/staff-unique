const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware.js");
const { getAllUsers, getEmployeeDetails } = require("../controllers/userController.js");
getEmployeeDetails
const router = express.Router();

// Admin-only access to all users
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get("/me", protect, getEmployeeDetails)

module.exports = router;
