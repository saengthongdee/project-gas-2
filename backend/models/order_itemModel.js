const db = require('../configs/db')

const Createitem_order = (order_id , itemData , callback) => {

    if (!itemData || itemData.length === 0) {
        return callback(null, { affectedRows: 0, message: "No items to insert" });
    }

    const values = itemData.map(item => [

        order_id,
        item.product_id,
        item.quantity,
        item.unit_price,
    ])

    const sql  = `INSERT INTO order_items
        (order_id , product_id , quantity , unit_price)
        values ?`

    db.query(sql , [values] , callback)
}

const updateitem_order = (item_id , quantity , callback) => {

    const sql = "Update  order_items set quantity = ? where item_id = ?"

    db.query(sql ,[quantity , item_id] , callback)
}
const findOneitem_order = (item_id , callback) => {

    const sql = "select * from order_items where item_id =?"

    db.query(sql , item_id , callback)
}

const findAllitem = (callback)=>{
    const sql =`select oi.item_id,oi.order_id,p.product_name,oi.quantity,oi.unit_price,round((oi.unit_price * oi.quantity),2) as subtotal 
    from order_items oi join products p
		on oi.product_id = p.product_id;`

        db.query(sql,callback)
}
const deleteOrder_item = (item_id,callback)=>{
    const sql="delete from order_items where item_id = ?"
    db.query(sql,item_id,callback)
}
const findAllbyOrder_id = (order_id,callback)=>{
    const sql="select * from order_items where order_id = ?"
    db.query(sql,order_id,callback)
}


module.exports = {
    Createitem_order,
    updateitem_order,
    findOneitem_order,
    findAllitem,
    deleteOrder_item,
    findAllbyOrder_id,

}