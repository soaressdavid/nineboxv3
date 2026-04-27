const avaliadoRepository = require('../repositories/avaliado.repository.js');
const gestorRepository = require('../repositories/gestor.repository');
const { normalizarra } = require('../utils/ra');

async function listar({ raGestor }) {
  if (raGestor) {
    const gestorraNormalizado = normalizarra(raGestor);
    return avaliadoRepository.findByGestorra(gestorraNormalizado);
  }

  return avaliadoRepository.findAll();
}

async function buscarPorra(ra) {
  const raNormalizado = normalizarra(ra);
  const avaliado = await avaliadoRepository.findByra(raNormalizado);

  if (!avaliado) {
    const error = new Error('Avaliado não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return avaliado;
}

async function criar(data) {
  const {
    nome,
    ra,
    genero,
    dataNascimento,
    empresa,
    ra_gestor,
    email
  } = data;

  if (!nome || !ra || !genero || !dataNascimento || !empresa || !ra_gestor || !email) {
    const error = new Error('Todos os campos são obrigatórios.');
    error.statusCode = 400;
    throw error;
  }

  const raNormalizado = normalizarra(ra);
  const raGestorNormalizado = normalizarra(ra_gestor);

  const avaliadoExistente = await avaliadoRepository.findByra(raNormalizado);
  if (avaliadoExistente) {
    const error = new Error('Este ra já está cadastrado.');
    error.statusCode = 400;
    throw error;
  }

  const gestorExistente = await gestorRepository.findByra(raGestorNormalizado);
  if (!gestorExistente) {
    const error = new Error('Gestor informado não existe.');
    error.statusCode = 400;
    throw error;
  }

  await avaliadoRepository.create({
    nome,
    ra: raNormalizado,
    genero,
    dataNascimento,
    empresa,
    ra_gestor: raGestorNormalizado,
    email
  });

  return {
    nome,
    ra: raNormalizado,
    genero,
    dataNascimento,
    empresa,
    ra_gestor: raGestorNormalizado,
    email
  };
}

async function atualizar(ra, data) {
  const {
    nome,
    genero,
    dataNascimento,
    empresa,
    ra_gestor,
    email
  } = data;

  const raNormalizado = normalizarra(ra);
  const raGestorNormalizado = normalizarra(ra_gestor);

  const avaliadoExistente = await avaliadoRepository.findByra(raNormalizado);
  if (!avaliadoExistente) {
    const error = new Error('Avaliado não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  const gestorExistente = await gestorRepository.findByra(raGestorNormalizado);
  if (!gestorExistente) {
    const error = new Error('Gestor informado não existe.');
    error.statusCode = 400;
    throw error;
  }

  await avaliadoRepository.update(raNormalizado, {
    nome,
    genero,
    dataNascimento,
    empresa,
    ra_gestor: raGestorNormalizado,
    email
  });
}

async function remover(ra) {
  const raNormalizado = normalizarra(ra);

  const avaliadoExistente = await avaliadoRepository.findByra(raNormalizado);
  if (!avaliadoExistente) {
    const error = new Error('Avaliado não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  await avaliadoRepository.deleteByra(raNormalizado);
}

module.exports = {
  listar,
  buscarPorra,
  criar,
  atualizar,
  remover
};