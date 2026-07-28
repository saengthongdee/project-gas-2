const db=require('../configs/db');

const bulkCreateDeposite = async(cylinderdepositdata,callback)=>{
    const sql=`
        insert into cylinder_deposit(customer_id,product_id,order_id,qty_out,qty_return,deposit_date)
        values ?
    `
    db.query(sql,[cylinderdepositdata],callback)
}
const findAllCylinderdeposit = async(callback)=>{
    const sql="SELECT * FROM cylinder_deposit"
    db.query(sql,callback);
}

//ต้องแก้ได้แค่ ถังคืนจากลูกค้า
const updateCylinderdeposit =async(deposit_id,order_id,qty_return,callback)=>{
    const sql=`
    update cylinder_deposit 
    set qty_return =?
    where deposit_id = ? and order_id = ?
    `
    db.query(sql,[qty_return,deposit_id,order_id],callback);
}
const deleteCylinderdeposit =async(deposit_id,callback)=>{
    const sql="DELETE from cylinder_deposit where deposit_id= ?"
    db.query(sql,[deposit_id],callback);
}

module.exports={
    bulkCreateDeposite,
    findAllCylinderdeposit,
    updateCylinderdeposit,
    deleteCylinderdeposit
}