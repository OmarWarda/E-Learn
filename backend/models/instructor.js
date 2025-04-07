const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const instructorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Instructor must have a username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false, // Do not return password in queries
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  country: {
    type: String,
  },
  biography: { type: String, required: false },
  fullName: { type: String, required: false },
  coursesGiven: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  rating: {
    type: Number,
    min: [1, "Rating cannot be less than 1"],
    max: [5, "Rating cannot be more than 5"],
    required: false,
  },
  reviews: [
    {
      reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "IndividualTrainee",
      },
      rating: {
        type: Number,
        min: [1, "Rating cannot be less than 1"],
        max: [5, "Rating cannot be more than 5"],
        required: true,
      },
      reviewText: {
        type: String,
        required: false, // Optional review text
      },
      date: {
        type: Date,
        default: Date.now, // Automatically set the review date
      },
    },
  ],
});

// **Encrypt Password before saving**
instructorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

instructorSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "reviews.reviewer",
      select: "firstName lastName",
    },
  ]);
  next();
});

instructorSchema.methods.comparePassword = async function (
  enteredPassword,
  storedPassword
) {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

const Instructor = mongoose.model("Instructor", instructorSchema);
module.exports = Instructor;
