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

module.exports = {
    historyOrder
} 