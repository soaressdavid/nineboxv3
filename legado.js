const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nineboxg', //troquei temporariamente pois vou refazer algumas tabelas
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados: ', err);
    return;
  }
  console.log('Conectado ao banco de dados');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de login
app.post('/login', (req, res) => {
  const { email, password, accessType } = req.body;

  if (!email || !password || !accessType) {
    return res.status(400).json({ message: 'Email, senha e tipo de acesso são obrigatórios.' });
  }

  const query = 'SELECT * FROM usuarios WHERE (email = ? OR cpf = ?)';

  db.execute(query, [email, email], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados: ', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (results.length > 0) {
      const user = results[0];

      console.log('Senha armazenada no banco de dados (texto):', user.senha);
      console.log('Senha recebida para comparação:', password);

      if (user.senha === password) {
        // Verifica o tipo de usuário
        if (user.tipo_usuario === accessType) {
          const token = gerarToken({ cpf: email, password, accessType });
          console.log(token);
          return res.status(200).json({
            message: 'Login bem-sucedido',
            tipo: user.tipo_usuario,
            token: token
          });
        } else {
          return res.status(403).json({ message: 'Acesso inválido para este tipo de usuário.' });
        }
      } else {
        return res.status(401).json({ message: 'Senha incorreta.' });
      }
    } else {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }
  });
});

// Rota para listar todos os avaliados
app.get('/avaliado', (req, res) => {
  const query = `
    SELECT 
      a.cpf,
      a.nome,
      a.genero,
      a.dataNascimento,
      a.empresa,
      a.email,
      a.cpf_gestor,
      g.nome AS nome_gestor
    FROM avaliado a
    JOIN gestor g ON a.cpf_gestor = g.cpf
  `;

  db.execute(query, (err, results) => {
    if (err) {
      console.error('Erro ao consultar os avaliados: ', err);
      return res.status(500).json({ message: 'Erro ao consultar os avaliados' });
    }

    console.log('Resultados da consulta: ', results);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhum avaliado encontrado.' });
    }

    res.status(200).json(results);
  });
});



// Criação da tabela de competencia interligado com o Banco e o Session Storage da pagina 5

app.post('/salvar_competencia', (req, res) => {
  const { competencia, tipo, descricao, ideal, bom, mediano, a_melhorar } = req.body;

  if (!competencia || !tipo || !descricao || !ideal || !bom || !mediano || !a_melhorar) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const query = 'INSERT INTO competencias (competencia, tipo, descricao, ideal, bom, mediano, a_melhorar) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.execute(query, [competencia, tipo, descricao, ideal, bom, mediano, a_melhorar], (err, result) => {
    if (err) {
      console.error('Erro ao inserir competência:', err);
      return res.status(500).json({ message: 'Erro ao salvar a competência.' });
    }
    res.status(201).json({ message: 'Competência salva com sucesso!' });
  });
});

//Criação de um novo gestor
//Obs, para criar um avaliado, é obrigatório que exista um gestor associado
app.post('/gestor', (req, res) => {
  const { nome, cpf, genero, dataNascimento, empresa, email } = req.body;

  if (!nome || !cpf || !genero || !dataNascimento || !empresa || !email) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const checkQuery = 'SELECT * FROM gestor WHERE cpf = ?';
  db.execute(checkQuery, [cpf], (err, results) => {
    if (err) {
      console.error('Erro ao verificar o CPF: ', err);
      return res.status(500).json({ message: 'Erro no servidor ao verificar o CPF' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Este CPF já está cadastrado.' });
    }

    const insertQuery = 'INSERT INTO gestor (nome, cpf, genero, dataNascimento, empresa, email) VALUES (?, ?, ?, ?, ?, ?)';
    console.log('Consultando a inserção:', insertQuery, [nome, cpf, genero, dataNascimento, empresa, email]);

    db.execute(insertQuery, [nome, cpf, genero, dataNascimento, empresa, email], (err, result) => {
      if (err) {
        console.error('Erro ao inserir o gestor: ', err.sqlMessage || err.message); // Mostra o erro do SQL
        return res.status(500).json({ message: err.sqlMessage || err.message }); // Envia o erro real para o front-end
      }
      res.status(201).json({
        message: 'Gestor criado com sucesso!',
        gestor: {
          id: result.insertId,
          nome,
          cpf,
          genero,
          dataNascimento,
          empresa,
          email
        }
      });
    });
  });
});

// Rota para listar todos os gestores
app.get('/gestor', (req, res) => {
  const query = `
    SELECT 
      cpf,
      nome,
      genero,
      dataNascimento,
      empresa,
      email   
    FROM gestor
  `;

  db.execute(query, (err, results) => {
    if (err) {
      console.error('Erro ao consultar os gestores: ', err);
      return res.status(500).json({ message: 'Erro ao consultar os gestores' });
    }

    console.log('Resultados da consulta: ', results);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhum gestor encontrado.' });
    }

    res.status(200).json(results);
  });
});

// Função de editar um gestor

app.put("/editarGestor/:cpf", (req, res) => {
  const cpf = req.params.cpf; // cpf é chave primária do gestor, não pode mudar
  const { nome, genero, dataNascimento, empresa, email } = req.body;

  const sql = `
    UPDATE gestor
    SET nome = ?, genero = ?, dataNascimento = ?, empresa = ?, email = ?
    WHERE cpf = ?
  `;

  db.query(sql, [nome, genero, dataNascimento, empresa, email, cpf], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar gestor:", err);
      return res.status(500).json({ error: "Erro interno ao atualizar gestor" });
    }

    res.json({ message: "Gestor atualizado com sucesso" });
  });
});

