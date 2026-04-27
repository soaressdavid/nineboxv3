const db = require('../database/connection');
const { serviceError } = require('../utils/serviceError');

async function listCompetencias() {
    const competencias = await db.competency.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
    });

    return competencias.map(comp => ({
        id: comp.id,
        competencia: comp.name,
        tipo: comp.type,
        descricao: comp.description,
        ideal: comp.levelIdeal,
        bom: comp.levelGood,
        mediano: comp.levelAverage,
        a_melhorar: comp.levelNeedsImprovement,
        ativo: comp.active
    }));
}

async function createCompetencia({ competencia, tipo, descricao, ideal, bom, mediano, a_melhorar }) {
    const existingCompetency = await db.competency.findUnique({
        where: { name: competencia }
    });

    if (existingCompetency) {
        throw serviceError(400, { message: 'Já existe uma competência com este nome.' });
    }

    const competency = await db.competency.create({
        data: {
            name: competencia,
            type: tipo,
            description: descricao,
            levelIdeal: ideal,
            levelGood: bom,
            levelAverage: mediano,
            levelNeedsImprovement: a_melhorar
        }
    });

    return {
        message: 'Competência criada com sucesso!',
        competencia: {
            id: competency.id,
            competencia: competency.name,
            tipo: competency.type,
            descricao: competency.description
        }
    };
}

async function getCompetenciaById(id) {
    const competency = await db.competency.findUnique({
        where: { id: parseInt(id) }
    });

    if (!competency) {
        throw serviceError(404, { message: 'Competência não encontrada.' });
    }

    return {
        id: competency.id,
        competencia: competency.name,
        tipo: competency.type,
        descricao: competency.description,
        ideal: competency.levelIdeal,
        bom: competency.levelGood,
        mediano: competency.levelAverage,
        a_melhorar: competency.levelNeedsImprovement,
        ativo: competency.active
    };
}

async function getCompetenciasByAvaliacao(idAvaliacao) {
    const evaluationCompetencies = await db.evaluationCompetency.findMany({
        where: { evaluationId: parseInt(idAvaliacao) },
        include: {
            competency: true
        }
    });

    return evaluationCompetencies.map(ec => ({
        id: ec.competency.id,
        competencia: ec.competency.name,
        tipo: ec.competency.type,
        descricao: ec.competency.description,
        ideal: ec.competency.levelIdeal,
        bom: ec.competency.levelGood,
        mediano: ec.competency.levelAverage,
        a_melhorar: ec.competency.levelNeedsImprovement
    }));
}

module.exports = {
    listCompetencias,
    createCompetencia,
    getCompetenciaById,
    getCompetenciasByAvaliacao
};
