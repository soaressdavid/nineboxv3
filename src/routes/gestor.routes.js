const express = require('express');
const gestorController = require('../controllers/gestor.controller');

const router = express.Router();

router.get('/', gestorController.listar);
router.post('/', gestorController.criar);
router.put('/:ra', gestorController.atualizar);

module.exports = router;