// Criação de um novo avaliado
//Obs, para criar um avaliado, é obrigatório que exista um gestor associado
app.post('/avaliado', (req, res) => {
  const { nome, cpf, genero, dataNascimento, empresa, cpf_gestor, email } = req.body;

  if (!nome || !cpf || !genero || !dataNascimento || !empresa || !cpf_gestor || !email) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const checkQuery = 'SELECT * FROM avaliado WHERE cpf = ?';
  db.execute(checkQuery, [cpf], (err, results) => {
    if (err) {
      console.error('Erro ao verificar o CPF: ', err);
      return res.status(500).json({ message: 'Erro no servidor ao verificar o CPF' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Este CPF já está cadastrado.' });
    }

    const insertQuery = 'INSERT INTO avaliado (nome, cpf, genero, dataNascimento, empresa, cpf_gestor, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
    console.log('Consultando a inserção:', insertQuery, [nome, cpf, genero, dataNascimento, empresa, cpf_gestor, email]);

    db.execute(insertQuery, [nome, cpf, genero, dataNascimento, empresa, cpf_gestor, email], (err, result) => {
      if (err) {
        console.error('Erro ao inserir o avaliado: ', err.sqlMessage || err.message); // Mostra o erro do SQL
        return res.status(500).json({ message: err.sqlMessage || err.message }); // Envia o erro real para o front-end
      }
      res.status(201).json({
        message: 'Avaliado criado com sucesso!',
        avaliado: {
          id: result.insertId,
          nome,
          cpf,
          genero,
          dataNascimento,
          empresa,
          cpf_gestor,
          email
        }
      });
    });
  });
});

// Função de editar uma avaliado
// Obs.: para editar um avaliado é necessário sempre associá-lo a um gestor existente
app.put("/editarAvaliado/:cpf", (req, res) => {
  const cpf = req.params.cpf; // cpf é chave primária do avaliado, não pode mudar
  const { nome, genero, dataNascimento, empresa, email, cpf_gestor } = req.body;

  const sql = `
    UPDATE avaliado
    SET nome = ?, genero = ?, dataNascimento = ?, empresa = ?, email = ?, cpf_gestor = ?
    WHERE cpf = ?
  `;

  db.query(sql, [nome, genero, dataNascimento, empresa, email, cpf_gestor, cpf], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar avaliado:", err);
      return res.status(500).json({ error: "Erro interno ao atualizar avaliado" });
    }

    res.json({ message: "Avaliado atualizado com sucesso" });
  });
});

// Rota para consultar os dados de um avaliado específico * Atualizado para a Sprint 7
//Esta rota foi atualizada para fazer innerJoin na tabela de gestor, consultando o nome do gestor e retornando o mesmo no endpoint Sprint avaliação de gestor
app.get('/avaliado/:cpf', (req, res) => {
  const cpf = req.params.cpf;

  const query = `
    SELECT 
      a.cpf,
      a.nome,
      a.genero,
      a.dataNascimento,
      a.empresa,
      a.email,
      a.cpf_gestor,
      g.nome AS nome_gestor
    FROM avaliado a
    JOIN gestor g ON a.cpf_gestor = g.cpf
    WHERE a.cpf = ?
  `;

  db.execute(query, [cpf], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados: ', err);
      return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Avaliado não encontrado.' });
    }

    res.status(200).json(results[0]);
  });
});

// Rota para deletar um avaliado * essa função ainda está desatualizada, necessário atualizá-la ********************************
app.delete('/avaliado/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM avaliado WHERE id = ?';

  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao remover o avaliado: ', err);
      return res.status(500).json({ message: 'Erro ao remover o avaliado' });
    }

    res.status(200).json({ message: 'Avaliado removido com sucesso!' });
  });
});

// Rota para listar todas as competência
app.get('/competencias', (req, res) => {
  const query = 'SELECT id, competencia, tipo, descricao, ideal, bom, mediano, a_melhorar FROM competencias';

  db.execute(query, (err, results) => {
    if (err) {
      console.error('Erro ao consultar as competencias: ', err);
      return res.status(500).json({ message: 'Erro ao consultar as competencias' });
    }

    console.log('Resultados da consulta: ', results);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhuma competencia encontrada.' });
    }

    res.status(200).json(results);
  });
});

// Rota para consultar os dados de uma competência específica
app.get('/competencia/:id', (req, res) => {
  const id = req.params.id;

  const query = 'SELECT id, competencia, descricao, ideal, bom, mediano, a_melhorar WHERE id = ?';

  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados: ', err);
      return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'competencia não encontrada.' });
    }

    res.status(200).json(results[0]);
  });
});

