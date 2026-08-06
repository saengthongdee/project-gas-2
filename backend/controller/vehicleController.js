const vehicleService = require('../services/vehicleService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError =require('../utils/ApiError');

exports.findAllVehicle =asyncHandler(async(req,res,next)=>{
    const result=await vehicleService.findAllVehicle();
    res.status(200).json(result);
})
exports.createVehicle = asyncHandler(async(req,res,next)=>{
    const vehicledata=req.body
    const result =await vehicleService.createVehicle(vehicledata);
    res.status(201).json(result);
})

exports.updateVehicle = asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const vehicledata=req.body

    if(!id){return next(new ApiError(400,"id not found"))}

    Object.keys(vehicledata).forEach(key=>{
        if(vehicledata[key]=== undefined || vehicledata[key] === null){
            delete vehicledata[key]
        }
    })

    const result =await vehicleService.updateVehicle(vehicledata,id);
    res.status(200).json(result);
})

exports.deleteVehicle =asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const result =await vehicleService.deleteVehicle(id);
    res.status(200).json(result);
})

exports.findVehicleISNull = asyncHandler(async(req,res,next)=>{

    const result =await vehicleService.findVehicleISNull();
    res.status(200).json(result);
    
})
