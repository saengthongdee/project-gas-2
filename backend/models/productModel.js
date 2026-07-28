const db = require('../configs/db')

const findAllProduct =async(callback)=>{
    const sql ="SELECT * FROM products"
    db.query(sql,callback);
}

const createProduct =async(productdata,callback)=>{
    const sql="INSERT INTO products set ?"
    db.query(sql,productdata,callback);
}

const updateProduct = async(productdata,product_id,callback)=>{
    const sql="UPDATE products set ? where product_id= ?"
    db.query(sql,[productdata,product_id],callback);
}

const deleteProduct = async(product_id,callback)=>{
    const sql="DELETE from products where product_id= ?"
    db.query(sql,[product_id],callback);
}
module.exports={
    findAllProduct,
    createProduct,
    updateProduct,
    deleteProduct
}