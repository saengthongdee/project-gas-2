const express = require("express");
const router = express.Router();

const {
  findAllEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  ChangPassword,
  findEmployeeStatus
} = require("../controller/employeeController");

router.get("/", findAllEmployee);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.put("/:id/password", ChangPassword);
router.get('/status/:id' , findEmployeeStatus)

module.exports = router;
