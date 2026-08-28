const db = require('../configs/db')

const findALlFillingOrder = (callback) => {

    const sql = 
    `
        select * from filling_orders
    `
    db.query(sql ,callback)
}

const deletefillingOrder = (id , callback) => {

    const sql = 
    `
        delete from filling_orders where filling_order_id = ?
    `
    db.query(sql , [id] , callback)
}
const createfillingOrder = (fillingData , callback) => {

    const sql =    
    `
        insert into filling_orders set ?
    `
    db.query(sql , fillingData , callback)

}

module.exports = {
    findALlFillingOrder,
    deletefillingOrder,
    createfillingOrder
}
