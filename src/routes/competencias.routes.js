const express = require('express');
const competenciaController = require('../controllers/competencia.controller.js');

const router = express.Router();

router.get('/avaliacoes/:id/colaboradores', competenciaController.listarPorAvaliacaoColaboradores);
router.get('/avaliacoes/:id/gestor', competenciaController.listarPorAvaliacaoGestor);

router.get('/', competenciaController.listar);
router.get('/:id', competenciaController.buscarPorId);
router.post('/', competenciaController.criar);
router.put('/:id', competenciaController.atualizar);
router.delete('/:id', competenciaController.remover);

module.exports = router;