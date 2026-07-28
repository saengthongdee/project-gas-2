const fillingorderModel = require('../models/fillingorderModel')
const ApiError=require('../utils/ApiError')
const { updateCustomer } = require('./customerService')

const findAllFillingorder =async()=>{
    return new Promise((success,fail)=>{
        fillingorderModel.findAllFillingorder((error,results)=>{
            if(err){return fail(err)}

            success({
                success:true,
                message:"Fillingorder retrived Successfully",
                data:results
            })
        })
    })
}
const createFillingorder = async(fillingdata)=>{
    return new Promise((success,fail)=>{
        fillingorderModel.createFillingorder(fillingdata,(error,results)=>{
            if(err){return fail(err)}
            success({
                success:true,
                message:"Fillingorder create Successfully",
                data:results
            })
        })
    })
}

const updateFillingorder = async(fillingdata,filling_order_id)=>{
    return new Promise((success,fail)=>{
        fillingorderModel.updateFillingorder(fillingdata,filling_order_id,(error,results)=>{
            if(err){return fail(err)}
            success({
                success:true,
                message:"Fillingorder updated Successfully",
                data:results
            })
        })
    })
}

const deleteFillingorder =async(fillmg_order_id)=>{
    return new Promise((succes,fail)=>{
        fillingorderModel.deleteFillingorder(fillmg_order_id,(error,results)=>{
            if(err){return fail(err)}

            succes({
                succes:true,
                message:"Fillingorder deleted Successfully"
            })
        })
    })
}

module.exports={
    findAllFillingorder,
    createFillingorder,
    updateCustomer,
    deleteFillingorder
}