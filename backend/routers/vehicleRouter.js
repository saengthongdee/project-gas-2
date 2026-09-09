const express = require("express");
const router = express.Router();

const {
  findAllVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  findVehicleISNull,
  updateVehicleStatus,
  updatePushToken
} = require("../controller/vehicleController");

router.get("/", findAllVehicle);
router.post("/", createVehicle);
router.get("/null", findVehicleISNull);

router.put("/token", updatePushToken);
router.put("/status/:id", updateVehicleStatus);

router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;