const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ✅ REGISTER NEW USER
exports.registerUser = async (req, res) => {
    const { userId, name, email, password, role, department, status, leaveBalance, workingDays, salary } = req.body;

    try {
        // 🔹 Check if all required fields are provided
        if (!userId || !name || !email || !password || !role || !department || !salary) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // 🔹 Check if user already exists
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // 🔹 Create new user instance (password will be hashed automatically in the model)
        const user = new User({
            userId,
            name,
            email,
            password,
            role,
            department,
            status: status || "Active",
            leaveBalance: leaveBalance || 10,
            workingDays: workingDays || 22,
            salary,
        });

        await user.save();

        // 🔹 Generate JWT Token
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                
                _id: user._id,
                userId,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                status: user.status,
                leaveBalance: user.leaveBalance,
                workingDays: user.workingDays,
                salary: user.salary,
            },
            token
        });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ✅ LOGIN USER
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔹 Validate request
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        // 🔹 Find user by email and include password for comparison
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // 🔹 Check if entered password matches hashed password
        const isMatch = await user.matchPassword(password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // 🔹 Generate JWT Token
        const token = user.getSignedJwtToken();

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
