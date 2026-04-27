const db = require('../database/connection');
const { serviceError } = require('../utils/serviceError');

async function listAvaliados() {
    const avaliados = await db.employee.findMany({
        where: { active: true },
        include: {
            manager: {
                select: {
                    name: true,
                    registrationId: true
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    return avaliados.map(emp => ({
        id: emp.id,
        nome: emp.name,
        email: emp.email,
        ra: emp.registrationId,
        empresa: emp.company,
        nome_gestor: emp.manager.name,
        cpf_gestor: emp.manager.registrationId,
        ativo: emp.active
    }));
}

async function createAvaliado({ nome, email, ra, empresa, cpf_gestor }) {
    // Busca o gestor pelo CPF/RA
    const manager = await db.manager.findUnique({
        where: { registrationId: cpf_gestor }
    });

    if (!manager) {
        throw serviceError(404, { message: 'Gestor não encontrado.' });
    }

    if (!ra) {
        throw serviceError(400, { message: 'RA é obrigatório.' });
    }

    // Verifica se já existe um avaliado com esse RA
    const existingEmployee = await db.employee.findUnique({
        where: { registrationId: ra }
    });

    if (existingEmployee) {
        throw serviceError(400, { message: 'Já existe um colaborador com este RA.' });
    }

    const employee = await db.employee.create({
        data: {
            name: nome,
            email,
            registrationId: ra,
            company: empresa,
            managerId: manager.id
        }
    });

    return {
        message: 'Colaborador criado com sucesso!',
        avaliado: {
            id: employee.id,
            nome: employee.name,
            email: employee.email,
            ra: employee.registrationId,
            empresa: employee.company
        }
    };
}

async function updateAvaliado(ra, { nome, email, empresa, cpf_gestor }) {
    const employee = await db.employee.findUnique({
        where: { registrationId: ra }
    });

    if (!employee) {
        throw serviceError(404, { message: 'Colaborador não encontrado.' });
    }

    let updateData = {
        name: nome,
        email,
        company: empresa
    };

    if (cpf_gestor) {
        const manager = await db.manager.findUnique({
            where: { registrationId: cpf_gestor }
        });

        if (!manager) {
            throw serviceError(404, { message: 'Gestor não encontrado.' });
        }

        updateData.managerId = manager.id;
    }

    const updated = await db.employee.update({
        where: { registrationId: ra },
        data: updateData
    });

    return {
        message: 'Colaborador atualizado com sucesso!',
        avaliado: {
            id: updated.id,
            nome: updated.name,
            email: updated.email,
            ra: updated.registrationId,
            empresa: updated.company
        }
    };
}

async function getAvaliadoByRa(ra) {
    const employee = await db.employee.findUnique({
        where: { registrationId: ra },
        include: {
            manager: {
                select: {
                    name: true,
                    registrationId: true
                }
            }
        }
    });

    if (!employee) {
        throw serviceError(404, { message: 'Colaborador não encontrado.' });
    }

    return {
        id: employee.id,
        nome: employee.name,
        email: employee.email,
        ra: employee.registrationId,
        empresa: employee.company,
        nome_gestor: employee.manager.name,
        cpf_gestor: employee.manager.registrationId,
        ativo: employee.active
    };
}

async function deleteAvaliado(id) {
    const employee = await db.employee.findUnique({
        where: { id: parseInt(id) }
    });

    if (!employee) {
        throw serviceError(404, { message: 'Colaborador não encontrado.' });
    }

    await db.employee.update({
        where: { id: parseInt(id) },
        data: { active: false }
    });

    return { message: 'Colaborador desativado com sucesso!' };
}

module.exports = {
    listAvaliados,
    createAvaliado,
    updateAvaliado,
    getAvaliadoByRa,
    deleteAvaliado
};
