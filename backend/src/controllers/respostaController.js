const {
    salvarResposta,
    getRespostasByAvaliacaoAndEmployee,
    getRespostasByAvaliacao,
    getDashboardData
} = require('../services/respostaService');
const { controllerError } = require('../utils/controllerError');

async function salvarRespostaController(req, res) {
    try {
        const { evaluationId, employeeId, competencyId, response, observation } = req.body;
        const result = await salvarResposta({ evaluationId, employeeId, competencyId, response, observation });
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function getRespostasByAvaliacaoAndEmployeeController(req, res) {
    try {
        const { idAvaliacao, cpfAvaliado } = req.params;
        const result = await getRespostasByAvaliacaoAndEmployee(idAvaliacao, cpfAvaliado);
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function getRespostasByAvaliacaoController(req, res) {
    try {
        const { idAvaliacao } = req.params;
        const result = await getRespostasByAvaliacao(idAvaliacao);
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

async function getDashboardDataController(req, res) {
    try {
        const { idAvaliacao } = req.params;
        const result = await getDashboardData(idAvaliacao);
        res.json(result);
    } catch (error) {
        controllerError(res, error);
    }
}

module.exports = {
    salvarRespostaController,
    getRespostasByAvaliacaoAndEmployeeController,
    getRespostasByAvaliacaoController,
    getDashboardDataController
};
