const order_itemService = require('../services/order_itemService')
const asyncHandler = require('../utils/asyncHandler')
const ApiError =require('../utils/ApiError')

exports.updateOrder_item = asyncHandler(async(req,res,next)=>{
    const {quantity}=req.body;
    const item_id=req.params.id;

    if(!quantity || quantity === 0 || !item_id || quantity <=0){
        return next(new ApiError(400,"quantity or item_id are required"))
    }
    const result =await order_itemService.update_itemOrder(item_id,quantity)
    res.status(200).json(result)
})

exports.deleteOrder_item = asyncHandler(async(req,res,next)=>{
    const item_id = req.params.id;
    if(!item_id){return next(new ApiError(400,"item_id is required"))}
    const result = await order_itemService.delete_itemsOrder(item_id)

    res.status(200).json(result)
})