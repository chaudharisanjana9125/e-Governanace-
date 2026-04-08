const express = require("express");
const router = express.Router();
const {
  applyService,
  getStatus
} = require("../controllers/citizenController");

router.post("/apply", applyService);
router.get("/status/:userId", getStatus);

module.exports = router;