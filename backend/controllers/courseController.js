const Course = require("../models/course");
const jwt = require("jsonwebtoken");

// Get all courses with enhanced search functionality
exports.getAllCourses = async (req, res) => {
  try {
    let queryObj = {}; // Object to store filters

    // Unified search across title, subject (major), and instructor
    if (req.query.search) {
      queryObj.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { subject: { $regex: req.query.search, $options: "i" } },
        { instructor: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Filtering by price range
    if (req.query.price) {
      const priceFilter = {};
      if (req.query.price.lte) priceFilter.$lte = Number(req.query.price.lte);
      queryObj.price = priceFilter;
    }

    // Filtering by subject (major)
    if (req.query.major) {
      queryObj.subject = { $regex: req.query.major, $options: "i" }; // Case-insensitive search
    }

    // Filtering by rating (minimum rating)
    if (req.query.rating) {
      const minRating = Number(req.query.rating.gte);
      if (!isNaN(minRating) && minRating >= 1 && minRating <= 5) {
        queryObj.rating = { $gte: minRating };
      }
    }

    // Fetch courses based on filters
    const courses = await Course.find(queryObj);
    console.log(courses);
    console.log("hi");

    res.status(200).json({
      status: "success",
      results: courses.length,
      data: {
        courses,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Extract and validate data from request body
    const {
      title,
      subtitles,
      price,
      summary,
      hours,
      major,
      subject,
      previewVideo,
    } = req.body;

    const token = req.headers.authorization?.split(" ")[1]; // Extract token after "Bearer"
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const instructor = decoded.id;

    // Convert price to number
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        status: "error",
        message: "Price must be a valid positive number.",
      });
    }

    // Ensure subtitles is an array and transform each subtitle
    const validatedSubtitles = Array.isArray(subtitles)
      ? subtitles.map((subtitle) => ({
          title: subtitle, // Assuming each subtitle is just a string
        }))
      : [];

    // Create a new course object
    const newCourse = {
      title,
      subtitles: validatedSubtitles,
      price: numericPrice,
      summary,
      hours: hours,
      major: major,
      instructor: instructor,
      subject,
      previewVideo: previewVideo,
    };

    // Save to database
    const course = await Course.create(newCourse);

    res.status(201).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Failed to create course",
      error: error.message,
    });
  }
};

exports.getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course (reviews will be automatically populated)
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ status: "fail", message: "Course not found" });
    }

    res.json({
      status: "success",
      data: {
        courseTitle: course.title,
        courseRating: course.rating,
        reviews: course.reviews, // Already populated!
      },
    });
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ status: "fail", message: "Course not found" });
    }

    res.status(200).json({ status: "success", data: { course } });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
