const productService = require('../services/poductService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError =require('../utils/ApiError');

exports.findAllProduct =asyncHandler(async(req,res,next)=>{
    const result=await productService.findAllProduct();
    res.status(200).json(result);
})

exports.createProduct = asyncHandler(async(req,res,next)=>{
    const productdata=req.body
    const result =await productService.createProduct(productdata);
    res.status(201).json(result);
})

exports.updateProduct = asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const productdata=req.body

    if(!id){return next(new ApiError(400,"id not found"))}

    Object.keys(productdata).forEach(key=>{
        if(productdata[key]=== undefined || productdata[key] === null){
            delete productdata[key]
        }
    })

    const result =await productService.updateProduct(productdata,id);
    res.status(200).json(result);
})

exports.deleteProduct =asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const result =await productService.deleteProduct(id);
    res.status(200).json(result);
})