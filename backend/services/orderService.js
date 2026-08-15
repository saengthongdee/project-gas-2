const orderModel = require('../models/orderModel')
const vihicleModel = require('../models/vehicleModel')
const items_order = require('../models/order_itemModel')
const productModel = require('../models/productModel')

const ApiError =require('../utils/ApiError')
const authMiddleware =require('../middlewares/authMiddleware')

const createOrder = async (orderdata) => {
    return new Promise((success, fail) => {
        const { items, ...mainOrderData } = orderdata;

        productModel.checkStock(items, (stockError, stockCheck) => {
            if (stockError) { return fail(stockError); }

            if (!stockCheck.sufficient) {
                return success({
                    success: false,
                    message: "Insufficient stock for one or more items",
                    insufficient_items: stockCheck.insufficient_items
                });
            }

            orderModel.createOrder(mainOrderData, (error, results) => {
                if (error) { return fail(error); }

                const order_id = results.insertId || results.order_id;
                if (!order_id) {
                    return fail(new Error("Cannot retrieved order_id, Insert might have failed."));
                }

                items_order.Createitem_order(order_id, items, (error, results) => {
                    if (error) { return fail(error); }

                    productModel.updateStock(items, (error) => {
                        
                        if (error) { return fail(error); }

                        success({
                            success: true,
                            message: "create successfully and stock updated"
                        });
                    });
                });
            });
        });
    });
};
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
                        delivery_status:order.delivery_status,
                        order_date:order.order_date,
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

const deleteOrder = async(order_id) => {

    return new Promise((success , fail ) => {

        orderModel.deleteOrder(order_id , (err , results) => {

            if(err) { return fail(err)}

            success({
                success:true,
                message:"Delete order successfully"
            })
        })
    })
}
const findOrderbyStatus = async()=>{
    
    return new Promise((success, fail) => {

        orderModel.findOrderbyStatus((err,results) => {

            if(err) { return fail(err)}

            success({
                success:true,
                message:"Fetch order by status successfully",
                data:results
            })
        })
    })
}

const updateOrderVehicle = async(order_id,vehicle_id) => {

    return new Promise((success , fail ) => {

        orderModel.updateOrderVehicle(order_id , vehicle_id , (err , results) => {

            if(err) {return fail(err)}

            orderModel.updateOrderStatus(order_id, 'delivering', (err, results) => {

                if(err) {return fail(err)}

                vihicleModel.updateVehicleStatus(vehicle_id, 'in_use', (err, results) => {

                    if(err) {return fail(err)}

                    success({
                        success:true,
                        message:"Update order vehicle successfully"
                    })
                })
            })
        })
    })
}

const findOrdertodayByVehicle = async(vehicle_id) => {

    return new Promise((success , fiil) => {

        orderModel.findOrdertodayByVehicle(vehicle_id , (err , results) => {
            if(err) { return fail(err)}
            
            success({
                success: true,
                message: "Fetch ordertoday successfully",
                data : results
            })
        })
    })
}

const findOneOrder = async(order_id) => {

    return new Promise((success , fail) => {

        orderModel.findOneOrder(order_id , (err , resultSCustomer) => {

            if(err) {return fail(err)}

            items_order.findOneOrder_Item(order_id , (err , resultItem) => {
                
            success({
                success: true,
                message: "fetching detail order successfully",
                data: {
                    ...resultSCustomer[0],
                    items: resultItem
                }
            });
            })
        })
    })
}

const uploadImage = async(order_id , imagePath) => {

    return new Promise((success , fail) => {
        orderModel.uploadImage(order_id , imagePath,(err , result) => {

            if(err) {return fail(err)}

            orderModel.updateOrderStatus(order_id , "delivered" ,(err , result) => {

                if(err){return fail(err)}
                
                success({
                    success: true,
                    message: "upload image successfully"
                })
            })


        })
    })
}

module.exports={
    createOrder,
    getAllOrder,
    deleteOrder,
    findOrderbyStatus,
    updateOrderVehicle,
    findOrdertodayByVehicle,
    findOneOrder,
    uploadImage
}