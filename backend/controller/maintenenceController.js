const maintenenceService = require('../services/maintenenceService')
const asyncHandler=require('../utils/asyncHandler')
const ApiError =require('../utils/ApiError')

exports.findAllMaintenence= asyncHandler(async(req,res,next)=>{
    const result=await maintenenceService.findAllMaintenence();
    res.status(200).json(result);
})

exports.createMaintenence =asyncHandler(async(req,res,next)=>{
    const maintenencedata =req.body
    const result =await maintenenceService.createMaintenence(maintenencedata);

    res.status(201).json(result);
})

exports.updateMaintenence =asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const maintenencedata=req.body

    if(!id){return next(new ApiError(400,"id not found"))}
    Object.keys(maintenencedata).forEach(key =>{
        if(maintenencedata[key]=== undefined || maintenencedata[key] === null){
            delete maintenencedata[key]
        }
    })
    const result=await maintenenceService.updateMaintenence(maintenencedata,id);
    res.status(200).json(result);
})

exports.deleteMaintenence =asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const result=await maintenenceService.deleteMaintenence(id);
    res.status(200).json(result);
})