//Rota para salvar uma avaliacao
//Obs. esta é uma nova rota que armazena os avaliados e competencias em tabelas separadas, visando melhor desempenho e escalabilidade
app.post('/adicionarAvaliacao', async (req, res) => {
  const {
    nomeAvaliacao,
    empresa,
    dataInicio,
    dataFim,
    descricao,
    textoFinal,
    avaliados,
    competencias
  } = req.body;

  try {
    // Inicia a transação
    await db.promise().query('START TRANSACTION');

    // 1. Insere a avaliação principal
    const [avaliacaoResult] = await db.promise().execute(
      `INSERT INTO avaliacoes (
        nomeAvaliacao,
        empresa,
        dataInicio,
        dataFim,
        descricao,
        textoFinal
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [nomeAvaliacao, empresa, dataInicio, dataFim, descricao, textoFinal]
    );

    const idAvaliacao = avaliacaoResult.insertId;

    // 2. Insere cada avaliado
    for (const avaliado of avaliados) {
      await db.promise().execute(
        `INSERT INTO avaliado_avaliacao (id_avaliacao, cpf_avaliado) VALUES (?, ?)`,
        [idAvaliacao, avaliado.cpf]
      );
    }

    // 3. Insere cada competência
    for (const competencia of competencias) {
      await db.promise().execute(
        `INSERT INTO competencia_avaliacao (id_avaliacao, id_competencia) VALUES (?, ?)`,
        [idAvaliacao, competencia.id]
      );
    }

    // Finaliza a transação
    await db.promise().query('COMMIT');

    res.status(201).json({
      message: 'Avaliação salva com sucesso!',
      id: idAvaliacao
    });

  } catch (error) {
    // Reverte a transação em caso de erro
    await db.promise().query('ROLLBACK');
    console.error('Erro ao salvar avaliação:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

//Rota para salvar uma avaliacao de Gestor
app.post('/adicionarAvaliacaoGestor', async (req, res) => {
  const {
    nomeAvaliacao,
    cpf_gestor,
    empresa,
    dataInicio,
    dataFim,
    descricao,
    textoFinal,
    avaliados,
    competencias
  } = req.body;

  try {
    // Inicia a transação
    await db.promise().query('START TRANSACTION');

    // 1. Insere a avaliação principal
    const [avaliacaoResult] = await db.promise().execute(
      `INSERT INTO avaliacoes_gestor (
        nomeAvaliacao,
        cpf_gestor,
        empresa,
        dataInicio,
        dataFim,
        descricao,
        textoFinal
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nomeAvaliacao, cpf_gestor, empresa, dataInicio, dataFim, descricao, textoFinal]
    );

    const idAvaliacao = avaliacaoResult.insertId;

    // 2. Insere cada avaliado
    for (const avaliado of avaliados) {
      await db.promise().execute(
        `INSERT INTO avaliado_avaliacao_gestor (id_avaliacao_gestor, cpf_avaliado) VALUES (?, ?)`,
        [idAvaliacao, avaliado.cpf]
      );
    }

    // 3. Insere cada competência
    for (const competencia of competencias) {
      await db.promise().execute(
        `INSERT INTO competencia_avaliacao_gestor (id_avaliacao_gestor, id_competencia) VALUES (?, ?)`,
        [idAvaliacao, competencia.id]
      );
    }

    // Finaliza a transação
    await db.promise().query('COMMIT');

    res.status(201).json({
      message: 'Avaliação de Gestor salva com sucesso!',
      id: idAvaliacao
    });

  } catch (error) {
    // Reverte a transação em caso de erro
    await db.promise().query('ROLLBACK');
    console.error('Erro ao salvar avaliação:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

//Criação de um token para o login de usuário

const crypto = require('crypto');

function gerarToken(payload) {
  const segredo = '417f09deb38ee7792974dee54a6b1319ead929ff89df2b0ba24fad43fcb1acd6';
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const assinatura = crypto.createHmac('sha256', segredo).update(base64Payload).digest('hex');
  return `${base64Payload}.${assinatura}`;
}

//Função para validar o token

function validarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  const segredo = '417f09deb38ee7792974dee54a6b1319ead929ff89df2b0ba24fad43fcb1acd6';

  if (!token) return res.status(401).json({ message: 'Token ausente.' });

  const [base64Payload, assinaturaRecebida] = token.split('.');
  const assinaturaEsperada = crypto.createHmac('sha256', segredo).update(base64Payload).digest('hex');

  if (assinaturaRecebida !== assinaturaEsperada) {
    return res.status(403).json({ message: 'Token inválido.' });
  }

  req.usuario = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
  next();
}

app.get('/verificaToken', validarToken, (req, res) => {
  res.status(200).json({ message: 'token valido', usuario: req.usuario });
});


// ----------- Rota para fazer login de usuário / colaborador ou gestor -------------------------------------------

app.post('/loginUsuario', (req, res) => {
  const { cpf, tipoCargo } = req.body;


  const cleanCpf = cpf.replace(/\D/g, '');



  if (!cleanCpf || cleanCpf.length !== 11 || !tipoCargo) {
    return res.status(400).json({ message: 'CPF e tipo de cargo são obrigatórios.' });
  }

  // Aqui você pode consultar o banco conforme o tipoCargo
  const query = tipoCargo === 'colaborador'
    ? `SELECT * FROM avaliado WHERE cpf = ?`
    : `SELECT * FROM gestor WHERE cpf = ?`;

  db.execute(query, [cleanCpf], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor.', err });


    if (results.length === 0) {
      return res.status(401).json({ message: 'Nenhum cpf encontrado.' });
    }

    const token = gerarToken({ cpf: cleanCpf, tipoCargo });
    res.status(200).json({ token });
  });
});



// ----------- Rota para consultar a descrição da avaliação da tabela avaliacoes usuário / avaliado -------------------------------------------

app.post('/descricaoPoridAvaliacao', (req, res) => {
  const { idAvaliacao } = req.body;

  if (!idAvaliacao) {
    return res.status(400).json({ message: 'idAvaliacao é obrigatório.' });
  }

  const query = `
    SELECT descricao FROM avaliacoes
    WHERE id = ?
`;

  db.execute(query, [idAvaliacao], (err, results) => {
    if (err) {
      console.error('Erro ao buscar descrição:', err);
      return res.status(500).json({ message: 'Erro ao buscar a descrição.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Descrição não encontrada para esse CPF.' });
    }

    return res.status(200).json({ descricao: results[0].descricao });
  });
});

// ----------- Rota para consultar a descrição da avaliação da tabela avaliacoes usuário / avaliado -------------------------------------------

app.post('/descricaoPoridAvaliacaoGestor', (req, res) => {
  const { idAvaliacao } = req.body;

  if (!idAvaliacao) {
    return res.status(400).json({ message: 'idAvaliacao é obrigatório.' });
  }

  const query = `
    SELECT descricao FROM avaliacoes_gestor
    WHERE id = ?
`;

  db.execute(query, [idAvaliacao], (err, results) => {
    if (err) {
      console.error('Erro ao buscar descrição:', err);
      return res.status(500).json({ message: 'Erro ao buscar a descrição.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Descrição não encontrada para esse CPF.' });
    }

    return res.status(200).json({ descricao: results[0].descricao });
  });
});

// ----------- Rota para consultar as competencias da avaliação da tabela avaliacoes usuário / avaliado -------------------------------------------


// Rota para listar todas as avaliações por cpf *** ** *** 

app.post('/listarAvaliacoes', validarToken, (req, res) => {
  const { cpf } = req.usuario; // ← vem do token

  if (!cpf) {
    return res.status(400).json({ message: 'CPF não encontrado no token.' });
  }

  const cleanCpf = cpf.replace(/[^\d]/g, '');

  const query = `
    SELECT 
      a.id,
      a.nomeAvaliacao,
      a.empresa,
      DATE_FORMAT(a.dataInicio, '%d/%m/%Y') AS dataInicio,
      DATE_FORMAT(a.dataFim, '%d/%m/%Y') AS dataFim,
      a.descricao,
      a.textoFinal
    FROM avaliacoes a
    INNER JOIN avaliado_avaliacao aa ON a.id = aa.id_avaliacao
    WHERE aa.cpf_avaliado = ?
      AND a.id NOT IN (
        SELECT id_avaliacao FROM respostas_avaliacao WHERE cpf_avaliado = ?
      )
  `;

  db.execute(query, [cleanCpf, cleanCpf], (err, results) => {
    if (err) {
      console.error('Erro ao consultar as avaliações: ', err);
      return res.status(500).json({ message: 'Erro ao consultar as avaliações.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhuma avaliação disponível.' });
    }

    return res.status(200).json({
      avaliacoes: results.map(({ id, nomeAvaliacao, empresa, dataInicio, dataFim, descricao, textoFinal }) => ({
        id,
        nomeAvaliacao,
        empresa,
        dataInicio,
        dataFim,
        descricao,
        textoFinal
      }))
    });
  });
});

app.post('/listarTodasAvaliacoes', validarToken, (req, res) => {
  const { cpf } = req.usuario; // ← vem do token

  if (!cpf) {
    return res.status(400).json({ message: 'CPF não encontrado no token.' });
  }

  const cleanCpf = cpf.replace(/[^\d]/g, '');

  const query = `
    SELECT id, 
    nomeAvaliacao, 
    empresa, 
    DATE_FORMAT(dataInicio, '%d/%m/%Y') AS dataInicio, 
    DATE_FORMAT(dataFim, '%d/%m/%Y') AS dataFim, 
    descricao, textoFinal, 
    data_criacao 
    FROM avaliacoes
  `;

  db.execute(query, [cleanCpf], (err, results) => {
    if (err) {
      console.error('Erro ao consultar as avaliações: ', err);
      return res.status(500).json({ message: 'Erro ao consultar as avaliações.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhuma avaliação disponível.' });
    }

    return res.status(200).json({
      avaliacoes: results.map(({ id, nomeAvaliacao, empresa, dataInicio, dataFim, descricao, textoFinal, data_criacao }) => ({
        id,
        nomeAvaliacao,
        empresa,
        dataInicio,
        dataFim,
        descricao,
        textoFinal,
        data_criacao
      }))
    });
  });
});


// Função utilitária para normalizar CPF
function normalizarCpf(cpf) {
  return String(cpf).replace(/\D/g, "");
}


//Rota GET para consultar uma avaliação por id (autoavaliacao)
app.get("/avaliacoes/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
  SELECT 
    -- Dados da avaliação
    a.nomeAvaliacao,
    a.empresa,
    a.descricao,
    a.textoFinal,

    -- Dados dos avaliados
    av.cpf AS cpf_avaliado,
    av.nome AS nome_avaliado,
    av.genero,
    av.dataNascimento,
    av.empresa AS empresa_avaliado,
    av.email,
    av.cpf_gestor,

    -- Nome do gestor associado ao avaliado
    g.nome AS nome_gestor,

    -- Dados das competências
    c.id AS id_competencia,
    c.competencia AS nome_competencia,
    c.tipo,
    c.descricao AS descricao_competencia,
    c.ideal,
    c.bom,
    c.mediano,
    c.a_melhorar

    FROM avaliacoes a
    LEFT JOIN avaliado_avaliacao aa ON aa.id_avaliacao = a.id
    LEFT JOIN avaliado av ON av.cpf = aa.cpf_avaliado

    -- ✅ JOIN correto para pegar o gestor
    LEFT JOIN gestor g ON g.cpf = av.cpf_gestor

    LEFT JOIN competencia_avaliacao ca ON ca.id_avaliacao = a.id
    LEFT JOIN competencias c ON c.id = ca.id_competencia

    WHERE a.id = ?;
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json(err);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Avaliação não encontrada" });
    }

    // ✅ METADADOS — iguais em todas as linhas
    const metadados = {
      nomeAvaliacao: rows[0].nomeAvaliacao,
      empresa: rows[0].empresa,
      descricao: rows[0].descricao,
      textoFinal: rows[0].textoFinal
    };

    // ✅ AGRUPAR AVALIADOS (evitar duplicados)
    const avaliadosMap = new Map();

    rows.forEach(r => {
      if (r.cpf_avaliado) {
        avaliadosMap.set(r.cpf_avaliado, {
          cpf: r.cpf_avaliado,
          nome: r.nome_avaliado,
          genero: r.genero,
          empresa: r.empresa_avaliado,
          dataNascimento: r.dataNascimento,
          email: r.email,
          cpf_gestor: r.cpf_gestor,
          nome_gestor: r.nome_gestor
        });
      }
    });

    const avaliados = Array.from(avaliadosMap.values());

    // ✅ AGRUPAR COMPETÊNCIAS (evitar duplicados)
    const competenciasMap = new Map();

    rows.forEach(r => {
      if (r.id_competencia) {
        competenciasMap.set(r.id_competencia, {
          id: r.id_competencia,
          competencia: r.nome_competencia,
          tipo: r.tipo,
          descricao: r.descricao_competencia,
          ideal: r.ideal,
          bom: r.bom,
          mediano: r.mediano,
          a_melhorar: r.a_melhorar
        });
      }
    });

    const competencias = Array.from(competenciasMap.values());

    // ✅ OBJETO FINAL PARA O FRONT
    const resultado = {
      metadados,
      avaliados,
      competencias
    };

    res.json(resultado);
  });
});


