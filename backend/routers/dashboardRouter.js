const express = require('express')
const router = express.Router()

const {findAlldashboard , findDashboard2} = require('../controller/dashboardController')

router.get('/', findAlldashboard)
router.post('/month' , findDashboard2)

module.exports = router