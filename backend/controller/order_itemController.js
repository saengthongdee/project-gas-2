const order_itemService = require('../services/order_itemService')
const asyncHandler = require('../utils/asyncHandler')
const ApiError =require('../utils/ApiError')

exports.updateOrder_item = asyncHandler(async(req,res,next)=>{

    const order_id = req.params.id;
    const { items } = req.body;

    if (!order_id || !items || !Array.isArray(items) || items.length === 0) {
        return next(new ApiError(400, "order_id and items array are required"));
    }
    const result =await order_itemService.updateMultipleItemOrders(order_id, items)
    res.status(200).json(result)
})

exports.deleteOrder_item = asyncHandler(async(req,res,next)=>{
    const item_id = req.params.id;
    if(!item_id){return next(new ApiError(400,"item_id is required"))}
    const result = await order_itemService.delete_itemsOrder(item_id)

    res.status(200).json(result)
})