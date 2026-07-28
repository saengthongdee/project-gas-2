const cylinderdepositService = require('../services/cylinderdepositService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError =require('../utils/ApiError');

exports.CreateBulkDeposit =asyncHandler(async(req,res,next)=>{
    const cylinderdepositdata = req.body

    Object.keys(cylinderdepositdata).forEach(key => {
        if(cylinderdepositdata[key] === undefined || cylinderdepositdata[key] === null){
            delete cylinderdepositdata[key];
        }
    });

    const result = await cylinderdepositService.CreateBulkDeposit(cylinderdepositdata)
    return res.status(201).json(result)
})

exports.findAllCylinderdeposit =asyncHandler(async(req,res,next)=>{
    const result=await cylinderdepositService.findAllCylinderdepositd();
    res.status(200).json(result);
})
exports.updateCylinderdeposit = asyncHandler(async(req,res,next)=>{
    const orderdata=req.body

    const result =await cylinderdepositService.updateCylinderdeposit(orderdata);
    res.status(200).json(result);
})

exports.deleteCylinderdeposit =asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const result =await cylinderdepositService.deleteCylinderdeposit(id);
    res.status(200).json(result);
})
