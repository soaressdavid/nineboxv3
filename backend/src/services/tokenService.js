const crypto = require('crypto');
const { tokenSecret } = require('../config/env');

function gerarToken(payload) {
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const assinatura = crypto
        .createHmac('sha256', tokenSecret)
        .update(base64Payload)
        .digest('hex');

    return `${base64Payload}.${assinatura}`;
}

function validarAssinatura(token) {
    const [base64Payload, assinaturaRecebida] = token.split('.');
    const assinaturaEsperada = crypto
        .createHmac('sha256', tokenSecret)
        .update(base64Payload)
        .digest('hex');

    return {
        base64Payload,
        assinaturaRecebida,
        assinaturaEsperada
    };
}

module.exports = {
    gerarToken,
    validarAssinatura
};