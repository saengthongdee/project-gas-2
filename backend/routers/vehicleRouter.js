const express = require("express");
const router = express.Router();

const {
  findAllVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  findVehicleISNull,
  updateVehicleStatus
} = require("../controller/vehicleController");


router.get("/", findAllVehicle);
router.post("/", createVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);
router.get("/null", findVehicleISNull);
router.put('/status/:id' , updateVehicleStatus)

module.exports = router;
