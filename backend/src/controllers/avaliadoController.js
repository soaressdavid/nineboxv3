const {
    listAvaliados,
    createAvaliado,
    updateAvaliado,
    getAvaliadoByRa,
    deleteAvaliado
} = require('../services/avaliadoService');
const { controllerError } = require('../utils/controllerError');

async function listAvaliadosController(req, res) {
    try {
        const result = await listAvaliados();
        res.status(200).json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function createAvaliadoController(req, res) {
    try {
        const { nome, email, ra, empresa, cpf_gestor } = req.body;
        const result = await createAvaliado({ nome, email, ra, empresa, cpf_gestor });
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function updateAvaliadoController(req, res) {
    try {
        const { ra } = req.params;
        const { nome, email, empresa, cpf_gestor } = req.body;
        const result = await updateAvaliado(ra, { nome, email, empresa, cpf_gestor });
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function getAvaliadoByRaController(req, res) {
    try {
        const { ra } = req.params;
        const result = await getAvaliadoByRa(ra);
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function deleteAvaliadoController(req, res) {
    try {
        const { id } = req.params;
        const result = await deleteAvaliado(id);
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

module.exports = {
    listAvaliadosController,
    createAvaliadoController,
    updateAvaliadoController,
    getAvaliadoByRaController,
    deleteAvaliadoController,
};
