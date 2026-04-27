const { validarAssinatura } = require("../services/tokenService");

function validarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    // FIX: verificar header antes de split — antes crashava com TypeError: undefined.split
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ message: 'Token ausente.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res
            .status(401)
            .json({ message: 'Token ausente.' });
    }

    const { base64Payload, assinaturaRecebida, assinaturaEsperada } = validarAssinatura(token);

    if (assinaturaRecebida !== assinaturaEsperada) {
        return res
            .status(403)
            .json({
                message: 'Token inválido.'
        });
    }

    req.usuario = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
    next();
}

module.exports = {
    validarToken
};