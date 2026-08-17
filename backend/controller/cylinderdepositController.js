const cylinderdepositService = require('../services/cylinderdepositService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError =require('../utils/ApiError');

exports.findAllCylinderdeposit =asyncHandler(async(req,res,next)=>{
    const result=await cylinderdepositService.findAllCylinderdeposit();
    res.status(200).json(result);
})
exports.updateCylinderdeposit = asyncHandler(async(req,res,next)=>{

    const deposit_id = req.params.id
    const {qty_return} = req.body
    
    if(!deposit_id || !qty_return) { return next(new ApiError(400, "deposit_id or qty_return are requried"))}

    const result =await cylinderdepositService.updateCylinderdeposit(deposit_id , qty_return);
    res.status(200).json(result);
})

exports.deleteCylinderdeposit = asyncHandler(async(req,res,next)=>{

    const {id}=req.params

    if(!id) {return next(new ApiError(400, "id is required"))}

    const result =await cylinderdepositService.deleteCylinderdeposit(id);
    res.status(200).json(result);
})
