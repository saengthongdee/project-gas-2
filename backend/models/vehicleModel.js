const db=require('../configs/db');


const findAllVehicle = async(callback)=>{
    const sql=`SELECT * FROM vehicles v
	join vehicle_brands vb
		on v.brand_id = vb.brand_id`
    db.query(sql,callback);
}
const createVehicle = async(vehicledata,callback)=>{
    const sql="INSERT INTO vehicles set ?"
    db.query(sql,vehicledata,callback);
}
const updateVehicle =async(vehicledata,vehicle_id,callback)=>{
    const sql="UPDATE vehicles set ? where vehicle_id= ?"
    db.query(sql,[vehicledata,vehicle_id],callback);
}
const deleteVehicle =async(vehicle_id,callback)=>{
    const sql="DELETE from vehicles where vehicle_id= ?"
    db.query(sql[vehicle_id],callback);
}

module.exports={
    findAllVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle

}