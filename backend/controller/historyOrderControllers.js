const asyncHandler=require('../utils/asyncHandler')
const ApiError =require('../utils/ApiError')
const historyOrderSeriver = require('../services/historyOrder')

exports.findAllhistoryOrder = asyncHandler(async (req , res , next) => {

    const results = await historyOrderSeriver.findAllhistoryOrder();
    res.status(200).json(results)
})