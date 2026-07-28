const vehiclebrandModel = require('../models/vehiclebrandModel');
const ApiError =require('../utils/ApiError');

const findAllVehiclebrand =async()=>{
    return new Promise ((success,fail)=>{
        vehiclebrandModel.findAllVehiclebrand((error,results)=>{
            if(error){return fail(error) }

            success({
                success:true,
                message:"Vehicle_brand retrived Successfully",
                data:results
            })
        })
    })
}

const createVehiclebrand = async(vehiclebranddata)=>{
    return new Promise((success,fail)=>{
        vehiclebrandModel.createVehiclebrand(vehiclebranddata,(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Vehicle_brand created Successfully",
                data:results
            })
        })
    })
}

const updateVehiclebrand =async(vehiclebranddata,brand_id)=>{
    return new Promise ((success,fail)=>{
        vehiclebrandModel.updateVehiclebrand(vehiclebranddata,brand_id,(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Vehicle_brand updated Successfully",
                data:results
            })

        })
    })
}


const deleteVehiclebrand = async(brand_id)=>{
    return new Promise((success,fail)=>[
        vehiclebrandModel.deleteVehiclebrand(brand_id,async(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Vehicle_brand deleted successfully "
            })
        })
    ])
}
module.exports={
    findAllVehiclebrand,
    createVehiclebrand,
    updateVehiclebrand,
    deleteVehiclebrand
}