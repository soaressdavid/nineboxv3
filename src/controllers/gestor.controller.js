const gestorService = require('../services/gestor.service');
const prisma = require('../lib/prisma');

// GET /gestores
async function listar(req, res) {
  try {
    const gestores = await prisma.managers.findMany();
    res.status(200).json(gestores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar gestores.' });
  }
}

// POST /gestores
async function criar(req, res, next) {
  try {
    const gestor = await gestorService.criar(req.body);
    return res.status(201).json({
      message: 'Gestor criado com sucesso!',
      gestor
    });
  } catch (error) {
    next(error);
  }
}

// PUT /gestores/:ra
async function atualizar(req, res, next) {
  try {
    const { ra } = req.params;
    const gestor = await gestorService.atualizar(ra, req.body);
    return res.status(200).json({
      message: 'Gestor atualizado com sucesso!',
      gestor
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  criar,
  atualizar
};