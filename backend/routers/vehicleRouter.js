const express = require("express");
const router = express.Router();

const {
  findAllVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  findVehicleIsNull,
  updateVehicleStatus,
  updatePushToken
} = require("../controller/vehicleController");

router.get("/", findAllVehicle);
router.post("/", createVehicle);
router.get("/null", findVehicleIsNull);

router.put("/token", updatePushToken);
router.put("/status/:id", updateVehicleStatus);

router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;