// Rota GET para consultar avaliações de um avaliado
app.get("/avaliacoes/:cpf", (req, res) => {
  const cpf = normalizarCpf(req.params.cpf);

  const sql = `
    SELECT
      a.id,
      a.nomeAvaliacao,
      a.dataInicio,
      a.dataFim,
      MAX(g.nome) AS nome_gestor_resposta,
      CASE WHEN MAX(r.data_resposta) IS NOT NULL THEN 'Sim' ELSE 'Não' END AS respondida,
      MAX(r.data_resposta) AS data_resposta
    FROM avaliado_avaliacao AS aa
    INNER JOIN avaliacoes AS a
      ON a.id = aa.id_avaliacao
    LEFT JOIN respostas_avaliacao AS r
      ON r.id_avaliacao = aa.id_avaliacao
     AND r.cpf_avaliado = aa.cpf_avaliado
    LEFT JOIN gestor AS g
      ON g.cpf = r.cpf_gestor   -- gestor da resposta, se existir
    WHERE aa.cpf_avaliado = ?
    GROUP BY a.id, a.nomeAvaliacao, a.dataInicio, a.dataFim;
  `;

  db.query(sql, [cpf], (err, rows) => {
    if (err) {
      console.error("Erro ao consultar avaliações:", err);
      return res.status(500).json({ error: "Erro interno ao consultar avaliações" });
    }

    // Retorno pronto para o front
    const resultado = rows.map(r => ({
      nomeAvaliacao: r.nomeAvaliacao,
      dataInicio: r.dataInicio,
      dataFim: r.dataFim,
      gestor: r.nome_gestor_resposta || null,   // corrigido: pega do objeto r
      respondida: r.respondida,
      dataResposta: r.data_resposta || null
    }));

    res.json(resultado);
  });
});



