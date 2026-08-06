const vehicleModel = require('../models/vehicleModel');
const ApiError =require('../utils/ApiError');

const findAllVehicle =async()=>{
    return new Promise ((success,fail)=>{
        vehicleModel.findAllVehicle((error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Vehicle retrived Successfully",
                data:results
            })
        })
    })
}
const createVehicle = async(vehicledata)=>{
    return new Promise((success,fail)=>{
        vehicleModel.createVehicle(vehicledata,(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Vehicle created Successfully",
                data:results
            })
        })
    })
}

const updateVehicle =async(vehicledata,vehicle_id)=>{
    return new Promise ((success,fail)=>{
        vehicleModel.updateVehicle(vehicledata,vehicle_id,(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Vehicle updated Successfully",
                data:results
            })

        })
    })
}

const deleteVehicle = async(vehicle_id)=>{
    return new Promise((success,fail)=>{
        vehicleModel.deleteVehicle(vehicle_id,async(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Vehicle deleted successfully "
            })
        })
    })
}

const findVehicleISNull = async() => {
    
    return new Promise((success , fail ) => {

        vehicleModel.findVehicleISNull((err , results) => {

            if(err) { return fail(err)}

            success({
                success:true,
                message:"Vehicle retrived successfully",
                data:results
            })
        })
    })
}

module.exports={
    findAllVehicle,
    createVehicle,
    updateVehicle,
    findVehicleISNull,
    deleteVehicle
}