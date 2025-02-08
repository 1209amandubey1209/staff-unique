const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (verify token)
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Extract the token
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, token missing" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user without password
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ message: "Invalid token, authorization denied" });
    }
};

// Middleware for role-based access control
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. Requires roles: ${roles.join(", ")}` });
        }
        next();
    };
};
