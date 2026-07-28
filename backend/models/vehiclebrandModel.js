const db=require('../configs/db');
const { findAllProduct } = require('../controller/productController');

const findAllVehiclebrand = async(callback)=>{
    const sql="SELECT * FROM vehicle_brands"
    db.query(sql,callback);
}
const createVehiclebrand = async(vehiclebranddata,callback)=>{
    const sql="INSERT INTO vehicle_brands set ?"
    db.query(sql,vehiclebranddata,callback);
}
const updateVehiclebrand =async(vehiclebranddata,brand_id,callback)=>{
    const sql="UPDATE vehicle_brands set ? where brand_id= ?"
    db.query(sql,[vehiclebranddata,brand_id],callback);
}
const deleteVehiclebrand =async(brand_id,callback)=>{
    const sql="DELETE from vehicle_brans where brand_id= ?"
    db.query(sql[brand_id],callback);
}

module.exports={
    findAllVehiclebrand,
    createVehiclebrand,
    updateVehiclebrand,
    deleteVehiclebrand
}