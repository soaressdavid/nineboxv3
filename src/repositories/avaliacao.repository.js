const db = require('../config/db');

function executor(connection) {
  return connection || db;
}

async function createAvaliacaoColaboradores(connection, payload) {
  const exec = executor(connection);

  const [result] = await exec.execute(
    `
      INSERT INTO avaliacoes (
        grupo_180,
        nomeAvaliacao,
        empresa,
        dataInicio,
        dataFim,
        descricao,
        textoFinal
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.grupo180,
      payload.nomeAvaliacao,
      payload.empresa,
      payload.dataInicio,
      payload.dataFim,
      payload.descricao,
      payload.textoFinal
    ]
  );

  return result;
}

async function insertAvaliadosNaAvaliacao(connection, idAvaliacao, rasAvaliados) {
  const exec = executor(connection);

  for (const ra of rasAvaliados) {
    await exec.execute(
      `
        INSERT INTO avaliado_avaliacao (id_avaliacao, ra_avaliado)
        VALUES (?, ?)
      `,
      [idAvaliacao, ra]
    );
  }
}

async function insertCompetenciasColaboradoresNaAvaliacao(connection, idAvaliacao, idsCompetencias) {
  const exec = executor(connection);

  for (const idCompetencia of idsCompetencias) {
    await exec.execute(
      `
        INSERT INTO competencia_avaliacao (id_avaliacao, id_competencia)
        VALUES (?, ?)
      `,
      [idAvaliacao, idCompetencia]
    );
  }
}

async function createAvaliacaoGestor(connection, payload) {
  const exec = executor(connection);

  const [result] = await exec.execute(
    `
      INSERT INTO avaliacoes_gestor (
        grupo_180,
        nomeAvaliacao,
        ra_gestor,
        empresa,
        dataInicio,
        dataFim,
        descricao,
        textoFinal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.grupo180,
      payload.nomeAvaliacao,
      payload.raGestor,
      payload.empresa,
      payload.dataInicio,
      payload.dataFim,
      payload.descricao,
      payload.textoFinal
    ]
  );

  return result;
}

async function insertAvaliadosNaAvaliacaoGestor(connection, idAvaliacaoGestor, rasAvaliados) {
  const exec = executor(connection);

  for (const ra of rasAvaliados) {
    await exec.execute(
      `
        INSERT INTO avaliado_avaliacao_gestor (id_avaliacao_gestor, ra_avaliado)
        VALUES (?, ?)
      `,
      [idAvaliacaoGestor, ra]
    );
  }
}

async function insertCompetenciasGestorNaAvaliacao(connection, idAvaliacaoGestor, idsCompetencias) {
  const exec = executor(connection);

  for (const idCompetencia of idsCompetencias) {
    await exec.execute(
      `
        INSERT INTO competencia_avaliacao_gestor (id_avaliacao_gestor, id_competencia)
        VALUES (?, ?)
      `,
      [idAvaliacaoGestor, idCompetencia]
    );
  }
}

async function findAll180(filters = {}) {
  let sql = `
    SELECT
      a.grupo_180 AS grupo180,
      a.id AS idAvaliacaoColaboradores,
      ag.id AS idAvaliacaoGestor,
      a.nomeAvaliacao,
      a.empresa,
      a.dataInicio,
      a.dataFim,
      ag.ra_gestor AS raGestor,
      g.nome AS nomeGestor
    FROM avaliacoes a
    INNER JOIN avaliacoes_gestor ag
      ON ag.grupo_180 = a.grupo_180
    LEFT JOIN gestor g
      ON g.ra = ag.ra_gestor
    WHERE 1 = 1
  `;

  const params = [];

  if (filters.empresa) {
    sql += ` AND a.empresa = ?`;
    params.push(filters.empresa);
  }

  if (filters.raGestor) {
    sql += ` AND ag.ra_gestor = ?`;
    params.push(String(filters.raGestor).replace(/\D/g, ''));
  }

  sql += ` ORDER BY a.id DESC`;

  const [rows] = await db.execute(sql, params);

  return rows.map(row => ({
    grupo180: row.grupo180,
    idAvaliacaoColaboradores: row.idAvaliacaoColaboradores,
    idAvaliacaoGestor: row.idAvaliacaoGestor,
    nomeAvaliacao: row.nomeAvaliacao,
    empresa: row.empresa,
    dataInicio: row.dataInicio,
    dataFim: row.dataFim,
    raGestor: row.raGestor,
    nomeGestor: row.nomeGestor
  }));
}

