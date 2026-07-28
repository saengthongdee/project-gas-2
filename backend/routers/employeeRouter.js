const express = require('express')
const router =express.Router()

const{findAllEmployee,createEmployee,updateEmployee,deleteEmployee , ChangPassword}=require('../controller/employeeController')

router.get('/',findAllEmployee)
router.post('/',createEmployee)
router.put('/:id',updateEmployee)
router.delete('/:id',deleteEmployee)
router.put('/:id/password' , ChangPassword)

module.exports=router