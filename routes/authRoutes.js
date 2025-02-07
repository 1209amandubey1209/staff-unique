const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
// Route to access user profile (protected for authenticated users)
router.get("/profile", protect, (req, res) => {
    res.json({ message: "Profile Access", user: req.user });
});

// Route to access admin page (protected for users with admin role)
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Admin Access Granted" });
});
module.exports = router;
