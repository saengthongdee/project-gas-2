//กำหนดapi
const express = require('express')

const router = express.Router()

const {login,registerEmployee} =require('../controller/authController')

router.post('/login' , login)
router.post('/register',registerEmployee)
module.exports=router