const productModel = require('../models/productModel');
const ApiError =require('../utils/ApiError');

const findAllProduct =async()=>{
    return new Promise ((success,fail)=>{
        productModel.findAllProduct((error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Products retrived Successfully",
                data:results
            })
        })
    })
}

const createProduct = async(productdata)=>{
    return new Promise((success,fail)=>{
        productModel.createProduct(productdata,(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Product created Successfully",
                data:results
            })
        })
    })
}

const updateProduct =async(productdata,product_id)=>{
    return new Promise ((success,fail)=>{
        productModel.updateProduct(productdata,product_id,(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Product updated Successfully",
                data:results
            })

        })
    })
}

const deleteProduct = async(product_id)=>{
    return new Promise((success,fail)=>[
        productModel.deleteProduct(product_id,async(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Product deleted successfully "
            })
        })
    ])
}

module.exports={
    findAllProduct,
    createProduct,
    updateProduct,
    deleteProduct
}