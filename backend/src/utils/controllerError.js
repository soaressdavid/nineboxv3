function controllerError(res, error, fallbackMessage = 'Erro no servidor') {
    if (error?.status && error?.payload) {
        return res.status(error.status).json(error.payload);
    }

    console.error(fallbackMessage, error);
    return res.status(500).json({
        message: fallbackMessage
    });
}

module.exports = {
    controllerError
};