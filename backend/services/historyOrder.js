const historyOrder = require('../models/historyOrder')
const ApiError = require('../utils/ApiError')

const findAllhistoryOrder = async () => {

    return new Promise((success , fail) => {

        historyOrder.historyOrder((err , results) => {

            if(err) {return fail(err)}

            success({
                success:true,
                message: "fetching histortorder successfully",
                data: results
            })
        })
    })
}
module.exports = {
    findAllhistoryOrder
}