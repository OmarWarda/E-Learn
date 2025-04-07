const Admin = require("../models/admin");
const Instructor = require("../models/instructor");
const IndividualTrainee = require("../models/individualTrainee");

exports.addAdminOrInstructorOrCorporate = async (req, res, role) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Username and password are required!",
      });
    }

    // Check if username is unique across all models
    const existingAdmin = await Admin.findOne({ username });
    const existingInstructor = await Instructor.findOne({ username });

    const existingIndividualTrainee = await IndividualTrainee.findOne({
      username,
    });

    if (existingAdmin || existingInstructor || existingIndividualTrainee) {
      return res.status(400).json({
        status: "fail",
        message: "Username is already taken!",
      });
    }

    const userData = {
      username,
      password,
    };

    let data;
    if (role === "admin") {
      data = await Admin.create(userData);
    } else if (role === "instructor") {
      data = await Instructor.create(userData);
    } else if (role === "corporate") {
      data = await CorporateTrainee.create(userData);
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Invalid role!",
      });
    }

    res.status(201).json({
      status: "success",
      message: `${role} added successfully!`,
      data: {
        username,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
