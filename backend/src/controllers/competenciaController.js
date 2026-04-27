const {
    createCompetencia,
    listCompetencias,
    getCompetenciaById,
    getCompetenciasByAvaliacao,
} = require('../services/competenciaService');
const { controllerError } = require('../utils/controllerError');

async function createCompetenciaController(req, res) {
    try {
        const {
        competencia,
        tipo,
        descricao,
        ideal,
        bom,
        mediano,
        a_melhorar,
        } = req.body;
        const result = await createCompetencia({
        competencia,
        tipo,
        descricao,
        ideal,
        bom,
        mediano,
        a_melhorar,
        });
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function listCompetenciasController(req, res) {
    try {
        const result = await listCompetencias();
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function getCompetenciaByIdController(req, res) {
    try {
        const { id } = req.params;
        const result = await getCompetenciaById(id);
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function getCompetenciasByAvaliacaoController(req, res) {
    try {
        const { idAvaliacao } = req.params;
        const result = await getCompetenciasByAvaliacao(idAvaliacao);
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

module.exports = {
    createCompetenciaController,
    listCompetenciasController,
    getCompetenciaByIdController,
    getCompetenciasByAvaliacaoController,
};