// Rota para listar todas as avaliações por cpf *** ** *** 

app.post('/listarAvaliacoesGestor', validarToken, (req, res) => {
  const { cpf } = req.usuario; // ← vem do token

  if (!cpf) {
    return res.status(400).json({ message: 'CPF não encontrado no token.' });
  }

  const cleanCpf = cpf.replace(/[^\d]/g, '');

  const query = `
    SELECT 
      id,
      nomeAvaliacao,
      empresa,
      DATE_FORMAT(dataInicio, '%d/%m/%Y') AS dataInicio,
      DATE_FORMAT(dataFim, '%d/%m/%Y') AS dataFim,
      cpf_gestor,
      descricao,
      textoFinal
    FROM avaliacoes_gestor
    WHERE cpf_gestor = ?
      AND id NOT IN (
        SELECT id_avaliacao_gestor FROM respostas_avaliacao_gestor WHERE cpf_gestor = ?
      )
  `;

  db.execute(query, [cleanCpf, cleanCpf], (err, results) => {
    if (err) {
      console.error('Erro ao consultar as avaliações: ', err);
      return res.status(500).json({ message: 'Erro ao consultar as avaliações.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhuma avaliação disponível.' });
    }

    return res.status(200).json({
      avaliacoes: results.map(({ id, nomeAvaliacao, empresa, dataInicio, dataFim, descricao, textoFinal }) => ({
        id,
        nomeAvaliacao,
        empresa,
        dataInicio,
        dataFim,
        descricao,
        textoFinal
      }))
    });
  });
});

