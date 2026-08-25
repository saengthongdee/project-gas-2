const db = require('../configs/db')

const historyOrder = (callback) => {

    const sql = 
    `
        select o.order_id , o.order_date , o.total_amount , o.payment_method , o.delivery_status , c.customer_name , ofl.employee_name , ofl.items_snapshot ,o.imageUrl
        from orders o
            join customers c
                on o.customer_id  = c.customer_id
                    join order_fulfillment_log ofl
                        on o.order_id = ofl.order_id;  
    `

    db.query(sql , callback)
}

const createFulfillmentLog = (fulfillmentLogData , callback) => {

    const sql = 
    `
        insert into order_fulfillment_log set ? 
    `

    db.query(sql , fulfillmentLogData , callback)
}

const updatVehiclenameByName = (order_id ,employee_name, callback) => {

    const sql = "update order_fulfillment_log set employee_name = ? where order_id = ?"

    db.query(sql , [employee_name , order_id], callback)
}

module.exports = {
    historyOrder,
    createFulfillmentLog,
    updatVehiclenameByName
} 