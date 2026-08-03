const order_itemModel = require('../models/order_itemModel')
const orderModel = require('../models/orderModel');
const ApiError = require('../utils/ApiError')

const updateMultipleItemOrders = async (order_id, items) => {
    return new Promise((resolve, reject) => {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return reject(new ApiError(400, "Items array is required"));
        }

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
                return reject(new ApiError(400, "ไม่สามารถลบหรือแก้ไขสินค้าได้ เนื่องจากออเดอร์นี้ถูกยกเลิกแล้ว"));
            }

            let processedCount = 0;
            let hasError = false;

            items.forEach((itemInput) => {
                const { item_id, product_id, quantity, unit_price } = itemInput;

                // ==========================================
                // เคสที่ 1: เพิ่มรายการใหม่ (ไม่มี item_id แต่มี product_id)
                // ==========================================
                if (!item_id && product_id) {
                    if (quantity === undefined || quantity <= 0 || !unit_price) {
                        hasError = true;
                        return reject(new ApiError(400, "valid quantity and unit_price are required for new items"));
                    }

                    // 1.1 เพิ่มรายการใหม่ลง order_items
                    order_itemModel.Createitem_order(order_id, [{ product_id, quantity, unit_price }], (err, insertResult) => {
                        if (hasError) return;
                        if (err) {
                            hasError = true;
                            return reject(err);
                        }

                        // 1.2 คำนวณราคารวมของรายการใหม่เพื่อนำไปบวกเพิ่มใน Order
                        const addedTotalPrice = quantity * unit_price;

                        orderModel.updateOrder_Increment(order_id, addedTotalPrice, (err) => {
                            if (err && !hasError) {
                                hasError = true;
                                return reject(err);
                            }
                            checkCompletion();
                        });
                    });

                // ==========================================
                // เคสที่ 2: แก้ไขรายการเดิม (มี item_id)
                // ==========================================
                } else if (item_id) {
                    if (quantity === undefined || quantity < 0) {
                        hasError = true;
                        return reject(new ApiError(400, "valid quantity is required for each item"));
                    }

                    // 2.1 ค้นหาข้อมูล item เก่า
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

                        // 2.2 อัปเดตจำนวนสินค้าใน item_order
                        order_itemModel.updateitem_order(item_id, quantity, (err, updateResult) => {
                            if (hasError) return;
                            if (err) {
                                hasError = true;
                                return reject(err);
                            }

                            // 2.3 จัดการเพิ่ม/ลด ยอดรวมของออเดอร์ตามส่วนต่าง
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

                // ==========================================
                // เคสที่ 3: ข้อมูลไม่ครบถ้วน
                // ==========================================
                } else {
                    hasError = true;
                    return reject(new ApiError(400, "Each item must have either item_id (for update) or product_id (for insert)"));
                }
            });

            function checkCompletion() {
                if (hasError) return;
                processedCount++;
                if (processedCount === items.length) {
                    resolve({
                        success: true,
                        message: "Processed all order items successfully"
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