app.post('/listarTodasAvaliacoesGestor', validarToken, (req, res) => {
  const { cpf } = req.usuario; // ← vem do token

  if (!cpf) {
    return res.status(400).json({ message: 'CPF não encontrado no token.' });
  }

  const cleanCpf = cpf.replace(/[^\d]/g, '');

  const query = `
    SELECT id, 
    nomeAvaliacao, 
    cpf_gestor,
    empresa, 
    DATE_FORMAT(dataInicio, '%d/%m/%Y') AS dataInicio, 
    DATE_FORMAT(dataFim, '%d/%m/%Y') AS dataFim, 
    descricao, textoFinal, 
    data_criacao 
    FROM avaliacoes_gestor
  `;

  db.execute(query, [cleanCpf], (err, results) => {
    if (err) {
      console.error('Erro ao consultar as avaliações: ', err);
      return res.status(500).json({ message: 'Erro ao consultar as avaliações.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhuma avaliação disponível.' });
    }

    return res.status(200).json({
      avaliacoes: results.map(({ id, nomeAvaliacao, cpf_gestor, empresa, dataInicio, dataFim, descricao, textoFinal, data_criacao }) => ({
        id,
        nomeAvaliacao,
        cpf_gestor,
        empresa,
        dataInicio,
        dataFim,
        descricao,
        textoFinal,
        data_criacao
      }))
    });
  });
});



//Utilizado para carregar as competencias do banco, com base na avaliação salva
app.post('/competenciaPoridAvaliacao', (req, res) => {
  const { idAvaliacao } = req.body;

  if (!idAvaliacao) {
    return res.status(400).json({ message: 'idAvaliacao não encontrado' });
  }

  console.log('Buscando competências da avaliação:', idAvaliacao);

  const query = `    
  SELECT c.id, c.competencia AS nome, c.descricao, c.ideal, c.bom, c.mediano, c.a_melhorar
  FROM competencias c
  INNER JOIN competencia_avaliacao ca ON c.id = ca.id_competencia
  WHERE ca.id_avaliacao = ?
  `;

  db.execute(query, [idAvaliacao], (err, results) => {
    if (err) {
      console.error('Erro ao buscar competências:', err);
      return res.status(500).json({ message: 'Erro ao buscar as competências.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhuma competência encontrada para esta avaliação.' });
    }

    return res.status(200).json({ competencias: results });
  });
});

//Busca as competencias para a avaliacao de gestor
app.post('/competenciaPoridAvaliacaoGestor', (req, res) => {
  const { idAvaliacao } = req.body;

  if (!idAvaliacao) {
    return res.status(400).json({ message: 'idAvaliacao não encontrado' });
  }

  console.log('Buscando competências da avaliação:', idAvaliacao);

  const query = `    
  SELECT c.id, c.competencia AS nome, c.descricao, c.ideal, c.bom, c.mediano, c.a_melhorar
  FROM competencias c
  INNER JOIN competencia_avaliacao_gestor ca ON c.id = ca.id_competencia
  WHERE ca.id_avaliacao_gestor = ?
  `;

  db.execute(query, [idAvaliacao], (err, results) => {
    if (err) {
      console.error('Erro ao buscar competências:', err);
      return res.status(500).json({ message: 'Erro ao buscar as competências.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhuma competência encontrada para esta avaliação.' });
    }

    return res.status(200).json({ competencias: results });
  });
});

//Busca os avaliados para a avaliação de gestor
app.post('/avaliadosPoridAvaliacaoGestor', validarToken, (req, res) => {
  const { idAvaliacao } = req.body;

  if (!idAvaliacao) {
    return res.status(400).json({ message: 'idAvaliacao Não encontrado' });
  }

  const query = `      
    SELECT a.cpf, a.nome
    FROM avaliado a
    INNER JOIN avaliado_avaliacao_gestor aa ON a.cpf = aa.cpf_avaliado
    WHERE aa.id_avaliacao_gestor = ?
  `;

  db.execute(query, [idAvaliacao], (err, results) => {
    if (err) {
      console.error('Erro ao consultar os avaliados: ', err);
      return res.status(500).json({ message: 'Erro ao consultar os avaliados.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhuma avaliado disponível.' });
    }

    return res.status(200).json({
      avaliados: results.map(({ cpf, nome }) => ({
        cpf,
        nome
      }))
    });
  });
});


