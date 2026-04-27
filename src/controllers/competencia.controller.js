const competenciaService = require('../services/competencia.service.js');

async function listar(req, res, next) {
  try {
    const { competenciaDe, search } = req.query;
    const competencias = await competenciaService.listar({ competenciaDe, search });

    return res.status(200).json(competencias);
  } catch (error) {
    next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const { id } = req.params;
    const competencia = await competenciaService.buscarPorId(id);

    return res.status(200).json(competencia);
  } catch (error) {
    next(error);
  }
}

async function criar(req, res, next) {
  try {
    const competencia = await competenciaService.criar(req.body);

    return res.status(201).json({
      message: 'Competência criada com sucesso!',
      competencia
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const { id } = req.params;
    await competenciaService.atualizar(id, req.body);

    return res.status(200).json({
      message: 'Competência atualizada com sucesso!'
    });
  } catch (error) {
    next(error);
  }
}

async function remover(req, res, next) {
  try {
    const { id } = req.params;
    await competenciaService.remover(id);

    return res.status(200).json({
      message: 'Competência removida com sucesso!'
    });
  } catch (error) {
    next(error);
  }
}

async function listarPorAvaliacaoColaboradores(req, res, next) {
  try {
    const { id } = req.params;
    const competencias = await competenciaService.listarPorAvaliacaoColaboradores(id);

    return res.status(200).json({ competencias });
  } catch (error) {
    next(error);
  }
}

async function listarPorAvaliacaoGestor(req, res, next) {
  try {
    const { id } = req.params;
    const competencias = await competenciaService.listarPorAvaliacaoGestor(id);

    return res.status(200).json({ competencias });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover,
  listarPorAvaliacaoColaboradores,
  listarPorAvaliacaoGestor
};