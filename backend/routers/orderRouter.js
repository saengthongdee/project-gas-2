const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/authMiddleware')
const {createOrders,findAllOrders}=require('../controller/orderController')

//router.use(authMiddleware)

router.get('/',findAllOrders)
router.post('/',createOrders)

module.exports= router