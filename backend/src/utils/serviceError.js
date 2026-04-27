function serviceError(status, payload) {
    const error = new Error(payload?.message || 'Erro no servidor.');
    error.status = status;
    error.payload = payload;
    return error;
}

module.exports = {
    serviceError
};