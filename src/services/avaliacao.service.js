const { randomUUID } = require('crypto');
const db = require('../config/db');

const gestorRepository = require('../repositories/gestor.repository');
const avaliadoRepository = require('../repositories/avaliado.repository');
const competenciaRepository = require('../repositories/competencia.repository');
const avaliacaoRepository = require('../repositories/avaliacao.repository.js');

const { normalizarra } = require('../utils/ra');

function normalizarListaDeras(avaliados = []) {
  return avaliados.map(item => normalizarra(item.ra || item));
}

function normalizarListaDeIds(lista = []) {
  return lista.map(item => Number(item.id || item));
}

function validarPayload(payload) {
  const {
    nomeAvaliacao,
    empresa,
    dataInicio,
    dataFim,
    descricao,
    raGestor,
    avaliados,
    competenciasColaboradores,
    competenciasGestor
  } = payload;

  if (
    !nomeAvaliacao ||
    !empresa ||
    !dataInicio ||
    !dataFim ||
    !descricao ||
    !raGestor
  ) {
    const error = new Error('Dados gerais da avaliação são obrigatórios.');
    error.statusCode = 400;
    throw error;
  }

  if (!Array.isArray(avaliados) || avaliados.length === 0) {
    const error = new Error('Selecione ao menos um avaliado.');
    error.statusCode = 400;
    throw error;
  }

  if (!Array.isArray(competenciasColaboradores) || competenciasColaboradores.length === 0) {
    const error = new Error('Selecione ao menos uma competência para colaboradores.');
    error.statusCode = 400;
    throw error;
  }

  if (!Array.isArray(competenciasGestor) || competenciasGestor.length === 0) {
    const error = new Error('Selecione ao menos uma competência para o gestor.');
    error.statusCode = 400;
    throw error;
  }
}

async function validarEntidades({
  raGestor,
  rasAvaliados,
  idsCompetenciasColaboradores,
  idsCompetenciasGestor
}) {
  const gestor = await gestorRepository.findByra(raGestor);
  if (!gestor) {
    const error = new Error('Gestor não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  const avaliados = await avaliadoRepository.findByras(rasAvaliados);

  if (avaliados.length !== rasAvaliados.length) {
    const rasEncontrados = avaliados.map(a => a.ra);
    const faltantes = rasAvaliados.filter(ra => !rasEncontrados.includes(ra));

    const error = new Error(`Os seguintes avaliados não foram encontrados: ${faltantes.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const avaliadosInvalidos = avaliados.filter(a => a.ra_gestor !== raGestor);
  if (avaliadosInvalidos.length > 0) {
    const error = new Error('Há avaliados que não pertencem ao gestor selecionado.');
    error.statusCode = 400;
    throw error;
  }

  const competenciasColaboradores = await competenciaRepository.findByIdsAndPublico(
    idsCompetenciasColaboradores,
    'colaborador'
  );

  if (competenciasColaboradores.length !== idsCompetenciasColaboradores.length) {
    const idsEncontrados = competenciasColaboradores.map(c => Number(c.id));
    const faltantes = idsCompetenciasColaboradores.filter(id => !idsEncontrados.includes(Number(id)));

    const error = new Error(
      `Competências de colaborador inválidas ou inexistentes: ${faltantes.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  const competenciasGestor = await competenciaRepository.findByIdsAndPublico(
    idsCompetenciasGestor,
    'gestor'
  );

  if (competenciasGestor.length !== idsCompetenciasGestor.length) {
    const idsEncontrados = competenciasGestor.map(c => Number(c.id));
    const faltantes = idsCompetenciasGestor.filter(id => !idsEncontrados.includes(Number(id)));

    const error = new Error(
      `Competências de gestor inválidas ou inexistentes: ${faltantes.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  return {
    gestor,
    avaliados,
    competenciasColaboradores,
    competenciasGestor
  };
}

async function criarAvaliacao180(data) {
  validarPayload(data);

  const raGestor = normalizarra(data.raGestor);
  const rasAvaliados = normalizarListaDeras(data.avaliados);
  const idsCompetenciasColaboradores = normalizarListaDeIds(data.competenciasColaboradores);
  const idsCompetenciasGestor = normalizarListaDeIds(data.competenciasGestor);

  await validarEntidades({
    raGestor,
    rasAvaliados,
    idsCompetenciasColaboradores,
    idsCompetenciasGestor
  });

  const grupo180 = randomUUID();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const avaliacaoColaboradores = await avaliacaoRepository.createAvaliacaoColaboradores(
      connection,
      {
        grupo180,
        nomeAvaliacao: data.nomeAvaliacao,
        empresa: data.empresa,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        descricao: data.descricao,
        textoFinal: data.textoFinal || null
      }
    );

    await avaliacaoRepository.insertAvaliadosNaAvaliacao(
      connection,
      avaliacaoColaboradores.insertId,
      rasAvaliados
    );

    await avaliacaoRepository.insertCompetenciasColaboradoresNaAvaliacao(
      connection,
      avaliacaoColaboradores.insertId,
      idsCompetenciasColaboradores
    );

    const avaliacaoGestor = await avaliacaoRepository.createAvaliacaoGestor(
      connection,
      {
        grupo180,
        nomeAvaliacao: data.nomeAvaliacao,
        raGestor,
        empresa: data.empresa,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        descricao: data.descricao,
        textoFinal: data.textoFinal || null
      }
    );

    await avaliacaoRepository.insertAvaliadosNaAvaliacaoGestor(
      connection,
      avaliacaoGestor.insertId,
      rasAvaliados
    );

    await avaliacaoRepository.insertCompetenciasGestorNaAvaliacao(
      connection,
      avaliacaoGestor.insertId,
      idsCompetenciasGestor
    );

    await connection.commit();

    return {
      grupo180,
      idAvaliacaoColaboradores: avaliacaoColaboradores.insertId,
      idAvaliacaoGestor: avaliacaoGestor.insertId
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function listarAvaliacoes180(filters) {
  return avaliacaoRepository.findAll180(filters);
}

async function buscarResumoAvaliacao180(grupo180) {
  const resumo = await avaliacaoRepository.findResumoByGrupo180(grupo180);

  if (!resumo) {
    const error = new Error('Avaliação 180 não encontrada.');
    error.statusCode = 404;
    throw error;
  }

  return resumo;
}

module.exports = {
  criarAvaliacao180,
  listarAvaliacoes180,
  buscarResumoAvaliacao180
};