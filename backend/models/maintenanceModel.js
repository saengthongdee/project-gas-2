const db = require('../configs/db')

const findAllMaintenance = (callback) => {

    const sql =  
    `
        select * from maintenance
    `
    db.query(sql , callback)
}

const deleteMaintenance = (id , callback) => {

    const sql = 
    `
        delete from maintenance where maintenance_id = ?
    `
    db.query(sql , [id] , callback)
}

const createMaintenance = (MaintenanceData , callback) => {

    const sql = 
    `
        insert into maintenance set ? 
    `
    db.query(sql , MaintenanceData , callback)
}

module.exports = {
    findAllMaintenance,
    deleteMaintenance,
    createMaintenance
}