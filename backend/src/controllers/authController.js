const { login, loginUsuario } = require('../services/authService');
const { controllerError } = require('../utils/controllerError');

async function loginController(req, res) {
    try {
        const { email, password, accessType} = req.body;
        const result = await login({ email, password, accessType});

        return res
            .status(200)
            .json(result);
    } catch (error) {
        return controllerError(res, error);
    }
}

async function loginUsuarioController(req, res) {
    try {
        const { cpf, tipoCargo } = req.body;
        const result = await loginUsuario({
                cpf,
                tipoCargo
            });
        return res.status(200).json(result);

    } catch (error) {
        controllerError(res, error)
    }
}

module.exports = {
    loginController,
    loginUsuarioController
};