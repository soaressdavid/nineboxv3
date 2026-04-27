const express = require('express');
const gestorRoutes = require('./gestor.routes');
const avaliadoRoutes = require('./avaliado.routes');
const competenciaRoutes = require('./competencias.routes');
const avaliacaoRoutes = require('./avaliacao.routes');
const respostaRoutes = require('./resposta.routes');

const router = express.Router();

router.use('/gestores', gestorRoutes);
router.use('/avaliados', avaliadoRoutes);
router.use('/competencias', competenciaRoutes);
router.use('/avaliacoes', avaliacaoRoutes);


module.exports = router;