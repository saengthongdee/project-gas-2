const order_itemModel = require('../models/order_itemModel')
const orderModel = require('../models/orderModel');
const ApiError = require('../utils/ApiError')

const updateMultipleItemOrders = async (order_id, items) => {

    return new Promise((resolve, reject) => {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return reject(new ApiError(400, "Items array is required"));
        }

        // 1. ตรวจสอบสถานะออเดอร์ก่อน (ใช้ Model เดิม: orderModel.delivery_status)
        orderModel.delivery_status(order_id, (err, statusResult) => {
            if (err) { return reject(err); }

            if (!statusResult || statusResult.length === 0) {
                return reject(new ApiError(404, "ไม่พบรายการสินค้านี้ในระบบ"));
            }

            const currentStatus = statusResult[0].delivery_status;

            if (currentStatus === 'delivered') {
                return reject(new ApiError(400, "ไม่สามารถลบหรือแก้ไขสินค้าได้ เนื่องจากออเดอร์นี้ถูกจัดส่งสำเร็จแล้ว"));
            }
            if (currentStatus === 'delivering') {
                return reject(new ApiError(400, "ไม่สามารถลบหรือแก้ไขสินค้าได้ เนื่องจากออเดอร์นี้อยู่ระหว่างการจัดส่ง"));
            }
            if (currentStatus === 'cancelled') {
                return reject(new ApiError(400, "ไม่สามารถลบหรือแก้ไขสินค้าได้ เนื่องจากออเดอร์นี้หูกยกเลิกแล้ว"));
            }

            // 2. วนลูปประมวลผลทีละ item ในอาเรย์ โดยใช้ Model เดิม
            let processedCount = 0;
            let totalNetDifference = 0; // ผลต่างยอดเงินรวมทั้งหมด (ถ้ามี)
            let hasError = false;

            items.forEach((itemInput) => {
                const { item_id, quantity, unit_price } = itemInput;

                if (!item_id || quantity === undefined || quantity < 0) {
                    hasError = true;
                    return reject(new ApiError(400, "item_id and valid quantity are required for each item"));
                }

                // ใช้ Model เดิม: ค้นหาข้อมูล item เก่า
                order_itemModel.findOneitem_order(item_id, (err, result) => {
                    if (hasError) return;
                    if (err) {
                        hasError = true;
                        return reject(err);
                    }

                    if (!result || result.length === 0) {
                        hasError = true;
                        return reject(new ApiError(404, `Not found item_order ID: ${item_id}`));
                    }

                    const oldQuantity = result[0].quantity;
                    const pricePerUnit = unit_price || result[0].unit_price;

                    if (!pricePerUnit) {
                        hasError = true;
                        return reject(new ApiError(400, "unit_price is missing"));
                    }

                    const qtyDifference = quantity - oldQuantity;
                    const priceDifference = Math.abs(qtyDifference * pricePerUnit);

                    // ใช้ Model เดิม: อัปเดตจำนวนสินค้าใน item_order
                    order_itemModel.updateitem_order(item_id, quantity, (err, updateResult) => {
                        if (hasError) return;
                        if (err) {
                            hasError = true;
                            return reject(err);
                        }

                        // จัดการเพิ่ม/ลด ยอดรวมของออเดอร์ตามส่วนต่าง
                        if (qtyDifference !== 0) {
                            if (oldQuantity > quantity) {
                                orderModel.updateOrder_Decrement(order_id, priceDifference, (err) => {
                                    if (err && !hasError) {
                                        hasError = true;
                                        return reject(err);
                                    }
                                    checkCompletion();
                                });
                            } else {
                                orderModel.updateOrder_Increment(order_id, priceDifference, (err) => {
                                    if (err && !hasError) {
                                        hasError = true;
                                        return reject(err);
                                    }
                                    checkCompletion();
                                });
                            }
                        } else {
                            checkCompletion();
                        }
                    });
                });
            });

            function checkCompletion() {
                if (hasError) return;
                processedCount++;
                if (processedCount === items.length) {
                    resolve({
                        success: true,
                        message: "Update all order items successfully"
                    });
                }
            }
        });
    });
};

const delete_itemsOrder = async (item_id) => {
    return new Promise((success, fail) => {
        order_itemModel.findOneitem_order(item_id, (err, result) => {
            
            if (err) { return fail(err) }

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
    updateMultipleItemOrders,
    delete_itemsOrder
}