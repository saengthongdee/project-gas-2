const express = require('express')
const router = express.Router()

const{findAllCustomer,createCustomer,updateCustomer,deleteCustomer}=require('../controller/customerController')

router.get('/',findAllCustomer)
router.post('/',createCustomer)
router.put('/:id',updateCustomer)
router.delete('/:id',deleteCustomer)

module.exports=router