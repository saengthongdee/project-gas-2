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

exports.deleteOrders = asyncHandler(async (req , res , next) => {

    const id = req.params.id
    
    if(!id) { return new ApiError(400,"Missing required field: id") }

    const result = await orderService.deleteOrder(id)
    res.status(200).json(result)
})