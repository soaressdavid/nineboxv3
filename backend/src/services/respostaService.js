const db = require('../database/connection');
const { serviceError } = require('../utils/serviceError');

async function salvarResposta({ evaluationId, employeeId, competencyId, response, observation }) {
    // Verifica se já existe uma resposta
    const existingResponse = await db.response.findFirst({
        where: {
            evaluationId: Number(evaluationId),
            employeeId: Number(employeeId),
            competencyId: Number(competencyId)
        }
    });

    if (existingResponse) {
        // Atualiza a resposta existente
        const updated = await db.response.update({
            where: { id: existingResponse.id },
            data: {
                response,
                observation
            }
        });

        return {
            message: 'Resposta atualizada com sucesso!',
            id: updated.id
        };
    }

    // Cria nova resposta
    const newResponse = await db.response.create({
        data: {
            evaluationId: Number(evaluationId),
            employeeId: Number(employeeId),
            competencyId: Number(competencyId),
            response,
            observation
        }
    });

    return {
        message: 'Resposta salva com sucesso!',
        id: newResponse.id
    };
}

async function getRespostasByAvaliacaoAndEmployee(evaluationId, employeeRa) {
    // Busca o employee pelo RA
    const employee = await db.employee.findUnique({
        where: { registrationId: employeeRa }
    });

    if (!employee) {
        throw serviceError(404, { message: 'Colaborador não encontrado.' });
    }

    const responses = await db.response.findMany({
        where: {
            evaluationId: Number(evaluationId),
            employeeId: employee.id
        },
        include: {
            competency: true
        }
    });

    return responses.map(r => ({
        id: r.id,
        competenciaId: r.competencyId,
        competencia: r.competency.name,
        resposta: r.response,
        observacao: r.observation,
        dataResposta: r.submittedAt
    }));
}

async function getRespostasByAvaliacao(evaluationId) {
    const responses = await db.response.findMany({
        where: { evaluationId: Number(evaluationId) },
        include: {
            employee: true,
            competency: true
        }
    });

    return responses.map(r => ({
        id: r.id,
        avaliadoId: r.employeeId,
        avaliadoNome: r.employee.name,
        avaliadoRa: r.employee.registrationId,
        competenciaId: r.competencyId,
        competencia: r.competency.name,
        resposta: r.response,
        observacao: r.observation,
        dataResposta: r.submittedAt
    }));
}

async function getDashboardData(evaluationId) {
    const evaluation = await db.evaluation.findUnique({
        where: { id: Number(evaluationId) },
        include: {
            participants: {
                include: { employee: true }
            },
            competencies: {
                include: { competency: true }
            },
            responses: {
                include: {
                    employee: true,
                    competency: true
                }
            }
        }
    });

    if (!evaluation) {
        throw serviceError(404, { message: 'Avaliação não encontrada.' });
    }

    // Calcula estatísticas
    const totalAvaliados = evaluation.participants.length;
    const avaliadosResponderam = new Set(evaluation.responses.map(r => r.employeeId)).size;
    const totalCompetencias = evaluation.competencies.length;

    return {
        avaliacao: {
            id: evaluation.id,
            nome: evaluation.name,
            tipo: evaluation.type,
            dataInicio: evaluation.startDate,
            dataFim: evaluation.endDate
        },
        estatisticas: {
            totalAvaliados,
            avaliadosResponderam,
            percentualConclusao: totalAvaliados > 0 ? (avaliadosResponderam / totalAvaliados * 100).toFixed(2) : 0,
            totalCompetencias
        },
        respostas: evaluation.responses.map(r => ({
            avaliadoNome: r.employee.name,
            avaliadoRa: r.employee.registrationId,
            competencia: r.competency.name,
            resposta: r.response,
            observacao: r.observation
        }))
    };
}

module.exports = {
    salvarResposta,
    getRespostasByAvaliacaoAndEmployee,
    getRespostasByAvaliacao,
    getDashboardData
};
