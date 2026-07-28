const express = require('express');
const router = express.Router();

const {
    findAllMaintenence,
    createMaintenence,
    updateMaintenence,
    deleteMaintenence
} = require('../controller/maintenenceController');

router.get('/', findAllMaintenence);
router.post('/', createMaintenence);
router.put('/:id', updateMaintenence);
router.delete('/:id', deleteMaintenence);

module.exports = router;