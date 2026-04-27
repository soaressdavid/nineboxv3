const express = require('express');
const {
    createAvaliacaoController,
    getAvaliacaoByIdController,
    listarAvaliacoesController,
    listarTodasAvaliacoesController,
    listAvaliacoesComStatusController,
    listarAvaliacoesUsuarioController,
} = require('../controllers/avaliacaoController');
const { validarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createAvaliacaoController);
router.get('/user', validarToken, listarAvaliacoesUsuarioController);
router.get('/status/all', listAvaliacoesComStatusController);
router.get('/manager/:managerId', listarAvaliacoesController);
router.get('/:id', getAvaliacaoByIdController);
router.get('/', listarTodasAvaliacoesController);

module.exports = router;
