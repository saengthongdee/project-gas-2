const fillingOrderModel = require('../models/fillingorderModel')
const ApiError = require('../utils/ApiError')

const findALlFillingOrder = () => {
    return new Promise((success, fail) => {
        fillingOrderModel.findALlFillingOrder((err, results) => {
            if (err) { return fail(err) }

            success({
                success: true,
                message: "Fetching data successfully",
                data: results
            })
        })
    })
}

const createFillingOrder = (data) => {
    return new Promise((success, fail) => {
        fillingOrderModel.createfillingOrder(data, (err, results) => {
            if (err) { return fail(err) }

            success({
                success: true,
                message: "Created successfully",
                data: results
            })
        })
    })
}

const deletefillingOrder = (id) => {
    return new Promise((success, fail) => {
        fillingOrderModel.deletefillingOrder(id, (err, results) => {

            if (err) { return fail(err) }

            success({
                success: true,
                message: "Deleted successfully",
                data: results
            })
        })
    })
}

module.exports = {
    findALlFillingOrder,
    createFillingOrder,
    deletefillingOrder
}