//Rota para consultar as respostas especificas de um avaliado em uma avaliação *******
//Essa função usa o if_avaliacao como parâmetro para iterar sobre todas as linhas da tabela de respostas e devolve apenas os CPF's que responderam, sem repetir valores.

app.get('/respostasAvaliadosGeral/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT DISTINCT cpf_avaliado FROM `respostas_avaliacao` WHERE id_avaliacao = ?';

  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados: ', err);
      return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhum avaliado respondeu ainda' });
    }

    return res.status(200).json({ results });
  });
});


//Rota para consultar as respostas especificas de um avaliado em uma avaliação *******

app.get('/respostas_avaliacao/:id/:cpf', (req, res) => {
  const { id, cpf } = req.params;

  const query = 'SELECT * FROM `respostas_avaliacao` WHERE id_avaliacao = ? and cpf_avaliado = ?';

  db.execute(query, [id, cpf], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados: ', err);
      return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Avaliado não encontrado.' });
    }

    res.status(200).json(results);
  });
});

//Adicione uma nova rota para salvar as respostas:
app.post('/salvarResposta', validarToken, (req, res) => {
  const { idAvaliacao, competencias } = req.body;
  const cpf = req.usuario?.cpf;

  if (!idAvaliacao || !cpf || !Array.isArray(competencias)) {
    return res.status(400).json({ message: 'Dados incompletos.' });
  }

  const cleanCpf = cpf.replace(/[^\d]/g, '');
  const competenciasIds = competencias.map(c => c.idCompetencia);

  // Validação: verificar se todas as competências existem
  const placeholders = competenciasIds.map(() => '?').join(',');
  const checkCompetenciasQuery = `SELECT id FROM competencias WHERE id IN (${placeholders})`;

  db.execute(checkCompetenciasQuery, competenciasIds, (err, results) => {
    if (err) {
      console.error('Erro ao validar competências:', err);
      return res.status(500).json({ message: 'Erro ao validar competências.' });
    }

    const encontrados = results.map(r => r.id);
    const faltando = competenciasIds.filter(id => !encontrados.includes(id));

    if (faltando.length > 0) {
      return res.status(400).json({
        message: `As seguintes competências não existem no banco: ${faltando.join(', ')}`
      });
    }

    // Verifica se o CPF já respondeu essa avaliação
    const checkQuery = `
      SELECT COUNT(*) AS total 
      FROM respostas_avaliacao 
      WHERE id_avaliacao = ? AND cpf_avaliado = ?
    `;

    db.execute(checkQuery, [idAvaliacao, cleanCpf], (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao verificar resposta existente.' });

      if (results[0].total > 0) {
        return res.status(400).json({ message: 'Esta avaliação já foi respondida por este CPF.' });
      }

      db.execute(
        'SELECT cpf_gestor FROM avaliado WHERE cpf = ?',
        [cleanCpf],
        (err, results) => {
          if (err) {
            console.error('Erro na consulta:', err);
            return res.status(500).json({ message: 'Erro ao buscar CPF do gestor.' });
          }

          if (results.length === 0) {
            return res.status(400).json({ message: 'Nenhum gestor encontrado para esse CPF.' });
          }


          const cpfGestor = results[0].cpf_gestor;

          // Inicia a transação para salvar as respostas
          db.beginTransaction(err => {
            if (err) return res.status(500).json({ message: 'Erro na transação inicial.' });

            const insertPromises = competencias.map(comp => {
              return new Promise((resolve, reject) => {
                const query = `
              INSERT INTO respostas_avaliacao (
                id_avaliacao,
                cpf_gestor,
                cpf_avaliado,
                id_competencia,
                respostas,
                observacoes,
                data_resposta
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

                const values = [
                  idAvaliacao,
                  cpfGestor,
                  cleanCpf,
                  comp.idCompetencia,
                  comp.valor,
                  comp.observacoes || '',
                  comp.dataResposta || new Date()
                ];

                db.execute(query, values, (err, result) => {
                  if (err) return reject(err);
                  resolve(result);
                });
              });
            });

            Promise.all(insertPromises)
              .then(() => {
                db.commit(err => {
                  if (err) {
                    return db.rollback(() => {
                      res.status(500).json({ message: 'Erro ao finalizar transação.' });
                    });
                  }
                  res.status(200).json({ success: true });
                });
              })
              .catch(error => {
                console.error('Erro durante inserção:', error);
                db.rollback(() => {
                  res.status(500).json({ message: 'Erro ao salvar respostas.' });
                });
              });
          });
        });
    });
  });
});

//Rota para salvar as respostas do Gestor
app.post('/salvarRespostaGestor', validarToken, (req, res) => {
  const { idAvaliacao, competencias } = req.body;
  const cpf = req.usuario?.cpf;

  if (!idAvaliacao || !cpf || !Array.isArray(competencias)) {
    return res.status(400).json({ message: 'Dados incompletos.' });
  }

  const cleanCpf = cpf.replace(/[^\d]/g, '');
  const competenciasIds = competencias.map(c => c.idCompetencia);

  // Validação: verificar se todas as competências existem
  const placeholders = competenciasIds.map(() => '?').join(',');
  const checkCompetenciasQuery = `SELECT id FROM competencias WHERE id IN (${placeholders})`;

  db.execute(checkCompetenciasQuery, competenciasIds, (err, results) => {
    if (err) {
      console.error('Erro ao validar competências:', err);
      return res.status(500).json({ message: 'Erro ao validar competências.' });
    }

    const encontrados = results.map(r => r.id);
    const faltando = competenciasIds.filter(id => !encontrados.includes(id));

    if (faltando.length > 0) {
      return res.status(400).json({
        message: `As seguintes competências não existem no banco: ${faltando.join(', ')}`
      });
    }

    // Verifica se o CPF já respondeu essa avaliação
    const checkQuery = `
      SELECT COUNT(*) AS total 
      FROM respostas_avaliacao_gestor
      WHERE id_avaliacao_gestor = ? AND cpf_gestor = ?
    `;

    db.execute(checkQuery, [idAvaliacao, cleanCpf], (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao verificar resposta existente.' });

      if (results[0].total > 0) {
        return res.status(400).json({ message: 'Esta avaliação já foi respondida por este CPF.' });
      }

      // Inicia a transação para salvar as respostas
      db.beginTransaction(err => {
        if (err) return res.status(500).json({ message: 'Erro na transação inicial.' });

        const insertPromises = competencias.map(comp => {
          return new Promise((resolve, reject) => {
            const query = `
              INSERT INTO respostas_avaliacao_gestor (
                cpf_gestor,
                id_avaliacao_gestor,
                cpf_avaliado,
                id_competencia,
                respostas,
                observacoes,
                data_resposta
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
              cleanCpf,
              idAvaliacao,
              comp.cpf,
              comp.idCompetencia,
              comp.valor,
              comp.observacoes || '',
              comp.dataResposta || new Date()
            ];

            console.log("values: ", values);

            db.execute(query, values, (err, result) => {
              if (err) return reject(err);
              resolve(result);
            });
          });
        });

        Promise.all(insertPromises)
          .then(() => {
            db.commit(err => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ message: 'Erro ao finalizar transação.' });
                });
              }
              res.status(200).json({ success: true });
            });
          })
          .catch(error => {
            console.error('Erro durante inserção:', error);
            db.rollback(() => {
              res.status(500).json({ message: 'Erro ao salvar respostas.' });
            });
          });
      });
    });
  });
});
// rota para efetuar o filtro nas avalicoes 
app.get('/avaliacoes', (req, res) => {
  const sql = `
    SELECT 
      id,
      nomeAvaliacao, 
      empresa, 
      dataInicio, 
      dataFim
    FROM avaliacoes
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar avaliações:', err.message);
      return res.status(500).json({ error: err.message });
    }

    const hoje = new Date();

    const dados = results.map(row => {
      const dataFim = new Date(row.dataFim);
      const status = dataFim >= hoje ? 'Em andamento' : 'Encerrada';
      return { ...row, status };
    });

    res.json(dados);
  });
});

// Rota para consultar as informações da avaliação selecionada para o dashboard (adaptei do código feito para consultar competências).
app.post('/dashboardPoridAvaliacao', (req, res) => {
  const { idAvaliacao } = req.body;

  if (!idAvaliacao) {
    return res.status(400).json({ message: 'idAvaliacao não encontrado' });
  }

  console.log('Buscando dados da avaliação:', idAvaliacao);

  const query = `
    SELECT 
      a.nomeAvaliacao,
      a.empresa,
      a.dataInicio,
      a.dataFim,
      av.cpf AS cpf_avaliado,
      av.nome AS nome_avaliado
    FROM avaliacoes a
    INNER JOIN avaliado_avaliacao aa ON a.id = aa.id_avaliacao
    INNER JOIN avaliado av ON aa.cpf_avaliado = av.cpf
    WHERE a.id = ?
  `;

  db.execute(query, [idAvaliacao], (err, results) => {
    if (err) {
      console.error('Erro ao buscar informações da avaliação:', err);
      return res.status(500).json({ message: 'Erro ao buscar as informações da avaliação.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhuma informação encontrada para essa avaliação.' });
    }

    // Extrai os dados da avaliação (são iguais em todas as linhas)
    const { nomeAvaliacao, empresa, dataInicio, dataFim } = results[0];

    // Mapeia os avaliados diretamente
    const dadosAvaliados = results.map(r => ({
      nome: r.nome_avaliado,
      cpf: r.cpf_avaliado
    }));

    const informacoes = {
      nomeAvaliacao,
      empresa,
      dataInicio,
      dataFim,
      quantidadeAvaliados: dadosAvaliados.length,
      avaliados: dadosAvaliados
    };

    return res.status(200).json({ informacoes });
  });
});


app.listen(port, () => {
  console.log('Servidor rodando');
});