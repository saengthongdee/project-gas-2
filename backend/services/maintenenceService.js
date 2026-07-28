const maintenenceModel = require('../models/maintenanceModel')
const ApiError=require('../utils/ApiError')

const findAllMaintenence =async()=>{
    return new Promise((success,fail)=>{
        maintenenceModel.findAllMaintenance((err,results)=>{
            if(err){return fail(err)}

            success({
                success:true,
                message:"Maintenence retrived Successfully",
                data:results
            })
        })
    })
}

const createMaintenence = async(maintenencedata)=>{
    return new Promise((success,fail)=>{
        maintenenceModel.createMaintenance(maintenencedata,(err,results)=>{
            if(err){return fail(err)}
            success({
                success:true,
                message:"Maintenence create Successfully",
                data:results
            })
        })
    })
}

const updateMaintenence = async(maintenencedata,maintenence_id)=>{
    return new Promise((success,fail)=>{
        maintenenceModel.updateMaintenance(maintenencedata,maintenence_id,(err,results)=>{
            if(err){return fail(err)}
            success({
                success:true,
                message:"Maintenence updated Successfully",
                data:results
            })
        })
    })
    
}

const deleteMaintenence =async(maintenence_id)=>{
    return new Promise((succes,fail)=>{
        maintenenceModel.deleteMaintenance(maintenence_id,(err,results)=>{
            if(err){return fail(err)}

            succes({
                succes:true,
                message:"Maintenence deleted Successfully"
            })
        })
    })
}

module.exports={
    findAllMaintenence,
    createMaintenence,
    updateMaintenence,
    deleteMaintenence
}