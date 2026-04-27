const db = require('../config/db');

async function findAll() {
  const [rows] = await db.execute(`
    SELECT 
      a.ra,
      a.nome,
      a.genero,
      a.dataNascimento,
      a.empresa,
      a.email,
      a.ra_gestor,
      g.nome AS nome_gestor
    FROM avaliado a
    INNER JOIN gestor g ON g.ra = a.ra_gestor
    ORDER BY a.nome
  `);

  return rows;
}

async function findByGestorra(raGestor) {
  const [rows] = await db.execute(
    `
      SELECT 
        a.ra,
        a.nome,
        a.genero,
        a.dataNascimento,
        a.empresa,
        a.email,
        a.ra_gestor,
        g.nome AS nome_gestor
      FROM avaliado a
      INNER JOIN gestor g ON g.ra = a.ra_gestor
      WHERE a.ra_gestor = ?
      ORDER BY a.nome
    `,
    [raGestor]
  );

  return rows;
}

async function findByra(ra) {
  const [rows] = await db.execute(
    `
      SELECT 
        a.ra,
        a.nome,
        a.genero,
        a.dataNascimento,
        a.empresa,
        a.email,
        a.ra_gestor,
        g.nome AS nome_gestor
      FROM avaliado a
      INNER JOIN gestor g ON g.ra = a.ra_gestor
      WHERE a.ra = ?
    `,
    [ra]
  );

  return rows[0] || null;
}

async function create({ nome, ra, genero, dataNascimento, empresa, ra_gestor, email }) {
  const [result] = await db.execute(
    `
      INSERT INTO avaliado (
        nome,
        ra,
        genero,
        dataNascimento,
        empresa,
        ra_gestor,
        email
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [nome, ra, genero, dataNascimento, empresa, ra_gestor, email]
  );

  return result;
}

async function update(ra, { nome, genero, dataNascimento, empresa, ra_gestor, email }) {
  const [result] = await db.execute(
    `
      UPDATE avaliado
      SET nome = ?, genero = ?, dataNascimento = ?, empresa = ?, ra_gestor = ?, email = ?
      WHERE ra = ?
    `,
    [nome, genero, dataNascimento, empresa, ra_gestor, email, ra]
  );

  return result;
}

async function deleteByra(ra) {
  const [result] = await db.execute(
    'DELETE FROM avaliado WHERE ra = ?',
    [ra]
  );

  return result;
}

// Função auxiliar para validar se um avaliado existe

async function findByras(ras) {
  if (!ras || ras.length === 0) {
    return [];
  }

  const placeholders = ras.map(() => '?').join(',');

  const [rows] = await db.execute(
    `
      SELECT
        a.ra,
        a.nome,
        a.genero,
        a.dataNascimento,
        a.empresa,
        a.email,
        a.ra_gestor,
        g.nome AS nome_gestor
      FROM avaliado a
      INNER JOIN gestor g ON g.ra = a.ra_gestor
      WHERE a.ra IN (${placeholders})
    `,
    ras
  );

  return rows;
}

module.exports = {
  findAll,
  findByGestorra,
  findByra,
  create,
  update,
  deleteByra,
  findByras
};