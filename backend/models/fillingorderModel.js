const db=require('../configs/db')

const findAllFillingorder = async(callback)=>{
    const sql="SELECT * from filling_orders"
    db.query(sql,callback);
}

const createFillingorder = async(fillingdata ,callback)=>{
    const sql="INSERT INTO filling_orders set ?"
    db.query(sql,fillingdata,callback);
}
const updateFillingorder =async(fillingdata,filling_order_id,callback)=>{
    const sql="UPDATE filling_orders set ? where filling_order_id= ? "
    db.query(sql,[fillingdata,filling_order_id],callback);
}
const deleteFillingorder =async(filling_order_id,callback)=>{
    const sql="DELETE FROM filling_orders where filling_order_id =?"
    db.query(sql,[filling_order_id],callback);
}

module.exports={
    findAllFillingorder,
    createFillingorder,
    updateFillingorder,
    deleteFillingorder
}