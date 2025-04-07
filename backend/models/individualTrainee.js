const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const individualTraineeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  country: {
    type: String,
  },
  coursesTaken: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

// **Hash Password before saving**
individualTraineeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

individualTraineeSchema.methods.comparePassword = async function (
  enteredPassword,
  storedPassword
) {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

const IndividualTrainee = mongoose.model(
  "IndividualTrainee",
  individualTraineeSchema
);
module.exports = IndividualTrainee;
