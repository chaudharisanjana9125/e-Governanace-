const express = require("express");
const router = express.Router();
const {
  getAll,
  updateStatus
} = require("../controllers/adminController");

router.get("/all", getAll);
router.put("/update/:id", updateStatus);

module.exports = router;