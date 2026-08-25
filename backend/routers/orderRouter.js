const express = require("express");
const router = express.Router();
const upload = require('../middlewares/upload');

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createOrders,
  findAllOrders,
  deleteOrders,
  findOrderbyStatus,
  updateOrderVehicle,
  findOrdertodayByVehicle,
  findOneOrder,
  uploadImage,
  cancelOrder
} = require("../controller/orderController");

//router.use(authMiddleware)

router.get("/", findAllOrders);
router.post("/", createOrders);
router.delete("/:id", deleteOrders);
router.get("/status", findOrderbyStatus);
router.put("/delivery", updateOrderVehicle);
router.get('/driver/:id' , findOrdertodayByVehicle)
router.get('/subdetail/:id' , findOneOrder)
router.put('/upload/:order_id', uploadImage);
router.put('/:id/cancel', cancelOrder)

module.exports = router;
