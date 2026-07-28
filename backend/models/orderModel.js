const db=require('../configs/db')

const createOrder = async(orderdata,callback)=>{
    const sql ="INSERT INTO orders set ?"
    db.query(sql,orderdata,callback);
}

const updateOrder_Decrement = (order_id,total_amount,callback)=>{
    const sql = "UPDATE orders set total_amount = total_amount - ? where order_id =?"
    db.query(sql,[total_amount,order_id],callback)
}
const updateOrder_Increment = (order_id,total_amount,callback)=>{
    const sql = "UPDATE orders set total_amount = total_amount + ? where order_id =?"
    db.query(sql,[total_amount,order_id],callback)
}

const findAllOrder =(callback)=>{
    const sql=`select o.order_id,e.employee_id,o.total_amount,e.name,v.license_plate from orders o
	join vehicles v
            on o.vehicle_id = v.vehicle_id
	    join employees e
            on e.vehicle_id =v.vehicle_id
                join customers c
                    on c.customer_id =o.customer_id;`
                    db.query(sql,callback)
}
const updatetotal_amount=(order_id,amount,callback)=>{

    const sql="update orders set total_amount = total_amount - ? where order_id = ?"
    db.query(sql,[amount,order_id],callback)

}
const deleteOrder=(order_id,callback)=>{
    const sql="delete from orders where order_id = ?"
    db.query(sql,order_id,callback)
}
const delivery_status = (order_id,callback)=>{
    const sql ="select delivery_status from orders where order_id = ?"
    db.query(sql,order_id,callback)
}

module.exports={
    createOrder,
    updateOrder_Decrement,
    updateOrder_Increment,
    findAllOrder,
    updatetotal_amount,
    deleteOrder,
    delivery_status
}