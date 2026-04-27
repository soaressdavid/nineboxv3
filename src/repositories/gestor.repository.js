const db = require('../config/db');

async function findAll() {
  const [rows] = await db.execute(`
    SELECT ra, nome, genero, dataNascimento, empresa, email
    FROM gestor
  `);

  return rows;
}

async function findByra(ra) {
  const [rows] = await db.execute(
    'SELECT ra, nome, genero, dataNascimento, empresa, email FROM gestor WHERE ra = ?',
    [ra]
  );

  return rows[0] || null;
}

async function create({ nome, ra, genero, dataNascimento, empresa, email }) {
  const [result] = await db.execute(
    'INSERT INTO gestor (nome, ra, genero, dataNascimento, empresa, email) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, ra, genero, dataNascimento, empresa, email]
  );

  return result;
}

async function update(ra, { nome, genero, dataNascimento, empresa, email }) {
  const [result] = await db.execute(
    `
      UPDATE gestor
      SET nome = ?, genero = ?, dataNascimento = ?, empresa = ?, email = ?
      WHERE ra = ?
    `,
    [nome, genero, dataNascimento, empresa, email, ra]
  );

  return result;
}

module.exports = {
  findAll,
  findByra,
  create,
  update
};