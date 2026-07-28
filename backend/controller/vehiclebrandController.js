const vehiclebrandService = require('../services/vehiclebrandService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError =require('../utils/ApiError');

exports.findAllVehiclebrand =asyncHandler(async(req,res,next)=>{
    const result=await vehiclebrandService.findAllVehiclebrand();
    res.status(200).json(result);
})

exports.createVehiclebrand = asyncHandler(async(req,res,next)=>{
    const vehiclebranddata=req.body
    const result =await vehiclebrandService.createVehiclebrand(vehiclebranddata);
    res.status(201).json(result);
})

exports.updateVehiclebrand = asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const vehiclebranddata=req.body

    if(!id){return next(new ApiError(400,"id not found"))}

    Object.keys(vehiclebranddata).forEach(key=>{
        if(vehiclebranddata[key]=== undefined || vehiclebranddata[key] === null){
            delete vehiclebranddata[key]
        }
    })

    const result =await vehiclebrandService.updateVehiclebrand(vehiclebranddata,id);
    res.status(200).json(result);
})
exports.deleteVehiclebrand =asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const result =await vehiclebrandService.deleteVehiclebrand(id);
    res.status(200).json(result);
})