const db = require('../database/connection');
const { serviceError } = require('../utils/serviceError');

async function createAvaliacao({
  nomeAvaliacao,
  empresa,
  dataInicio,
  dataFim,
  descricao,
  textoFinal,
  criadorId,
  avaliados,
  competencias,
  tipo = 'employee'
}) {
  const result = await db.evaluation.create({
    data: {
      managerId: Number(criadorId),
      name: nomeAvaliacao,
      type: tipo,
      company: empresa,
      status: 'active',
      startDate: new Date(dataInicio),
      endDate: new Date(dataFim),
      description: descricao,
      closingText: textoFinal,
      participants: {
        create: avaliados.map((a) => ({
          employeeId: Number(a.id),
        })),
      },
      competencies: {
        create: competencias.map((c) => ({
          competencyId: Number(c.id),
        })),
      },
    },
  });

  return {
    message: 'Avaliação salva com sucesso!',
    id: result.id,
  };
}

async function getAvaliacaoById(id) {
  const evaluation = await db.evaluation.findUnique({
    where: { id: Number(id) },
    include: {
      participants: {
        include: { employee: { include: { manager: true } } },
      },
      competencies: {
        include: { competency: true },
      },
    },
  });

  if (!evaluation) {
    throw serviceError(404, { message: 'Avaliação não encontrada' });
  }

  return {
    id: evaluation.id,
    nomeAvaliacao: evaluation.name,
    tipo: evaluation.type,
    empresa: evaluation.company,
    dataInicio: evaluation.startDate,
    dataFim: evaluation.endDate,
    descricao: evaluation.description,
    textoFinal: evaluation.closingText,
    status: evaluation.status,
    avaliados: evaluation.participants.map(p => ({
      id: p.employee.id,
      nome: p.employee.name,
      email: p.employee.email,
      ra: p.employee.registrationId
    })),
    competencias: evaluation.competencies.map(c => ({
      id: c.competency.id,
      competencia: c.competency.name,
      tipo: c.competency.type,
      descricao: c.competency.description
    }))
  };
}

async function listarAvaliacoes(managerId) {
  const evaluations = await db.evaluation.findMany({
    where: { managerId: Number(managerId) },
    orderBy: { createdAt: 'desc' }
  });

  // FIX: lista vazia deve retornar [] e não lançar 404
  return {
    avaliacoes: evaluations.map(e => ({
      id: e.id,
      nomeAvaliacao: e.name,
      tipo: e.type,
      empresa: e.company,
      dataInicio: e.startDate.toISOString().split('T')[0],
      dataFim: e.endDate.toISOString().split('T')[0],
      status: e.status
    }))
  };
}

async function listarTodasAvaliacoes() {
  const evaluations = await db.evaluation.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // FIX: lista vazia deve retornar [] e não lançar 404
  return {
    avaliacoes: evaluations.map(e => ({
      id: e.id,
      nomeAvaliacao: e.name,
      tipo: e.type,
      empresa: e.company,
      dataInicio: e.startDate.toISOString().split('T')[0],
      dataFim: e.endDate.toISOString().split('T')[0],
      status: e.status
    }))
  };
}

async function listAvaliacoesComStatus() {
  const evaluations = await db.evaluation.findMany();
  const hoje = new Date();

  return evaluations.map((e) => ({
    id: e.id,
    nomeAvaliacao: e.name,
    tipo: e.type,
    empresa: e.company,
    dataInicio: e.startDate.toISOString().split('T')[0],
    dataFim: e.endDate.toISOString().split('T')[0],
    status: e.endDate >= hoje ? 'Em andamento' : 'Encerrada',
  }));
}

async function getAvaliadosByAvaliacao(idAvaliacao) {
  const participants = await db.evaluationParticipant.findMany({
    where: { evaluationId: Number(idAvaliacao) },
    include: {
      employee: true
    }
  });

  return participants.map(p => ({
    id: p.employee.id,
    nome: p.employee.name,
    email: p.employee.email,
    ra: p.employee.registrationId,
    empresa: p.employee.company
  }));
}

module.exports = {
  createAvaliacao,
  getAvaliacaoById,
  listarAvaliacoes,
  listarTodasAvaliacoes,
  listAvaliacoesComStatus,
  getAvaliadosByAvaliacao
};
