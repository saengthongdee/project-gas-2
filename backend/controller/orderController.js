const orderService =require('../services/orderService')

const asyncHandler =require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')


exports.createOrders = asyncHandler(async(req,res,next)=>{
    const orderData =req.body

    Object.keys(orderData).forEach(key =>{
        if(orderData[key] === undefined || orderData[key] === null){
            delete orderData[key]
        }
    })
    const result =await orderService.createOrder(orderData)
    res.status(201).json(result)
})
exports.findAllOrders=asyncHandler(async(req,res,next)=>{
    const results = await orderService.getAllOrder()
    res.status(200).json(results)
})
exports.findOrderbyStatus = asyncHandler(async(req,res,next)=>{
    const results = await orderService.findOrderbyStatus()
    res.status(200).json(results)
})
exports.deleteOrders = asyncHandler(async (req , res , next) => {

    const id = req.params.id
    
    if(!id) { return new ApiError(400,"Missing required field: id") }

    const result = await orderService.deleteOrder(id)
    res.status(200).json(result)
})

exports.updateOrderVehicle = asyncHandler(async (req, res, next) => {

  const { order_ids, vehicle_id } = req.body;

  // ✅ 2. เช็คว่าเป็น Array และไม่เป็นค่าว่าง
  if (!order_ids || !vehicle_id || !Array.isArray(order_ids) || order_ids.length === 0) {
    return next(new ApiError(400, "Missing or invalid required fields: order_ids (array) or vehicle_id"));
  }

  const result = await orderService.updateOrderVehicle(order_ids, vehicle_id);
  res.status(200).json(result);
});

exports.findOrdertodayByVehicle = asyncHandler(async(req , res , next) => {

    const id = req.params.id

    if(!id) {return next(new ApiError(400 , "vehicle_id is not requried"))}

    const results = await orderService.findOrdertodayByVehicle(id)
    res.status(200).json(results)
})
