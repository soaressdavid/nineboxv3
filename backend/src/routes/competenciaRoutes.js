const express = require('express');
const {
    createCompetenciaController,
    listCompetenciasController,
    getCompetenciaByIdController,
    getCompetenciasByAvaliacaoController,
} = require('../controllers/competenciaController');

const router = express.Router();

router.get('/', listCompetenciasController);
router.post('/', createCompetenciaController);

// FIX: /avaliacao/:idAvaliacao DEVE vir antes de /:id
// Antes, "avaliacao" era interpretado como id e a rota de avaliacao nunca era atingida
router.get('/avaliacao/:idAvaliacao', getCompetenciasByAvaliacaoController);
router.get('/:id', getCompetenciaByIdController);

module.exports = router;
