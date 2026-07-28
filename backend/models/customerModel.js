const db =require('../configs/db')

//หาลูกค้า
const findAllCustomer = async(callback)=>{
    const sql = "SELECT * FROM customers"
    db.query(sql ,callback);
}

//create
const createCustomer = async(customerdata ,callback)=>{
    const sql="INSERT INTO customers set ?"
    db.query(sql,customerdata,callback);
}
//update
const updateCustomer =async(customerdata,customer_id,callback)=>{
    const sql="UPDATE customers set ? where customer_id= ? "
    db.query(sql,[customerdata,customer_id],callback);
}
//delete
const deleteCustomer =async(customer_id,callback)=>{
    const sql="DELETE FROM customers where customer_id =?"
    db.query(sql,[customer_id],callback);
}

module.exports ={
    findAllCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
}