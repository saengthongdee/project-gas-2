const customerService = require('../services/customerService');
const asyncHandler =require('../utils/asyncHandler');

const ApiError = require ('../utils/ApiError');

//รับข้อมูลเข้า
exports.findAllCustomer = asyncHandler(async(req,res,next)=>{

    const result=await customerService.findAllCustomer();
    res.status(200).json(result);
})

exports.createCustomer = asyncHandler(async(req,res,next)=>{
    const customerdata=req.body
    const result=await customerService.createCustomer(customerdata);

    res.status(200).json(result);
})

exports.updateCustomer = asyncHandler(async(req,res,next)=>{
    const{id}=req.params
    const customerdata=req.body
    console.log(req.params);
    console.log(req.body);

    if(!id){return next(new ApiError(400,"id not found"))}
    Object.keys(customerdata).forEach(key =>{
        if(customerdata[key]=== undefined || customerdata[key] === null){
            delete customerdata[key]
        }
    })
    
    const result=await customerService.updateCustomer(customerdata,id);

    res.status(200).json(result);
})

exports.deleteCustomer = asyncHandler(async(req,res,next)=>{
    const {id} =req.params

    const result=await customerService.deleteCustomer(id);

    res.status(200).json(result);
})
