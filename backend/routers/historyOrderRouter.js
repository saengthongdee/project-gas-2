const express = require('express')
const router = express.Router()

const { findAllhistoryOrder} = require('../controller/historyOrderControllers')

router.get('/' , findAllhistoryOrder)

module.exports = router