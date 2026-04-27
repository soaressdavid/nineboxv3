const competenciaRepository = require('../repositories/competencia.repository.js');

const PUBLICOS_VALIDOS = ['colaborador', 'gestor'];

function normalizarPayload(data) {
  return {
    competencia: data.competencia,
    competenciaDe: data.competenciaDe || data.competencia_de,
    tipo: data.tipo,
    descricao: data.descricao,
    criterio1: data.criterio1 || data.ideal,
    criterio2: data.criterio2 || data.bom,
    criterio3: data.criterio3 || data.mediano,
    criterio4: data.criterio4 || data.a_melhorar
  };
}

function validarCamposObrigatorios(payload) {
  const {
    competencia,
    competenciaDe,
    tipo,
    descricao,
    criterio1,
    criterio2,
    criterio3,
    criterio4
  } = payload;

  if (
    !competencia ||
    !competenciaDe ||
    !tipo ||
    !descricao ||
    !criterio1 ||
    !criterio2 ||
    !criterio3 ||
    !criterio4
  ) {
    const error = new Error('Todos os campos são obrigatórios.');
    error.statusCode = 400;
    throw error;
  }

  if (!PUBLICOS_VALIDOS.includes(competenciaDe)) {
    const error = new Error('O campo competenciaDe deve ser "colaborador" ou "gestor".');
    error.statusCode = 400;
    throw error;
  }
}

async function listar({ competenciaDe, search }) {
  if (competenciaDe && !PUBLICOS_VALIDOS.includes(competenciaDe)) {
    const error = new Error('Filtro competenciaDe inválido.');
    error.statusCode = 400;
    throw error;
  }

  return competenciaRepository.findAll({ competenciaDe, search });
}

async function buscarPorId(id) {
  const competencia = await competenciaRepository.findById(id);

  if (!competencia) {
    const error = new Error('Competência não encontrada.');
    error.statusCode = 404;
    throw error;
  }

  return competencia;
}

async function criar(data) {
  const payload = normalizarPayload(data);
  validarCamposObrigatorios(payload);

  const competenciaExistente = await competenciaRepository.findByNomeAndPublico(
    payload.competencia,
    payload.competenciaDe
  );

  if (competenciaExistente) {
    const error = new Error('Já existe uma competência com esse nome para esse público.');
    error.statusCode = 400;
    throw error;
  }

  const result = await competenciaRepository.create(payload);

  return {
    id: result.insertId,
    ...payload
  };
}

async function atualizar(id, data) {
  const competenciaExistente = await competenciaRepository.findById(id);

  if (!competenciaExistente) {
    const error = new Error('Competência não encontrada.');
    error.statusCode = 404;
    throw error;
  }

  const payload = normalizarPayload(data);
  validarCamposObrigatorios(payload);

  const duplicada = await competenciaRepository.findByNomeAndPublico(
    payload.competencia,
    payload.competenciaDe
  );

  if (duplicada && Number(duplicada.id) !== Number(id)) {
    const error = new Error('Já existe outra competência com esse nome para esse público.');
    error.statusCode = 400;
    throw error;
  }

  await competenciaRepository.update(id, payload);
}

async function remover(id) {
  const competenciaExistente = await competenciaRepository.findById(id);

  if (!competenciaExistente) {
    const error = new Error('Competência não encontrada.');
    error.statusCode = 404;
    throw error;
  }

  await competenciaRepository.deleteById(id);
}

async function listarPorAvaliacaoColaboradores(idAvaliacao) {
  const competencias = await competenciaRepository.findByAvaliacaoColaboradores(idAvaliacao);

  if (!competencias.length) {
    const error = new Error('Nenhuma competência encontrada para esta avaliação.');
    error.statusCode = 404;
    throw error;
  }

  return competencias;
}

async function listarPorAvaliacaoGestor(idAvaliacao) {
  const competencias = await competenciaRepository.findByAvaliacaoGestor(idAvaliacao);

  if (!competencias.length) {
    const error = new Error('Nenhuma competência encontrada para esta avaliação.');
    error.statusCode = 404;
    throw error;
  }

  return competencias;
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