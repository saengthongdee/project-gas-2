const orderModel = require('../models/orderModel')
const items_order = require('../models/order_itemModel')

const ApiError =require('../utils/ApiError')
const authMiddleware =require('../middlewares/authMiddleware')

const createOrder = async(orderdata)=>{
    return new Promise((success,fail)=> {
        const {items, ...mainOrderData} = orderdata;

        orderModel.createOrder(mainOrderData,(error,results)=>{
            if(error){return fail(error)}

            const order_id = results.insertId || results.order_id;
            if(!order_id){
                return fail(new Error(
                    "Cannot retirved order_id, Insert might have failed."
                ));
            }

            items_order.Createitem_order(order_id,items,(error,results)=>{
                if(error){return fail(error)}
                success({
                    success:true,
                    message:"create successfully"
                })
            })
        })
    })
}
const getAllOrder = async()=>{
    return new Promise((success,fail)=>{
        const fetchOrder = new Promise ((resolve,reject)=>{
            orderModel.findAllOrder((err,results)=>{
                if(err){return fail(err)}
                resolve(results)
            })
        })
        const fetchItems = new Promise((resolve,reject)=>{
            items_order.findAllitem((err,results)=>{
                if(err){return fail(err)}

                resolve(results)
            })
        })
        Promise.all([fetchOrder,fetchItems]).then(([orderList,itemList])=>{
            const formatted = orderList.map(order =>{
                const matchingItems = itemList.
                    filter(item => item.order_id === order.order_id)
                    .map(item =>{
                        const {order_iid, ...itemDetials}=item;
                        return itemDetials
                    })
                    return {
                        order_id : order.order_id,
                        customer_name:order.customer_name,
                        total_amount:order.total_amount,
                        employee_name:order.name,
                        license_palte: order.license_palte,
                        items: matchingItems
                    }
            })
            success({
                success:true,
                message:"Fetch all orders successfully",
                data:formatted
            });
        })
        .catch(error =>{
            fail(error)
        })
    })
}


module.exports={
    createOrder,
    getAllOrder

}