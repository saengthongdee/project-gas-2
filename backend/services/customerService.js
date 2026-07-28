
const customerModel = require("../models/customerModel");
const ApiError=require('../utils/ApiError')

//การเอาไว้คุยกับฐานข้อมูล
const findAllCustomer = async()=>{
    return new Promise((success,fail)=>{
        customerModel.findAllCustomer((error,results)=>{
            if(error){return fail(error)}
            success({
                success:true,
                message:"Customers retrived Successfully",
                data:results
            })
        })
    })
}

const createCustomer =async(customerdata)=>{
    return new Promise((success,fail)=>{
        customerModel.createCustomer(customerdata,(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Customer created Successfully",
                data:results
            })
        })
    })
}

const updateCustomer = async(customerdata,customer_id)=>{
    console.log(customerdata,customer_id)

    return new Promise((success,fail)=>{
        customerModel.updateCustomer(customerdata,customer_id,(error,results)=>{
            if(error){return fail(error)}

            
            success({
                success:true,
                message:"Customer updated Successfully",
                data:results
            })
        })
    })
}

const deleteCustomer =async(customer_id)=>{
    return new Promise((success,fail)=>{
        customerModel.deleteCustomer(customer_id,(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Customer deleted Successfully"
            })
        })
    })
}

module.exports = {
    findAllCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
}