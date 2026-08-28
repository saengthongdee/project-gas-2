const express = require('express');
const router = express.Router();

const {
    findAllMaintenance,
    createMaintenance,
    deleteMaintenance
} = require('../controller/maintenenceController');

router.get('/', findAllMaintenance);
router.post('/', createMaintenance);
router.delete('/:id', deleteMaintenance);

module.exports = router;