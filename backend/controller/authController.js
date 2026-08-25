//check password ว่าข้อมูลถูกไหมแบบได้รับมารึเปล่าถูกรึเปล่า
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const ApiError =require ('../utils/ApiError');

exports.login=asyncHandler(async(req, res,next) => {
    
    const{ email,password } = req.body;

    if(!email ||!password ){
        return next(new ApiError(400,"Email and password are required"));
    }
    const result = await authService.login(email,password);

    res.status(200).json(result);
});
exports.registerEmployee=asyncHandler(async(req,res,next)=>{
    const employeeData = req.body;
    if(!employeeData.name || !employeeData.email ||!employeeData.password||!employeeData.role_id||!employeeData.phone){
        return next(new ApiError(400 ,"Data are require"))
    }
    const result =await authService.registerEmployee(employeeData)
    res.status(201).json(result)
});