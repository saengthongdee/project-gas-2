const db=require('../configs/db')

const findAllMaintenance = async(callback)=>{
    const sql="SELECT * from maintenance"
    db.query(sql,callback);
}

const createMaintenance = async(maintenancedata ,callback)=>{

    const sql="INSERT INTO maintenance set ?"
    
    db.query(sql,maintenancedata,callback);
}
const updateMaintenance =async(maintenencedata,maintenance_id,callback)=>{

    const sql="UPDATE maintenance set ? where maintenance_id= ? "

    db.query(sql,[maintenencedata,maintenance_id],callback);
}
const deleteMaintenance =async(maintenance_id,callback)=>{

    const sql="DELETE FROM maintenance where maintenance_id =?"

    db.query(sql,[maintenance_id],callback);
}

module.exports={
    findAllMaintenance,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance
}