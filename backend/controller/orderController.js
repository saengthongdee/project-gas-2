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