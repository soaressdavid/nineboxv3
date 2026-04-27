const db = require('../config/db');
const respostaRepository = require('../repositories/resposta.repository.js');
const { normalizarra } = require('../utils/ra');

const NOTAS_VALIDAS = [1, 2, 3, 4];

function validarNota(nota) {
  return NOTAS_VALIDAS.includes(Number(nota));
}

function normalizarRespostasDoAvaliado(respostas = []) {
  return respostas.map(item => ({
    idCompetencia: Number(item.idCompetencia),
    nota: Number(item.nota),
    observacoes: item.observacoes || ''
  }));
}

function validarPayloadDoAvaliado({ grupo180, respostas }) {
  if (!grupo180) {
    const error = new Error('grupo180 é obrigatório.');
    error.statusCode = 400;
    throw error;
  }

  if (!Array.isArray(respostas) || respostas.length === 0) {
    const error = new Error('As respostas são obrigatórias.');
    error.statusCode = 400;
    throw error;
  }

  for (const resposta of respostas) {
    if (!resposta.idCompetencia || !validarNota(resposta.nota)) {
      const error = new Error('Cada resposta deve ter idCompetencia e nota entre 1 e 4.');
      error.statusCode = 400;
      throw error;
    }
  }
}

function validarPayloadDoGestor({ grupo180, avaliados }) {
  if (!grupo180) {
    const error = new Error('grupo180 é obrigatório.');
    error.statusCode = 400;
    throw error;
  }

  if (!Array.isArray(avaliados) || avaliados.length === 0) {
    const error = new Error('Os avaliados e suas respostas são obrigatórios.');
    error.statusCode = 400;
    throw error;
  }

  for (const avaliado of avaliados) {
    if (!avaliado.ra) {
      const error = new Error('Cada avaliado precisa ter ra.');
      error.statusCode = 400;
      throw error;
    }

    if (!Array.isArray(avaliado.respostas) || avaliado.respostas.length === 0) {
      const error = new Error('Cada avaliado precisa ter respostas.');
      error.statusCode = 400;
      throw error;
    }

    for (const resposta of avaliado.respostas) {
      if (!resposta.idCompetencia || !validarNota(resposta.nota)) {
        const error = new Error('Cada resposta deve ter idCompetencia e nota entre 1 e 4.');
        error.statusCode = 400;
        throw error;
      }
    }
  }
}

async function listarPendentesDoAvaliado(ra) {
  const raAvaliado = normalizarra(ra);

  if (!raAvaliado) {
    const error = new Error('ra não encontrado no token.');
    error.statusCode = 401;
    throw error;
  }

  return respostaRepository.findPendentesDoAvaliado(raAvaliado);
}

async function listarPendentesDoGestor(ra) {
  const raGestor = normalizarra(ra);

  if (!raGestor) {
    const error = new Error('ra não encontrado no token.');
    error.statusCode = 401;
    throw error;
  }

  return respostaRepository.findPendentesDoGestor(raGestor);
}

async function carregarFormularioDoAvaliado({ grupo180, raAvaliado }) {
  const raNormalizado = normalizarra(raAvaliado);

  const formulario = await respostaRepository.findFormularioDoAvaliado({
    grupo180,
    raAvaliado: raNormalizado
  });

  if (!formulario) {
    const error = new Error('Formulário da avaliação não encontrado para este avaliado.');
    error.statusCode = 404;
    throw error;
  }

  return formulario;
}

async function carregarFormularioDoGestor({ grupo180, raGestor }) {
  const raNormalizado = normalizarra(raGestor);

  const formulario = await respostaRepository.findFormularioDoGestor({
    grupo180,
    raGestor: raNormalizado
  });

  if (!formulario) {
    const error = new Error('Formulário da avaliação não encontrado para este gestor.');
    error.statusCode = 404;
    throw error;
  }

  return formulario;
}

