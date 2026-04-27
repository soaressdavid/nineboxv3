const {
  createAvaliacao,
  getAvaliacaoById,
  listarAvaliacoes,
  listarTodasAvaliacoes,
  listAvaliacoesComStatus,
} = require('../services/avaliacaoService');
const { controllerError } = require('../utils/controllerError');

async function createAvaliacaoController(req, res) {
  try {
    const {
      nomeAvaliacao,
      empresa,
      dataInicio,
      dataFim,
      descricao,
      textoFinal,
      criadorId,
      avaliados,
      competencias,
    } = req.body;
    const result = await createAvaliacao({
      nomeAvaliacao,
      empresa,
      dataInicio,
      dataFim,
      descricao,
      textoFinal,
      criadorId,
      avaliados,
      competencias,
    });
    res.json(result);
  } catch (error) {
    controllerError(res, error);
  }
}

async function getAvaliacaoByIdController(req, res) {
  try {
    const { id } = req.params;
    const result = await getAvaliacaoById(id);
    res.json(result);
  } catch (error) {
    controllerError(res, error);
  }
}

async function listarAvaliacoesController(req, res) {
  try {
    const { managerId } = req.params;
    const result = await listarAvaliacoes(managerId);
    res.json(result);
  } catch (error) {
    controllerError(res, error);
  }
}

async function listarTodasAvaliacoesController(req, res) {
  try {
    const result = await listarTodasAvaliacoes();
    res.json(result);
  } catch (error) {
    controllerError(res, error);
  }
}

async function listAvaliacoesComStatusController(req, res) {
  try {
    const result = await listAvaliacoesComStatus();
    res.json(result);
  } catch (error) {
    controllerError(res, error);
  }
}

async function listarAvaliacoesUsuarioController(req, res) {
  try {
    const { id, role } = req.usuario;
    // FIX: o token grava role 'manager', não 'gestor' — a comparação anterior nunca batia
    if (role === 'manager') {
      const result = await listarAvaliacoes(id);
      res.json(result);
    } else if (role === 'employee') {
      const result = await listarTodasAvaliacoes();
      res.json(result);
    } else {
      res.status(403).json({ message: 'Role não permitido' });
    }
  } catch (error) {
    controllerError(res, error);
  }
}

module.exports = {
  createAvaliacaoController,
  getAvaliacaoByIdController,
  listarAvaliacoesController,
  listarTodasAvaliacoesController,
  listAvaliacoesComStatusController,
  listarAvaliacoesUsuarioController,
};