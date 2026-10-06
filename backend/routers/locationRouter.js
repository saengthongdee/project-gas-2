const express = require('express')
const router = express.Router()

const {findStorelocation} = require('../controller/locationControllers')

router.get('/', findStorelocation)
router.put('/', updateStorelocation)
router.delete('/', deleteStorelocation)

module.exports = router