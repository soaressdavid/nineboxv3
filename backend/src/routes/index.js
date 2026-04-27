const express = require('express');
const authRoutes = require('./authRoutes');
const avaliadoRoutes = require('./avaliadoRoutes');
const gestorRoutes = require('./gestorRoutes');
const competenciaRoutes = require('./competenciaRoutes');
const avaliacaoRoutes = require('./avaliacaoRoutes');
const respostasRoutes = require('./respostasRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/avaliados', avaliadoRoutes);
router.use('/gestores', gestorRoutes);
router.use('/competencias', competenciaRoutes);
router.use('/avaliacoes', avaliacaoRoutes);
router.use('/respostas', respostasRoutes);

module.exports = router;