const {
    createGestor,
    listGestores,
    updateGestor,
    getGestorByCpf
} = require('../services/gestorService');
const { controllerError } = require('../utils/controllerError');

async function createGestorController(req, res) {
    try {
        const { nome, cpf, email, empresa, senha } = req.body;
        const result = await createGestor({ nome, cpf, email, empresa, senha });
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function listGestoresController(req, res) {
    try {
        const result = await listGestores();
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function updateGestorController(req, res) {
    try {
        const { id } = req.params;
        const { nome, email, empresa } = req.body;
        const result = await updateGestor(id, { nome, email, empresa });
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function getGestorByCpfController(req, res) {
    try {
        const { cpf } = req.params;
        const result = await getGestorByCpf(cpf);
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

module.exports = {
    createGestorController,
    listGestoresController,
    updateGestorController,
    getGestorByCpfController
};
