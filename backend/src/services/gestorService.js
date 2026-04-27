const db = require('../database/connection');
const { serviceError } = require('../utils/serviceError');
const bcrypt = require('bcrypt');

async function listGestores() {
    const managers = await db.manager.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
    });

    return managers.map(mgr => ({
        id: mgr.id,
        nome: mgr.name,
        email: mgr.email,
        cpf: mgr.registrationId,
        empresa: mgr.company,
        ativo: mgr.active
    }));
}

async function createGestor({ nome, cpf, email, empresa, senha }) {
    // Verifica se já existe um gestor com esse CPF
    const existingManager = await db.manager.findUnique({
        where: { registrationId: cpf }
    });

    if (existingManager) {
        throw serviceError(400, { message: 'Já existe um gestor com este CPF.' });
    }

    // Cria o usuário primeiro
    const hashedPassword = await bcrypt.hash(senha || 'gestor123', 10);
    
    const user = await db.user.create({
        data: {
            email,
            password: hashedPassword,
            role: 'manager'
        }
    });

    // Cria o gestor vinculado ao usuário
    const manager = await db.manager.create({
        data: {
            userId: user.id,
            name: nome,
            email,
            registrationId: cpf,
            company: empresa
        }
    });

    return {
        message: 'Gestor criado com sucesso!',
        gestor: {
            id: manager.id,
            nome: manager.name,
            email: manager.email,
            cpf: manager.registrationId,
            empresa: manager.company
        }
    };
}

async function updateGestor(id, { nome, email, empresa }) {
    const manager = await db.manager.findUnique({
        where: { id: parseInt(id) }
    });

    if (!manager) {
        throw serviceError(404, { message: 'Gestor não encontrado.' });
    }

    const updated = await db.manager.update({
        where: { id: parseInt(id) },
        data: {
            name: nome,
            email,
            company: empresa
        }
    });

    // Atualiza também o email do usuário
    if (manager.userId) {
        await db.user.update({
            where: { id: manager.userId },
            data: { email }
        });
    }

    return {
        message: 'Gestor atualizado com sucesso!',
        gestor: {
            id: updated.id,
            nome: updated.name,
            email: updated.email,
            cpf: updated.registrationId,
            empresa: updated.company
        }
    };
}

async function getGestorByCpf(cpf) {
    const manager = await db.manager.findUnique({
        where: { registrationId: cpf }
    });

    if (!manager) {
        throw serviceError(404, { message: 'Gestor não encontrado.' });
    }

    return {
        id: manager.id,
        nome: manager.name,
        email: manager.email,
        cpf: manager.registrationId,
        empresa: manager.company,
        ativo: manager.active
    };
}

module.exports = {
    listGestores,
    createGestor,
    updateGestor,
    getGestorByCpf
};
