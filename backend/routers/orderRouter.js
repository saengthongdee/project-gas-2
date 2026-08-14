const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createOrders,
  findAllOrders,
  deleteOrders,
  findOrderbyStatus,
  updateOrderVehicle,
  updateOrderStatus,
  findOrdertodayByVehicle
} = require("../controller/orderController");

//router.use(authMiddleware)

router.get("/", findAllOrders);
router.post("/", createOrders);
router.delete("/:id", deleteOrders);
router.get("/status", findOrderbyStatus);
router.put("/delivery", updateOrderVehicle);
router.get('/driver/:id' , findOrdertodayByVehicle)

module.exports = router;
