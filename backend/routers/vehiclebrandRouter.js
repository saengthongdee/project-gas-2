const express =require('express')
const {findAllVehiclebrand, createVehiclebrand ,updateVehiclebrand, deleteVehiclebrand} = require('../controller/vehiclebrandController')
const { createVehicle } = require('../services/vehicleService')
const router =express.Router()

router.get('/',findAllVehiclebrand)
router.post('/',createVehiclebrand)
router.put('/:id',updateVehiclebrand)
router.delete('/:id',deleteVehiclebrand)

module.exports=router