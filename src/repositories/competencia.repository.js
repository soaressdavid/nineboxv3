const db = require('../config/db');

function mapearCompetencia(row) {
  return {
    id: row.id,
    competencia: row.competencia,
    competenciaDe: row.competenciaDe,
    tipo: row.tipo,
    descricao: row.descricao,
    criterio1: row.criterio1,
    criterio2: row.criterio2,
    criterio3: row.criterio3,
    criterio4: row.criterio4
  };
}

async function findAll({ competenciaDe, search }) {
  let sql = `
    SELECT
      id,
      competencia,
      competencia_de AS competenciaDe,
      tipo,
      descricao,
      ideal AS criterio1,
      bom AS criterio2,
      mediano AS criterio3,
      a_melhorar AS criterio4
    FROM competencias
    WHERE 1 = 1
  `;

  const params = [];

  if (competenciaDe) {
    sql += ' AND competencia_de = ?';
    params.push(competenciaDe);
  }

  if (search) {
    sql += ' AND competencia LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY competencia';

  const [rows] = await db.execute(sql, params);
  return rows.map(mapearCompetencia);
}

async function findById(id) {
  const [rows] = await db.execute(
    `
      SELECT
        id,
        competencia,
        competencia_de AS competenciaDe,
        tipo,
        descricao,
        ideal AS criterio1,
        bom AS criterio2,
        mediano AS criterio3,
        a_melhorar AS criterio4
      FROM competencias
      WHERE id = ?
    `,
    [id]
  );

  return rows[0] ? mapearCompetencia(rows[0]) : null;
}

async function findByNomeAndPublico(competencia, competenciaDe) {
  const [rows] = await db.execute(
    `
      SELECT
        id,
        competencia,
        competencia_de AS competenciaDe,
        tipo,
        descricao,
        ideal AS criterio1,
        bom AS criterio2,
        mediano AS criterio3,
        a_melhorar AS criterio4
      FROM competencias
      WHERE competencia = ? AND competencia_de = ?
      LIMIT 1
    `,
    [competencia, competenciaDe]
  );

  return rows[0] ? mapearCompetencia(rows[0]) : null;
}

async function create({
  competencia,
  competenciaDe,
  tipo,
  descricao,
  criterio1,
  criterio2,
  criterio3,
  criterio4
}) {
  const [result] = await db.execute(
    `
      INSERT INTO competencias (
        competencia,
        competencia_de,
        tipo,
        descricao,
        ideal,
        bom,
        mediano,
        a_melhorar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [competencia, competenciaDe, tipo, descricao, criterio1, criterio2, criterio3, criterio4]
  );

  return result;
}

async function update(
  id,
  {
    competencia,
    competenciaDe,
    tipo,
    descricao,
    criterio1,
    criterio2,
    criterio3,
    criterio4
  }
) {
  const [result] = await db.execute(
    `
      UPDATE competencias
      SET
        competencia = ?,
        competencia_de = ?,
        tipo = ?,
        descricao = ?,
        ideal = ?,
        bom = ?,
        mediano = ?,
        a_melhorar = ?
      WHERE id = ?
    `,
    [competencia, competenciaDe, tipo, descricao, criterio1, criterio2, criterio3, criterio4, id]
  );

  return result;
}

async function deleteById(id) {
  const [result] = await db.execute(
    'DELETE FROM competencias WHERE id = ?',
    [id]
  );

  return result;
}

async function findByAvaliacaoColaboradores(idAvaliacao) {
  const [rows] = await db.execute(
    `
      SELECT
        c.id,
        c.competencia,
        c.competencia_de AS competenciaDe,
        c.tipo,
        c.descricao,
        c.ideal AS criterio1,
        c.bom AS criterio2,
        c.mediano AS criterio3,
        c.a_melhorar AS criterio4
      FROM competencias c
      INNER JOIN competencia_avaliacao ca
        ON c.id = ca.id_competencia
      WHERE ca.id_avaliacao = ?
      ORDER BY c.competencia
    `,
    [idAvaliacao]
  );

  return rows.map(mapearCompetencia);
}

async function findByAvaliacaoGestor(idAvaliacao) {
  const [rows] = await db.execute(
    `
      SELECT
        c.id,
        c.competencia,
        c.competencia_de AS competenciaDe,
        c.tipo,
        c.descricao,
        c.ideal AS criterio1,
        c.bom AS criterio2,
        c.mediano AS criterio3,
        c.a_melhorar AS criterio4
      FROM competencias c
      INNER JOIN competencia_avaliacao_gestor cag
        ON c.id = cag.id_competencia
      WHERE cag.id_avaliacao_gestor = ?
      ORDER BY c.competencia
    `,
    [idAvaliacao]
  );

  return rows.map(mapearCompetencia);
}

async function findByIdsAndPublico(ids, competenciaDe) {
  if (!ids || ids.length === 0) {
    return [];
  }

  const placeholders = ids.map(() => '?').join(',');

  const [rows] = await db.execute(
    `
      SELECT
        id,
        competencia,
        competencia_de AS competenciaDe,
        tipo,
        descricao,
        ideal AS criterio1,
        bom AS criterio2,
        mediano AS criterio3,
        a_melhorar AS criterio4
      FROM competencias
      WHERE id IN (${placeholders})
        AND competencia_de = ?
    `,
    [...ids, competenciaDe]
  );

  return rows;
}

module.exports = {
  findAll,
  findById,
  findByNomeAndPublico,
  create,
  update,
  deleteById,
  findByAvaliacaoColaboradores,
  findByAvaliacaoGestor,
  findByIdsAndPublico
};