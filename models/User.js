const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    userId:{
      type:String,
      required:true,
      unique:true
    },
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 6,
      select: false, // Exclude password from queries
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    department: {
      type: String,
      required: [true, "Please enter a department"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    leaveBalance: {
      type: Number,
      default: 10, // Default leave balance
    },
    workingDays: {
      type: Number,
      default: 22, // Default working days
    },
    salary: {
      type: String,
      required: [true, "Please enter salary details"],
    },
  },
  { timestamps: true } // Automatically add createdAt & updatedAt
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate JWT Token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Match user-entered password with hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
