const express = require("express");
const instructorController = require("../controllers/instructorController");

const router = express.Router();

router.post("/updateProfile", instructorController.updateProfile);

router.get("/getInstructor", instructorController.getInstructor);

module.exports = router;
