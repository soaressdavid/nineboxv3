const express = require('express');
const {
    createGestorController,
    listGestoresController,
    updateGestorController,
    getGestorByCpfController
} = require('../controllers/gestorController');

const router = express.Router();

router.get('/', listGestoresController);
router.post('/', createGestorController);
router.put('/:id', updateGestorController);
router.get('/:cpf', getGestorByCpfController);

module.exports = router;
