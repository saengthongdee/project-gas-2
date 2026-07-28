const order_itemModel = require('../models/order_itemModel')
const orderModel = require('../models/orderModel');
const ApiError = require('../utils/ApiError')

const update_itemOrder = async (item_id, quantity) => {
    return new Promise((success, fail) => {

        order_itemModel.findOneitem_order(item_id, (err, result) => {

            if (err) { return fail(err) }

            if (!result || result.length === 0) {
                return fail(new ApiError(404, "Not found item_order"));
            }

            const order_id = result[0].order_id;
            const oldQuantity = result[0].quantity;
            const pricePerUnit = result[0].unit_price;

            if (!pricePerUnit) {
                return fail(new ApiError(400, "unit_price is missing"));
            }

            const qtyDifference = quantity - oldQuantity;
            const priceDifference = Math.abs(qtyDifference * pricePerUnit);

            orderModel.delivery_status(order_id, (err, result) => {
                if (err) { return fail(err) }

                if (result.length === 0) {
                    return fail(new ApiError("ไม่พบรายการสินค้านี้ในระบบ"))
                }
                const currentStatus = result[0].delivery_status;

                if (currentStatus === 'delivered') {
                    return fail(new ApiError(400, "ไม่สามารถลบหรือแก้ไขสินค้าได้ เนื่องจากออเดอร์นี้ถูกจัดส่งสำเร็จแล้ว"));
                }
                if (currentStatus === 'delivering') {
                    return fail(new ApiError(400, "ไม่สามารถลบหรือแก้ไขสินค้าได้ เนื่องจากออเดอร์นี้อยู่ระหว่างการจัดส่ง"));
                }
                if (currentStatus === 'cancelled') {
                    return fail(new ApiError(400, "ไม่สามารถลบหรือแก้ไขสินค้าได้ เนื่องจากออเดอร์นี้ถุกยกเลิอกแล้ว"));
                }


                order_itemModel.updateitem_order(item_id, quantity, (err, updateResult) => {

                    if (err) { return fail(err) }

                    if (qtyDifference === 0) {
                        return success({
                            success: true,
                            message: `Update item_order successfully (No total amount changes)`
                        });
                    }
                    if (oldQuantity > quantity) {
                        orderModel.updateOrder_Decrement(order_id, priceDifference, (err, result) => {

                            if (err) { return fail(err) }

                            success({
                                success: true,
                                message: `Update item_order and Decrement total_amount successfully`
                            })
                        })
                    } else {
                        orderModel.updateOrder_Increment(order_id, priceDifference, (err, result) => {

                            if (err) { return fail(err) }

                            success({
                                success: true,
                                message: `Update item_order and Increment total_amount successfully`
                            })
                        })
                    }
                })

            })
        })
    })
}

const delete_itemsOrder = async (item_id) => {
    return new Promise((success, fail) => {
        order_itemModel.findOneitem_order(item_id, (err, result) => {
            if (err) { return fail(err) }
            //ดึงค่าทุกตัว
            // const order_id = result[0].order_id;
            // const quantity = result[0].quantity;
            // const unit_price = result[0].unit_price;

            const {order_id,quantity,unit_price}=result[0];
            const subtotal = quantity*unit_price;
            if (!order_id || !unit_price) { return fail(new ApiError(400, "unit_price and order_id are missiing")) }

            order_itemModel.deleteOrder_item(item_id, (err, result) => {

                if (err) { return fail(err) }

                order_itemModel.findAllbyOrder_id(order_id, (err, result) => {
                    if (err) { return fail(err) }

                    if (result.length === 0) {
                        orderModel.deleteOrder(order_id, (err, result) => {
                            if (err) { return fail(err) }

                            success({
                                success: true,
                                message: "Delete successfully"
                            })
                        })
                    } else {
                        orderModel.updatetotal_amount(order_id, subtotal, (err, result) => {
                            if (err) { return fail(err) }

                            success({
                                success: true,
                                message: "Delete successfully"
                            })
                        })
                    }
                })
            })
        })

    })
}

module.exports = {
    update_itemOrder,
    delete_itemsOrder
}