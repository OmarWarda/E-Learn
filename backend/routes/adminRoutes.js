const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/addAdmin", (req, res) => {
  adminController.addAdminOrInstructorOrCorporate(req, res, "admin");
});
router.post("/addInstructor", (req, res) => {
  adminController.addAdminOrInstructorOrCorporate(req, res, "instructor");
});
router.post("/addCorporate", (req, res) => {
  adminController.addAdminOrInstructorOrCorporate(req, res, "corporate");
});
module.exports = router;
