const IndividualTrainee = require("../models/individualTrainee");
const Admin = require("../models/admin");
const Instructor = require("../models/instructor");
const jwt = require("jsonwebtoken");

// Controller function to handle individual trainee signup
exports.signup = async (req, res) => {
  try {
    const { username, password, firstName, lastName, gender } = req.body;
    let email = req.body.email || undefined;

    // Check if username or email is already taken
    let existingIndividualTrainee = await IndividualTrainee.findOne({
      username,
    });
    let existingAdmin = await Admin.findOne({ username });
    let existingInstructor = await Instructor.findOne({ username });

    if (email) {
      existingIndividualTrainee =
        existingIndividualTrainee ||
        (await IndividualTrainee.findOne({ email }));
      existingAdmin = existingAdmin || (await Admin.findOne({ email }));
      existingInstructor =
        existingInstructor || (await Instructor.findOne({ email }));
    }

    if (existingIndividualTrainee || existingAdmin || existingInstructor) {
      return res
        .status(400)
        .json({ message: "Username or email already taken by another user." });
    }

    // Create a new individual trainee
    const newTrainee = new IndividualTrainee({
      username,
      email,
      password,
      firstName,
      lastName,
      gender,
    });

    await newTrainee.save();

    // Create a JWT token
    const token = jwt.sign(
      {
        id: newTrainee._id,
        role: "individualTrainee", // Role for the individual trainee
        username: newTrainee.username,
      },
      process.env.JWT_SECRET_KEY, // Secret key from .env
      { expiresIn: process.env.JWT_EXPIRATION_TIME } // Token expiration time
    );

    // Return success response with the token
    res.status(201).json({
      message: "Individual trainee signed up successfully.",
      trainee: {
        username: newTrainee.username,
        email: newTrainee.email,
        firstName: newTrainee.firstName,
        lastName: newTrainee.lastName,
        gender: newTrainee.gender,
      },
      token: token, // Include the token in the response
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check across all schemas
    let user = await Admin.findOne({ username }).select("+password");
    let role = "admin";

    if (!user) {
      user = await IndividualTrainee.findOne({ username }).select("+password");
      role = "individualTrainee";
    }

    if (!user) {
      user = await Instructor.findOne({ username }).select("+password");
      role = "instructor";
    }

    // If user does not exist
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare password using instance method
    const isMatch = await user.comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION_TIME }
    );

    // Return success response
    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        role: role,
      },
      token: token,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};
