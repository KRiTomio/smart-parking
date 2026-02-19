const express = require("express");
const router = express.Router();
const parkingController = require("../controllers/parkingController");

router.post("/checkin", parkingController.checkIn);
router.get("/status/:id", parkingController.getStatus);
router.post("/checkout", parkingController.checkOut);
router.get("/live/:id", parkingController.getLiveStatus);
router.get("/availability/:floor", parkingController.getAvailableByFloor);


module.exports = router;
