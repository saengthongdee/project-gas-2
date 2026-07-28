const fillingorderService =require('../services/fillingorderService')
const asyncHandler=require('../utils/asyncHandler')
const ApiError =require('../utils/ApiError')

exports.findAllFillingorder= asyncHandler(async(req,res,next)=>{
    const result=await fillingorderService.findAllFillingorder();
    res.status(200).json(result);
})

exports.createFillingorder =asyncHandler(async(req,res,next)=>{
    const fillingdata =req.body
    const result =await fillingorderService.createFillingorder(fillingdata);

    res.status(201).json(result);
})

exports.updateFillingorder =asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const fillingdata=req.body

    if(!id){return next(new ApiError(400,"id not found"))}
    Object.keys(fillingdata).forEach(key =>{
        if(fillingdata[key]=== undefined || fillingdata[key] === null){
            delete fillingdata[key]
        }
    })
    const result=await fillingorderService.updateFillingorder(fillingdata,id);
    res.status(200).json(result);
})

exports.deleteFillingorder =asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const result=await fillingorderService.deleteFillingorder(id);
    res.status(200).json(result);
})