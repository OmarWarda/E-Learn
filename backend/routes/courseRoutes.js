const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/getAllCourses", courseController.getAllCourses);
router.post("/createCourse", courseController.createCourse);
router.get("/reviews/:courseId", courseController.getCourseReviews);
router.get("/getCourse/:courseId", courseController.getCourseById);

module.exports = router;
