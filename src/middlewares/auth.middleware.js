const { validarToken } = require('../utils/token');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token ausente.' });
    }

    req.usuario = validarToken(token);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
}

module.exports = authMiddleware;