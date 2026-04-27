const avaliadoService = require('../services/avaliado.service.js');

// GET /avaliados
async function listar(req, res, next) {
    try {
        const {Gestor} = req.query;
        const avaliados = await avaliadoService.listar({Gestor});

    return res.status(200).json(avaliados);
  } catch (error) {
    next(error);
  } 
}

// GET /avaliados/:ra
async function buscarPor(req, res, next) {
    try {
        const { ra } = req.params;
        const avaliado = await avaliadoService.buscarPor(ra);
        
        return res.status(200).json(avaliado);
    } catch (error) {
        next(error);
    }
}

// POST /avaliados
async function criar(req, res, next) {
    try {
        const avaliado = req.body;
        return res.status(201).json({
            message: 'Avaliado criado com sucesso!',
            avaliado
        });
    } catch (error) {
        next(error);
    }
}

// PUT /avaliados/:ra
async function atualizar(req, res, next) {
  try {
    const { ra } = req.params;
    await avaliadoService.atualizar(ra, req.body);

    return res.status(200).json({
      message: 'Avaliado atualizado com sucesso!'
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /avaliados/:ra
async function remover(req, res, next) {
  try {
    const { ra } = req.params;
    await avaliadoService.remover(ra);

    return res.status(200).json({
      message: 'Avaliado removido com sucesso!'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  buscarPor,
  criar,
  atualizar,
  remover
};