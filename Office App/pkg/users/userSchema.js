const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require ("bcryptjs");
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name is required"]
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address"]
      },
      role: {
        type: String,
        enum: ["user", "admin", "administrator"],
        default: "user"
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [4, "Password must be at least 8 characters long"],
        validate: [validator.isStrongPassword, "Please provide a strong password"]
      },
      image: {
        type: String,
        default: "default-image.png"
      }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

module.exports = mongoose.model("User" , userSchema, "users");