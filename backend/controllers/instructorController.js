const Instructor = require("../models/instructor");
const IndividualTrainee = require("../models/individualTrainee");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

exports.updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      biography,
      country,
      currentPassword,
      newPassword,
    } = req.body;

    const token = req.headers.authorization?.split(" ")[1]; // Extract token after "Bearer"
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // 🔹 Verify and decode the token to get the instructor ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const instructorId = decoded.id; // Assuming the token contains `id`

    // Find instructor and explicitly select the password field
    let instructor = await Instructor.findById(instructorId).select(
      "+password"
    );

    // Update allowed fields
    if (fullName) instructor.fullName = fullName;
    if (email) {
      const existingAdmin = await Admin.findOne({ email });
      const existingIndividualTrainee = await IndividualTrainee.findOne({
        email,
      });
      if (existingAdmin || existingIndividualTrainee) {
        return res
          .status(400)
          .json({ error: "Email already taken by another user" });
      }
      instructor.email = email;
    }
    if (biography) instructor.biography = biography;
    if (country) instructor.country = country;

    // Handle password update
    if (currentPassword && newPassword) {
      // Update password
      instructor.password = newPassword;
    }

    await instructor.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", instructor });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.getInstructor = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token after "Bearer"

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Verify and decode the token to get the instructor ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const instructorId = decoded.id; // Assuming the token contains `id`

    // Fetch the instructor data from the database
    const instructor = await Instructor.findById(instructorId);

    // Successfully retrieved the instructor
    return res.status(200).json({
      message: "Instructor retrieved successfully",
      data: { instructor },
    });
  } catch (err) {
    console.error(err);
    // If the token is invalid or an error occurs, handle it here
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
