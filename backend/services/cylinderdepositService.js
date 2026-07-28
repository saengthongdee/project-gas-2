const cylinderdepositModel = require('../models/cylinderdepositModel');
const ApiError =require('../utils/ApiError');

const CreateBulkDeposit = (ordersData)=>{

    return new Promise((success,fail)=>{

        if(!Array.isArray(ordersData)|| ordersData.length === 0){
            return new ApiError(400,"data is Array and is not null")
        }

        const valuse = []

        ordersData.forEach((order)=>{
            if(Array.isArray(order.items)){
                order.items.forEach((item)=>{
                    valuse.push([
                        order.customer_id,
                        item.product_id,
                        order.order_id,
                        item.qty_out || 0,
                        item.qty_return || 0,
                        new Date()
                    ])
                })
            }
        })
        if(valuse.length === 0){
            return fail(new ApiError(400,"No valid items found in orders"))
        }
        cylinderdepositModel.bulkCreateDeposite(valuse,(err,results)=>{
            if(err){
                return fail(err)
            }
            success({
                success:true,
                message:"Create Sucessfully"
            })
        })
    })
    
}

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
const updateCylinderdeposit =async(orderdata)=>{
    return new Promise((success,fail)=>{
        if(!orderdata || !orderdata.order_id || !Array.isArray(orderdata.items) || orderdata.items.length === 0){
            return fail(new ApiError(400,"Invalid order dataa or items cannot be empty"))
        }

        const {order_id,items}=orderdata
        
        const updatePromises = items.map((item)=>{
            return new Promise((resolve,reject)=>{
                cylinderdepositModel.updateCylinderdeposit(
                    item.deposit_id,
                    order_id,
                    item.qty_return || 0,
                    (err,results)=>{
                    if(err){return fail(err)}
                    resolve(results)
                }
            )
            })
        })
        Promise.all(updatePromises).then(()=>{
            success({
                success:true,
                message:"Update"
            })
        }).catch((err)=> fail(err))
    })
}

const deleteCylinderdeposit = async(deposit_id)=>{
    return new Promise((success,fail)=>{
        cylinderdepositModel.deleteCylinderdeposit(deposit_id,async(error,results)=>{
            if(error){return fail(error)}

            success({
                success:true,
                message:"Cylinder_deposit deleted successfully "
            })
        })
    })
}

module.exports={
    CreateBulkDeposit,
    findAllCylinderdeposit,
    updateCylinderdeposit,
    deleteCylinderdeposit
}