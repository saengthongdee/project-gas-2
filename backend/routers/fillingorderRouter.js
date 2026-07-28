const express = require('express');
const router = express.Router();

const {
    findAllFillingorder,
    createFillingorder,
    updateFillingorder,
    deleteFillingorder
} = require('../controller/fillingorderController');

router.get('/', findAllFillingorder);
router.post('/', createFillingorder);
router.put('/:id', updateFillingorder);
router.delete('/:id', deleteFillingorder);

module.exports = router;