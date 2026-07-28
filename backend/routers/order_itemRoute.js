const express = require('express')
const router=express.Router()

const{updateOrder_item,deleteOrder_item}=require('../controller/order_itemController')

router.put('/:id',updateOrder_item);
router.delete('/:id',deleteOrder_item);
module.exports=router