const db = require("../database/connection");
const { serviceError } = require("../utils/serviceError");
const { gerarToken } = require("./tokenService");
const bcrypt = require('bcrypt');

async function login({ email, password, accessType }) {
    const user = await db.user.findFirst({
        where: { email }
    });

    if (!user) {
        throw serviceError(401, {
            message: 'Usuário não encontrado.'
        });
    }

    // Verifica senha com bcrypt
    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
        throw serviceError(401, {
            message: 'Senha incorreta.'
        });
    }

    if (user.role !== accessType.toLowerCase()) {
        throw serviceError(403, {
            message: 'Acesso inválido para este tipo de usuário.'
        });
    }

    // Busca dados adicionais baseado no role
    let userData = { id: user.id, email: user.email, role: user.role };
    
    if (user.role === 'manager') {
        const manager = await db.manager.findUnique({
            where: { userId: user.id }
        });
        if (manager) {
            userData.managerId = manager.id;
            userData.name = manager.name;
        }
    }

    const token = gerarToken(userData);

    return {
        message: 'Login bem-sucedido',
        tipo: user.role,
        token
    };
}

async function loginUsuario({ cpf, tipoCargo }) {
    // FIX: valida tipoCargo antes de prosseguir — antes gerava token com payload incompleto
    if (!tipoCargo || !['colaborador', 'gestor'].includes(tipoCargo)) {
        throw serviceError(400, { message: 'Tipo de cargo inválido. Use "colaborador" ou "gestor".' });
    }

    if (!cpf) {
        throw serviceError(400, { message: 'CPF é obrigatório.' });
    }

    let userData = { cpf, tipoCargo };

    if (tipoCargo === 'colaborador') {
        const employee = await db.employee.findUnique({
            where: { registrationId: cpf }
        });
        
        if (!employee) {
            throw serviceError(401, {
                message: 'Nenhum colaborador encontrado.'
            });
        }

        userData.id = employee.id;
        userData.name = employee.name;
        userData.email = employee.email;
        userData.role = 'employee';
    }
    
    if (tipoCargo === 'gestor') {
        const manager = await db.manager.findUnique({
            where: { registrationId: cpf }
        });

        if (!manager) {
            throw serviceError(401, {
                message: 'Nenhum gestor encontrado.'
            });
        }

        userData.id = manager.id;
        userData.name = manager.name;
        userData.email = manager.email;
        userData.role = 'manager';
    }
    
    return {
        token: gerarToken(userData)
    };
}

module.exports = {
    login,
    loginUsuario
};
