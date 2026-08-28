const express = require("express");
const router = express.Router();

const {
  findAllFillingOrder,
  createFillingOrder,
  deleteFillingOrder
} = require("../controller/fillingorderController");

router.get("/", findAllFillingOrder);
router.post("/", createFillingOrder);
router.delete("/:id", deleteFillingOrder);

module.exports = router;