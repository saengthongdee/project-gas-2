const express =require('express')
const router =express.Router()

const{findAllVehicle,createVehicle,updateVehicle,deleteVehicle , findVehicleISNull}=require('../controller/vehicleController')
router.get('/',findAllVehicle)
router.post('/',createVehicle)
router.put('/:id',updateVehicle)
router.delete('/:id',deleteVehicle)
router.get('/null',findVehicleISNull)

module.exports=router