async function findResumoByGrupo180(grupo180) {
  const [metadadosRows] = await db.execute(
    `
      SELECT
        a.grupo_180 AS grupo180,
        a.id AS idAvaliacaoColaboradores,
        ag.id AS idAvaliacaoGestor,
        a.nomeAvaliacao,
        a.empresa,
        a.dataInicio,
        a.dataFim,
        a.descricao,
        a.textoFinal,
        ag.ra_gestor AS raGestor,
        g.nome AS nomeGestor,
        g.email AS emailGestor
      FROM avaliacoes a
      INNER JOIN avaliacoes_gestor ag
        ON ag.grupo_180 = a.grupo_180
      LEFT JOIN gestor g
        ON g.ra = ag.ra_gestor
      WHERE a.grupo_180 = ?
      LIMIT 1
    `,
    [grupo180]
  );

  if (metadadosRows.length === 0) {
    return null;
  }

  const metadados = metadadosRows[0];

  const [avaliadosRows] = await db.execute(
    `
      SELECT
        av.ra,
        av.nome,
        av.genero,
        av.dataNascimento,
        av.empresa,
        av.email,
        av.ra_gestor
      FROM avaliado_avaliacao aa
      INNER JOIN avaliado av
        ON av.ra = aa.ra_avaliado
      WHERE aa.id_avaliacao = ?
      ORDER BY av.nome
    `,
    [metadados.idAvaliacaoColaboradores]
  );

  const [competenciasColaboradoresRows] = await db.execute(
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
      FROM competencia_avaliacao ca
      INNER JOIN competencias c
        ON c.id = ca.id_competencia
      WHERE ca.id_avaliacao = ?
      ORDER BY c.competencia
    `,
    [metadados.idAvaliacaoColaboradores]
  );

  const [competenciasGestorRows] = await db.execute(
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
      FROM competencia_avaliacao_gestor cag
      INNER JOIN competencias c
        ON c.id = cag.id_competencia
      WHERE cag.id_avaliacao_gestor = ?
      ORDER BY c.competencia
    `,
    [metadados.idAvaliacaoGestor]
  );

  return {
    metadados: {
      grupo180: metadados.grupo180,
      idAvaliacaoColaboradores: metadados.idAvaliacaoColaboradores,
      idAvaliacaoGestor: metadados.idAvaliacaoGestor,
      nomeAvaliacao: metadados.nomeAvaliacao,
      empresa: metadados.empresa,
      dataInicio: metadados.dataInicio,
      dataFim: metadados.dataFim,
      descricao: metadados.descricao,
      textoFinal: metadados.textoFinal,
      gestor: {
        ra: metadados.raGestor,
        nome: metadados.nomeGestor,
        email: metadados.emailGestor
      }
    },
    avaliados: avaliadosRows,
    competenciasColaboradores: competenciasColaboradoresRows,
    competenciasGestor: competenciasGestorRows
  };
}

module.exports = {
  createAvaliacaoColaboradores,
  insertAvaliadosNaAvaliacao,
  insertCompetenciasColaboradoresNaAvaliacao,
  createAvaliacaoGestor,
  insertAvaliadosNaAvaliacaoGestor,
  insertCompetenciasGestorNaAvaliacao,
  findAll180,
  findResumoByGrupo180
};