async function salvarRespostaDoAvaliado({ raAvaliado, grupo180, respostas }) {
  const raNormalizado = normalizarra(raAvaliado);
  const respostasNormalizadas = normalizarRespostasDoAvaliado(respostas);

  validarPayloadDoAvaliado({
    grupo180,
    respostas: respostasNormalizadas
  });

  const formulario = await respostaRepository.findFormularioDoAvaliado({
    grupo180,
    raAvaliado: raNormalizado
  });

  if (!formulario) {
    const error = new Error('Avaliação não disponível para este avaliado.');
    error.statusCode = 404;
    throw error;
  }

  const jaRespondeu = await respostaRepository.existsRespostaDoAvaliado({
    grupo180,
    raAvaliado: raNormalizado
  });

  if (jaRespondeu) {
    const error = new Error('Esta avaliação já foi respondida por este avaliado.');
    error.statusCode = 400;
    throw error;
  }

  const idsEsperados = formulario.competencias.map(c => Number(c.id)).sort((a, b) => a - b);
  const idsRecebidos = respostasNormalizadas.map(r => Number(r.idCompetencia)).sort((a, b) => a - b);

  if (JSON.stringify(idsEsperados) !== JSON.stringify(idsRecebidos)) {
    const error = new Error('As respostas devem contemplar todas as competências do gestor.');
    error.statusCode = 400;
    throw error;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await respostaRepository.insertRespostasDoAvaliado(connection, {
      grupo180,
      idAvaliacaoGestor: formulario.metadados.idAvaliacaoGestor,
      raAvaliado: raNormalizado,
      raGestor: formulario.metadados.gestor.ra,
      respostas: respostasNormalizadas
    });

    await connection.commit();

    return {
      grupo180,
      raAvaliado: raNormalizado
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function salvarRespostaDoGestor({ raGestor, grupo180, avaliados }) {
  const raNormalizado = normalizarra(raGestor);

  validarPayloadDoGestor({ grupo180, avaliados });

  const formulario = await respostaRepository.findFormularioDoGestor({
    grupo180,
    raGestor: raNormalizado
  });

  if (!formulario) {
    const error = new Error('Avaliação não disponível para este gestor.');
    error.statusCode = 404;
    throw error;
  }

  const jaRespondeu = await respostaRepository.existsRespostaDoGestor({
    grupo180,
    raGestor: raNormalizado
  });

  if (jaRespondeu) {
    const error = new Error('Esta avaliação já foi respondida por este gestor.');
    error.statusCode = 400;
    throw error;
  }

  const rasEsperados = formulario.avaliados.map(a => a.ra).sort();
  const rasRecebidos = avaliados.map(a => normalizarra(a.ra)).sort();

  if (JSON.stringify(rasEsperados) !== JSON.stringify(rasRecebidos)) {
    const error = new Error('As respostas devem contemplar todos os avaliados da avaliação.');
    error.statusCode = 400;
    throw error;
  }

  const idsCompetenciasEsperados = formulario.competencias.map(c => Number(c.id)).sort((a, b) => a - b);

  const avaliadosNormalizados = avaliados.map(item => ({
    ra: normalizarra(item.ra),
    observacoes: item.observacoes || '',
    respostas: (item.respostas || []).map(resposta => ({
      idCompetencia: Number(resposta.idCompetencia),
      nota: Number(resposta.nota)
    }))
  }));

  for (const avaliado of avaliadosNormalizados) {
    const idsRecebidos = avaliado.respostas
      .map(r => Number(r.idCompetencia))
      .sort((a, b) => a - b);

    if (JSON.stringify(idsCompetenciasEsperados) !== JSON.stringify(idsRecebidos)) {
      const error = new Error(`O avaliado ${avaliado.ra} não possui respostas completas.`);
      error.statusCode = 400;
      throw error;
    }

    for (const resposta of avaliado.respostas) {
      if (!validarNota(resposta.nota)) {
        const error = new Error(`Nota inválida para o avaliado ${avaliado.ra}.`);
        error.statusCode = 400;
        throw error;
      }
    }
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await respostaRepository.insertRespostasDoGestor(connection, {
      grupo180,
      idAvaliacaoGestor: formulario.metadados.idAvaliacaoGestor,
      raGestor: raNormalizado,
      avaliados: avaliadosNormalizados
    });

    await connection.commit();

    return {
      grupo180,
      raGestor: raNormalizado
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
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