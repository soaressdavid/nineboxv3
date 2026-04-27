const db = require('../config/db');

function executor(connection) {
  return connection || db;
}

async function findPendentesDoAvaliado(raAvaliado) {
  const [rows] = await db.execute(
    `
      SELECT
        ag.grupo_180 AS grupo180,
        ag.id AS idAvaliacaoGestor,
        ag.nomeAvaliacao,
        ag.empresa,
        ag.dataInicio,
        ag.dataFim,
        ag.ra_gestor AS raGestor,
        g.nome AS nomeGestor
      FROM avaliacoes_gestor ag
      INNER JOIN avaliado_avaliacao_gestor aag
        ON aag.id_avaliacao_gestor = ag.id
      LEFT JOIN gestor g
        ON g.ra = ag.ra_gestor
      WHERE aag.ra_avaliado = ?
        AND NOT EXISTS (
          SELECT 1
          FROM respostas_avaliacao r
          WHERE r.grupo_180 = ag.grupo_180
            AND r.ra_avaliado = ?
        )
      ORDER BY ag.id DESC
    `,
    [raAvaliado, raAvaliado]
  );

  return rows.map(row => ({
    grupo180: row.grupo180,
    idAvaliacaoGestor: row.idAvaliacaoGestor,
    nomeAvaliacao: row.nomeAvaliacao,
    empresa: row.empresa,
    dataInicio: row.dataInicio,
    dataFim: row.dataFim,
    gestor: {
      ra: row.raGestor,
      nome: row.nomeGestor
    }
  }));
}

async function findPendentesDoGestor(raGestor) {
  const [rows] = await db.execute(
    `
      SELECT
        a.grupo_180 AS grupo180,
        a.id AS idAvaliacaoColaboradores,
        ag.id AS idAvaliacaoGestor,
        a.nomeAvaliacao,
        a.empresa,
        a.dataInicio,
        a.dataFim,
        COUNT(aa.ra_avaliado) AS quantidadeAvaliados
      FROM avaliacoes a
      INNER JOIN avaliacoes_gestor ag
        ON ag.grupo_180 = a.grupo_180
      INNER JOIN avaliado_avaliacao aa
        ON aa.id_avaliacao = a.id
      WHERE ag.ra_gestor = ?
        AND NOT EXISTS (
          SELECT 1
          FROM respostas_avaliacao_gestor rg
          WHERE rg.grupo_180 = a.grupo_180
            AND rg.ra_gestor = ?
        )
      GROUP BY
        a.grupo_180,
        a.id,
        ag.id,
        a.nomeAvaliacao,
        a.empresa,
        a.dataInicio,
        a.dataFim
      ORDER BY a.id DESC
    `,
    [raGestor, raGestor]
  );

  return rows.map(row => ({
    grupo180: row.grupo180,
    idAvaliacaoColaboradores: row.idAvaliacaoColaboradores,
    idAvaliacaoGestor: row.idAvaliacaoGestor,
    nomeAvaliacao: row.nomeAvaliacao,
    empresa: row.empresa,
    dataInicio: row.dataInicio,
    dataFim: row.dataFim,
    quantidadeAvaliados: row.quantidadeAvaliados
  }));
}

async function findFormularioDoAvaliado({ grupo180, raAvaliado }) {
  const [metadadosRows] = await db.execute(
    `
      SELECT
        ag.grupo_180 AS grupo180,
        ag.id AS idAvaliacaoGestor,
        ag.nomeAvaliacao,
        ag.empresa,
        ag.dataInicio,
        ag.dataFim,
        ag.descricao,
        ag.textoFinal,
        ag.ra_gestor AS raGestor,
        g.nome AS nomeGestor,
        aag.ra_avaliado AS raAvaliado
      FROM avaliacoes_gestor ag
      INNER JOIN avaliado_avaliacao_gestor aag
        ON aag.id_avaliacao_gestor = ag.id
      LEFT JOIN gestor g
        ON g.ra = ag.ra_gestor
      WHERE ag.grupo_180 = ?
        AND aag.ra_avaliado = ?
      LIMIT 1
    `,
    [grupo180, raAvaliado]
  );

  if (metadadosRows.length === 0) {
    return null;
  }

  const metadados = metadadosRows[0];

  const [competenciasRows] = await db.execute(
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
      idAvaliacaoGestor: metadados.idAvaliacaoGestor,
      nomeAvaliacao: metadados.nomeAvaliacao,
      empresa: metadados.empresa,
      dataInicio: metadados.dataInicio,
      dataFim: metadados.dataFim,
      descricao: metadados.descricao,
      textoFinal: metadados.textoFinal,
      gestor: {
        ra: metadados.raGestor,
        nome: metadados.nomeGestor
      },
      avaliado: {
        ra: metadados.raAvaliado
      }
    },
    competencias: competenciasRows
  };
}

