const express = require('express');
const {
    salvarRespostaController,
    getRespostasByAvaliacaoAndEmployeeController,
    getRespostasByAvaliacaoController,
    getDashboardDataController
} = require('../controllers/respostaController');

const router = express.Router();

router.post('/', salvarRespostaController);

// FIX: /dashboard/:idAvaliacao DEVE vir antes de /:idAvaliacao
// Antes, o Express capturava "dashboard" como idAvaliacao e a rota de dashboard nunca era atingida
router.get('/dashboard/:idAvaliacao', getDashboardDataController);
router.get('/:idAvaliacao/:cpfAvaliado', getRespostasByAvaliacaoAndEmployeeController);
router.get('/:idAvaliacao', getRespostasByAvaliacaoController);

module.exports = router;
