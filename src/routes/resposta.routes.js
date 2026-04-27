const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const respostaController = require('../controllers/resposta.controller');

const router = express.Router();

router.get('/avaliado/pendentes', authMiddleware, respostaController.listarPendentesDoAvaliado);
router.get('/gestor/pendentes', authMiddleware, respostaController.listarPendentesDoGestor);

router.get('/avaliado/avaliacoes/:grupo180/formulario', authMiddleware, respostaController.carregarFormularioDoAvaliado);
router.get('/gestor/avaliacoes/:grupo180/formulario', authMiddleware, respostaController.carregarFormularioDoGestor);

router.post('/avaliado', authMiddleware, respostaController.salvarRespostaDoAvaliado);
router.post('/gestor', authMiddleware, respostaController.salvarRespostaDoGestor);

module.exports = router;