async function findFormularioDoGestor({ grupo180, raGestor }) {
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
        g.nome AS nomeGestor
      FROM avaliacoes a
      INNER JOIN avaliacoes_gestor ag
        ON ag.grupo_180 = a.grupo_180
      LEFT JOIN gestor g
        ON g.ra = ag.ra_gestor
      WHERE a.grupo_180 = ?
        AND ag.ra_gestor = ?
      LIMIT 1
    `,
    [grupo180, raGestor]
  );

  if (metadadosRows.length === 0) {
    return null;
  }

  const metadados = metadadosRows[0];

  const [competenciasRows] = await db.execute(
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

  const [avaliadosRows] = await db.execute(
    `
      SELECT
        av.ra,
        av.nome,
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
        nome: metadados.nomeGestor
      }
    },
    competencias: competenciasRows,
    avaliados: avaliadosRows
  };
}

async function existsRespostaDoAvaliado({ grupo180, raAvaliado }) {
  const [rows] = await db.execute(
    `
      SELECT COUNT(*) AS total
      FROM respostas_avaliacao
      WHERE grupo_180 = ?
        AND ra_avaliado = ?
    `,
    [grupo180, raAvaliado]
  );

  return Number(rows[0].total) > 0;
}

async function existsRespostaDoGestor({ grupo180, raGestor }) {
  const [rows] = await db.execute(
    `
      SELECT COUNT(*) AS total
      FROM respostas_avaliacao_gestor
      WHERE grupo_180 = ?
        AND ra_gestor = ?
    `,
    [grupo180, raGestor]
  );

  return Number(rows[0].total) > 0;
}

async function insertRespostasDoAvaliado(connection, payload) {
  const exec = executor(connection);

  for (const resposta of payload.respostas) {
    await exec.execute(
      `
        INSERT INTO respostas_avaliacao (
          grupo_180,
          id_avaliacao_gestor,
          ra_gestor,
          ra_avaliado,
          id_competencia,
          respostas,
          observacoes,
          data_resposta
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.grupo180,
        payload.idAvaliacaoGestor,
        payload.raGestor,
        payload.raAvaliado,
        resposta.idCompetencia,
        resposta.nota,
        resposta.observacoes || '',
        new Date()
      ]
    );
  }
}

async function insertRespostasDoGestor(connection, payload) {
  const exec = executor(connection);

  for (const avaliado of payload.avaliados) {
    for (const resposta of avaliado.respostas) {
      await exec.execute(
        `
          INSERT INTO respostas_avaliacao_gestor (
            grupo_180,
            ra_gestor,
            id_avaliacao_gestor,
            ra_avaliado,
            id_competencia,
            respostas,
            observacoes,
            data_resposta
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          payload.grupo180,
          payload.raGestor,
          payload.idAvaliacaoGestor,
          avaliado.ra,
          resposta.idCompetencia,
          resposta.nota,
          avaliado.observacoes || '',
          new Date()
        ]
      );
    }
  }
}

module.exports = {
  findPendentesDoAvaliado,
  findPendentesDoGestor,
  findFormularioDoAvaliado,
  findFormularioDoGestor,
  existsRespostaDoAvaliado,
  existsRespostaDoGestor,
  insertRespostasDoAvaliado,
  insertRespostasDoGestor
};