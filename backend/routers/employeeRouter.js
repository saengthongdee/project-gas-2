const express = require('express')
const router =express.Router()

const{findAllEmployee,createEmployee,updateEmployee,deleteEmployee}=require('../controller/employeeController')

router.get('/',findAllEmployee)
router.post('/',createEmployee)
router.put('/:id',updateEmployee)
router.delete('/:id',deleteEmployee)

module.exports=router