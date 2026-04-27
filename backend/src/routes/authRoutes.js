const express = require('express');
const {
    loginController,
    loginUsuarioController,
} = require('../controllers/authController');
const { validarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginController);
router.post('/loginUsuario', loginUsuarioController);
router.get('/verify', validarToken, (req, res) => res.status(200).json({ message: 'Token válido' }));

module.exports = router;