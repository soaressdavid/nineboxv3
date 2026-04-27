const respostaService = require('../services/resposta.service.js');

async function listarPendentesDoAvaliado(req, res, next) {
  try {
    const ra = req.usuario?.ra;
    const pendentes = await respostaService.listarPendentesDoAvaliado(ra);

    return res.status(200).json({ avaliacoes: pendentes });
  } catch (error) {
    next(error);
  }
}

async function listarPendentesDoGestor(req, res, next) {
  try {
    const ra = req.usuario?.ra;
    const pendentes = await respostaService.listarPendentesDoGestor(ra);

    return res.status(200).json({ avaliacoes: pendentes });
  } catch (error) {
    next(error);
  }
}

async function carregarFormularioDoAvaliado(req, res, next) {
  try {
    const ra = req.usuario?.ra;
    const { grupo180 } = req.params;

    const formulario = await respostaService.carregarFormularioDoAvaliado({
      grupo180,
      raAvaliado: ra
    });

    return res.status(200).json(formulario);
  } catch (error) {
    next(error);
  }
}

async function carregarFormularioDoGestor(req, res, next) {
  try {
    const ra = req.usuario?.ra;
    const { grupo180 } = req.params;

    const formulario = await respostaService.carregarFormularioDoGestor({
      grupo180,
      raGestor: ra
    });

    return res.status(200).json(formulario);
  } catch (error) {
    next(error);
  }
}

async function salvarRespostaDoAvaliado(req, res, next) {
  try {
    const ra = req.usuario?.ra;
    const resultado = await respostaService.salvarRespostaDoAvaliado({
      raAvaliado: ra,
      ...req.body
    });

    return res.status(201).json({
      message: 'Resposta do avaliado salva com sucesso!',
      ...resultado
    });
  } catch (error) {
    next(error);
  }
}

async function salvarRespostaDoGestor(req, res, next) {
  try {
    const ra = req.usuario?.ra;
    const resultado = await respostaService.salvarRespostaDoGestor({
      raGestor: ra,
      ...req.body
    });

    return res.status(201).json({
      message: 'Resposta do gestor salva com sucesso!',
      ...resultado
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarPendentesDoAvaliado,
  listarPendentesDoGestor,
  carregarFormularioDoAvaliado,
  carregarFormularioDoGestor,
  salvarRespostaDoAvaliado,
  salvarRespostaDoGestor
};