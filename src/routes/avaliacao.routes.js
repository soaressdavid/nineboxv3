const express = require('express');
const avaliacaoController = require('../controllers/avaliacao.controller.js');

const router = express.Router();

router.post('/180', avaliacaoController.criarAvaliacao180);
router.get('/180', avaliacaoController.listarAvaliacoes180);
router.get('/180/:grupo180', avaliacaoController.buscarResumoAvaliacao180);

module.exports = router;