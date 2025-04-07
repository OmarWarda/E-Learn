const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "Course must have a title"],
  },
  subtitles: [
    {
      title: String,
      exercises: {
        type: Number,
        default: 0, // Assuming exercises are optional, give it a default value
      },
      totalHours: {
        type: Number,
        default: 0, // No requirement for totalHours, default to 0 if not provided
      },
    },
  ],
  totalHours: {
    type: Number,
  },
  price: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
  },
  subject: {
    type: String,
    required: [true, "Course must have a subject"],
  },
  summary: {
    type: String,
    required: [true, "Course must have a summary"],
  },
  rating: {
    type: Number,
    min: [1, "Rating cannot be less than 1"],
    max: [5, "Rating cannot be more than 5"],
    default: 1,
  },
  // Change from array to a single instructor reference
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: [true, "Course must have an instructor"],
  },
  previewVideo: { type: String, required: true }, // New field for YouTube link

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
        required: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Auto-populate reviewer field
courseSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "reviews.reviewer",
      select: "firstName lastName",
    },
    {
      path: "instructor", // Changed to singular instructor
      select: "fullName", // Populating the fullName of the instructor
    },
  ]);
  next();
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
