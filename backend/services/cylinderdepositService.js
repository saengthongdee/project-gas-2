const cylinderdepositModel = require('../models/cylinderdepositModel');
const ApiError =require('../utils/ApiError');

const findAllCylinderdeposit =async()=>{
    return new Promise ((success,fail)=>{
        cylinderdepositModel.findAllCylinderdeposit((error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Cylinder_deposit retrived Successfully",
                data:results
            })
        })
    })
}
const updateCylinderdeposit =async(deposit_id , qty_return)=>{
    return new Promise((success,fail)=>{

        cylinderdepositModel.updateCylinderdeposit(deposit_id , qty_return , (err , results) => {

            if(err) {return fail(err)}

            success({
                success : true,
                message : "update cylinderdeposit successfully"
            })
        })
    })
}

const deleteCylinderdeposit = async(deposit_id)=>{
    return new Promise((success,fail)=>{
        cylinderdepositModel.deleteCylinderdeposit(deposit_id,async(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Cylinder_deposit deleted successfully"
            })
        })
    })
}

module.exports={
    findAllCylinderdeposit,
    updateCylinderdeposit,
    deleteCylinderdeposit
}