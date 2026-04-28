const gestorRepository = require('../repositories/gestor.repository');
const { normalizarRa, validarRa } = require('../utils/ra');

// GET /gestores
async function listar() {
    const gestores = await gestorRepository.findAll();

    if(!gestores.length) {
        const error = new Error('Nenhum gestor encontrado');
        error.statusCode = 404;
        throw error;
    }

    return gestores;
}    

// POST /gestores
async function criar(data) {
    const {nome, ra, genero, data_nascimento, empresa, email} = data;

    if (!nome || !ra || !genero || !data_nascimento || !empresa || !email) {
        const error = new Error('Todos os campos são obrigatórios.');
        error.statusCode = 400;
        throw error;
    }

    const raNormalizado = normalizarra(ra);
    
    const gestorExistente = await gestorRepository.findByra(raNormalizado);
    if (gestorExistente) {
        const error = new Error('ra já cadastrado.');
        error.statusCode = 400;
        throw error;
    }
    
    const gestor = await gestorRepository.create({
        nome,
        ra: raNormalizado,
        genero,
        data_nascimento,
        empresa,
        email
    });
    return gestor;
}

// PUT /gestores/:ra
async function atualizar(ra, data) {
  const { nome, genero, dataNascimento, empresa, email } = data;

  const raNormalizado = normalizarra(ra);

  const gestorExistente = await gestorRepository.findByra(raNormalizado);

  if (!gestorExistente) {
    const error = new Error('Gestor não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  await gestorRepository.update(raNormalizado, {
    nome,
    genero,
    dataNascimento,
    empresa,
    email
  });
}

module.exports = {
    listar,
    criar,
    atualizar
};