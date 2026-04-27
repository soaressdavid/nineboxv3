const avaliacaoService = require('../services/avaliacao.service.js');

async function criarAvaliacao180(req, res, next) {
  try {
    const resultado = await avaliacaoService.criarAvaliacao180(req.body);

    return res.status(201).json({
      message: 'Avaliação 180 criada com sucesso!',
      ...resultado
    });
  } catch (error) {
    next(error);
  }
}

async function listarAvaliacoes180(req, res, next) {
  try {
    const avaliacoes = await avaliacaoService.listarAvaliacoes180(req.query);
    return res.status(200).json({ avaliacoes });
  } catch (error) {
    next(error);
  }
}

async function buscarResumoAvaliacao180(req, res, next) {
  try {
    const { grupo180 } = req.params;
    const resumo = await avaliacaoService.buscarResumoAvaliacao180(grupo180);

    return res.status(200).json(resumo);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  criarAvaliacao180,
  listarAvaliacoes180,
  buscarResumoAvaliacao180
};