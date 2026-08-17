const express = require("express");
const router = express.Router();

const {
  findAllCylinderdeposit,
  updateCylinderdeposit,
  deleteCylinderdeposit,
} = require("../controller/cylinderdepositController");

router.get("/", findAllCylinderdeposit);
router.put("/:id", updateCylinderdeposit);
router.delete("/:id", deleteCylinderdeposit);

module.exports = router;
