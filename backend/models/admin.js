const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Admin must have a username"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Admin must have a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Hide password in queries
    },
  },
  { timestamps: true }
);

// 🔹 Hash password before saving & remove confirmPassword
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

adminSchema.methods.comparePassword = async function (
  enteredPassword,
  storedPassword
) {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
