const maintenenceModel = require('../models/maintenanceModel')
const ApiError=require('../utils/ApiError')

const findAllMaintenance = () => {

    return new Promise((success , fail) => {

        maintenenceModel.findAllMaintenance((err , result) => {

            if(err) {return fail(err)}

            success({
                success: true,
                message: "fetching maintenance successfully",
                data: result
            })
        })
    })
}

const createMaintenance = (data) => {

    return new Promise((success , fail) => {

        maintenenceModel.createMaintenance(data , (err , result) => {

            if(err) {return fail(err)}

            success({
                success: true,
                message: "created maintenanace successfully"
            })
        })
    })
}

const deleteMaintenance = (id) => {

    return new Promise((success , fail) => {

        maintenenceModel.deleteMaintenance(id , (err , result) => {

            if(err){return fail(err)}

            success({
                success: true,
                message: "delete maintenance successfully"
            })
        })
    })
}

module.exports ={
    findAllMaintenance,
    createMaintenance,
    deleteMaintenance
}