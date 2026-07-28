const employeeService = require('../services/employeeService');
const asyncHandler =require('../utils/asyncHandler');
const ApiError =require ('../utils/ApiError');

exports.findAllEmployee =asyncHandler(async(req,res,next)=>{
    const result=await employeeService.findAllEmployee();
    res.status(200).json(result);
})

exports.createEmployee = asyncHandler(async(req,res,next)=>{
    const employeedata=req.body
    const result=await employeeService.createEmployee(employeedata);
    res.status(201).json(result);
})

exports.updateEmployee =asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const employeedata=req.body

    if(!id){return next(new ApiError(400,"id not found"))}

    Object.keys(employeedata).forEach(key=>{
        if(employeedata[key]=== undefined){
            delete employeedata[key]
        }
    })

    const result =await employeeService.updateEmployee(employeedata,id);
    res.status(200).json(result);
})
exports.deleteEmployee = asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const result=await employeeService.deleteEmployee(id);
    res.status(200).json(result);
})