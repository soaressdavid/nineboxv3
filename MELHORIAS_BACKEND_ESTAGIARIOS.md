# Melhorias Backend - Tarefas para a Equipe

Pessoal, separei aqui algumas melhorias que precisamos fazer no backend do sistema. Dividi as tarefas entre vocês 3 de acordo com o que cada um pode ir aprendendo. São coisas simples mas importantes pro projeto.

---

## 📋 Pessoa 1: Validações Básicas e Mensagens de Erro

### O que você vai fazer
Melhorar as validações de dados e deixar as mensagens de erro mais claras pro usuário.

### Tarefas

#### 1.1 Adicionar Validações Simples nos Services
**Prioridade:** Alta  
**Tempo estimado:** 4-6 horas

**Por que estamos fazendo isso:**
Atualmente o sistema aceita qualquer dado que vem do frontend e só descobre que está errado quando tenta salvar no banco. Isso causa erros feios e confusos pro usuário. Precisamos validar antes pra dar mensagens claras do que está errado.

**Descrição:**
Adicionar validações básicas antes de salvar dados no banco.

**O que fazer:**
- Validar formato de email
- Validar CPF (11 dígitos)
- Validar campos obrigatórios
- Validar tamanho mínimo/máximo de strings

**Exemplo:**
```javascript
// src/utils/validators.js
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarCPF(cpf) {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.length === 11;
}

function validarNome(nome) {
  return nome && nome.trim().length >= 3;
}

// Uso no service
async function createGestor({ nome, cpf, email, empresa, senha }) {
  // Validações
  if (!validarNome(nome)) {
    throw serviceError(400, { message: 'Nome deve ter no mínimo 3 caracteres.' });
  }
  
  if (!validarEmail(email)) {
    throw serviceError(400, { message: 'Email inválido.' });
  }
  
  if (!validarCPF(cpf)) {
    throw serviceError(400, { message: 'CPF deve ter 11 dígitos.' });
  }
  
  // ... resto do código
}
```

**Arquivos a modificar:**
- `src/services/gestorService.js`
- `src/services/avaliadoService.js`
- `src/services/competenciaService.js`

---

#### 1.2 Melhorar Mensagens de Erro
**Prioridade:** Alta  
**Tempo estimado:** 3-4 horas

**Por que estamos fazendo isso:**
As mensagens de erro atuais são genéricas tipo "Erro 400" ou "Bad Request". O usuário não entende o que fez de errado. Precisamos de mensagens claras em português dizendo exatamente qual campo está com problema.

**Descrição:**
Padronizar e melhorar as mensagens de erro retornadas pela API.

**O que fazer:**
- Criar mensagens claras e em português
- Adicionar código de erro
- Incluir campo que causou o erro

**Exemplo:**
```javascript
// src/utils/errorMessages.js
const ERROR_MESSAGES = {
  REQUIRED_FIELD: (field) => `O campo ${field} é obrigatório.`,
  INVALID_EMAIL: 'Email inválido.',
  INVALID_CPF: 'CPF deve conter 11 dígitos.',
  NOT_FOUND: (entity) => `${entity} não encontrado(a).`,
  ALREADY_EXISTS: (entity) => `${entity} já existe.`,
  MIN_LENGTH: (field, min) => `${field} deve ter no mínimo ${min} caracteres.`
};

// Uso
throw serviceError(400, { 
  message: ERROR_MESSAGES.INVALID_EMAIL,
  field: 'email'
});
```

---

#### 1.3 Adicionar Validação de Datas
**Prioridade:** Média  
**Tempo estimado:** 2-3 horas

**Por que estamos fazendo isso:**
Já aconteceu de criarem avaliações com data de fim antes da data de início, ou com datas no passado. Isso quebra a lógica do sistema e confunde os usuários. Precisamos validar isso antes de salvar.

**Descrição:**
Validar datas de início e fim de avaliações.

**O que fazer:**
- Verificar se data de início é anterior à data de fim
- Verificar se datas não são no passado
- Validar formato de data

**Exemplo:**
```javascript
// src/utils/validators.js
function validarPeriodoAvaliacao(startDate, endDate) {
  const inicio = new Date(startDate);
  const fim = new Date(endDate);
  const hoje = new Date();
  
  if (inicio >= fim) {
    return { valid: false, message: 'Data de início deve ser anterior à data de fim.' };
  }
  
  if (fim < hoje) {
    return { valid: false, message: 'Data de fim não pode ser no passado.' };
  }
  
  return { valid: true };
}
```

---

## 📋 Pessoa 2: Melhorias em Listagens e Filtros

### O que você vai fazer
Adicionar funcionalidades de busca e filtro nas listagens pra facilitar a vida do usuário.

### Tarefas

#### 2.1 Adicionar Busca por Nome
**Prioridade:** Alta  
**Tempo estimado:** 4-5 horas

**Por que estamos fazendo isso:**
Quando tem muitos gestores ou colaboradores cadastrados, fica difícil achar alguém específico. O usuário tem que ficar rolando a lista inteira. Uma busca simples vai facilitar muito a vida de quem usa o sistema.

**Descrição:**
Permitir buscar gestores e colaboradores por nome.

**O que fazer:**
- Adicionar parâmetro `search` nas rotas de listagem
- Implementar busca case-insensitive
- Buscar em nome e email

**Exemplo:**
```javascript
// src/services/gestorService.js
async function listGestores(search = '') {
  const where = { active: true };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  const managers = await db.manager.findMany({
    where,
    orderBy: { name: 'asc' }
  });
  
  return managers.map(mgr => ({
    id: mgr.id,
    nome: mgr.name,
    email: mgr.email,
    cpf: mgr.registrationId,
    empresa: mgr.company
  }));
}

// src/controllers/gestorController.js
async function listGestoresController(req, res) {
  try {
    const { search } = req.query;
    const result = await listGestores(search);
    res.json(result);
  } catch (error) {
    controllerError(res, error);
  }
}
```

**Arquivos a modificar:**
- `src/services/gestorService.js`
- `src/services/avaliadoService.js`
- `src/controllers/gestorController.js`
- `src/controllers/avaliadoController.js`

---

#### 2.2 Adicionar Filtro por Empresa
**Prioridade:** Média  
**Tempo estimado:** 2-3 horas

**Por que estamos fazendo isso:**
O sistema vai ser usado por várias empresas. Quando o gestor quer ver só os colaboradores da empresa dele, tem que procurar manualmente. Um filtro simples resolve isso.

**Descrição:**
Filtrar listagens por empresa.

**O que fazer:**
- Adicionar parâmetro `empresa` nas rotas
- Filtrar resultados pela empresa

**Exemplo:**
```javascript
async function listGestores(search = '', empresa = '') {
  const where = { active: true };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (empresa) {
    where.company = { contains: empresa, mode: 'insensitive' };
  }
  
  const managers = await db.manager.findMany({
    where,
    orderBy: { name: 'asc' }
  });
  
  return managers;
}
```

---

#### 2.3 Adicionar Ordenação
**Prioridade:** Baixa  
**Tempo estimado:** 2-3 horas

**Por que estamos fazendo isso:**
Às vezes o usuário quer ver a lista em ordem alfabética, outras vezes quer ver os mais recentes primeiro. Dar essa opção deixa o sistema mais flexível e profissional.

**Descrição:**
Permitir ordenar listagens por diferentes campos.

**O que fazer:**
- Adicionar parâmetros `sortBy` e `order`
- Implementar ordenação por nome, email, data

**Exemplo:**
```javascript
async function listGestores(search = '', empresa = '', sortBy = 'name', order = 'asc') {
  const where = { active: true };
  
  // ... filtros ...
  
  const orderBy = {};
  orderBy[sortBy] = order;
  
  const managers = await db.manager.findMany({
    where,
    orderBy
  });
  
  return managers;
}
```

---

## 📋 Pessoa 3: Relatórios e Estatísticas

### O que você vai fazer
Criar funcionalidades de relatórios e estatísticas das avaliações.

### Tarefas

#### 3.1 Criar Endpoint de Estatísticas de Avaliações
**Prioridade:** Alta  
**Tempo estimado:** 5-6 horas

**Por que estamos fazendo isso:**
Os gestores querem ter uma visão geral do sistema: quantas avaliações estão ativas, quantos colaboradores já responderam, etc. Sem isso, eles ficam perdidos sem saber o status geral das avaliações.

**Descrição:**
Criar endpoint que retorna estatísticas gerais das avaliações.

**O que fazer:**
- Contar total de avaliações por status
- Contar total de colaboradores avaliados
- Calcular média de respostas por avaliação
- Listar avaliações em andamento

**Exemplo:**
```javascript
// src/services/avaliacaoService.js
async function getEstatisticas() {
  // Total de avaliações por status
  const totalDraft = await db.evaluation.count({ where: { status: 'draft' } });
  const totalActive = await db.evaluation.count({ where: { status: 'active' } });
  const totalClosed = await db.evaluation.count({ where: { status: 'closed' } });
  
  // Total de colaboradores com avaliações
  const totalAvaliados = await db.evaluationParticipant.count();
  
  // Total de respostas
  const totalRespostas = await db.response.count();
  
  return {
    avaliacoes: {
      rascunho: totalDraft,
      ativas: totalActive,
      encerradas: totalClosed,
      total: totalDraft + totalActive + totalClosed
    },
    colaboradores_avaliados: totalAvaliados,
    total_respostas: totalRespostas
  };
}

// src/controllers/avaliacaoController.js
async function getEstatisticasController(req, res) {
  try {
    const result = await getEstatisticas();
    res.json(result);
  } catch (error) {
    controllerError(res, error);
  }
}

// src/routes/avaliacaoRoutes.js
router.get('/estatisticas', getEstatisticasController);
```

---

#### 3.2 Criar Relatório de Avaliação Individual
**Prioridade:** Alta  
**Tempo estimado:** 5-6 horas

**Por que estamos fazendo isso:**
Quando um gestor quer ver como um colaborador específico respondeu uma avaliação, ele precisa de um relatório completo. Isso é essencial pra dar feedback e fazer a análise de desempenho.

**Descrição:**
Endpoint que retorna todas as respostas de um colaborador em uma avaliação específica.

**O que fazer:**
- Buscar todas as respostas do colaborador
- Incluir informações da competência
- Calcular pontuação total (se aplicável)
- Formatar dados para exibição

**Exemplo:**
```javascript
// src/services/respostaService.js
async function getRelatorioAvaliacao(evaluationId, employeeId) {
  // Busca a avaliação
  const evaluation = await db.evaluation.findUnique({
    where: { id: parseInt(evaluationId) },
    include: {
      manager: {
        select: { name: true, registrationId: true }
      }
    }
  });
  
  if (!evaluation) {
    throw serviceError(404, { message: 'Avaliação não encontrada.' });
  }
  
  // Busca o colaborador
  const employee = await db.employee.findUnique({
    where: { id: parseInt(employeeId) }
  });
  
  if (!employee) {
    throw serviceError(404, { message: 'Colaborador não encontrado.' });
  }
  
  // Busca todas as respostas
  const responses = await db.response.findMany({
    where: {
      evaluationId: parseInt(evaluationId),
      employeeId: parseInt(employeeId)
    },
    include: {
      competency: {
        select: {
          name: true,
          type: true,
          description: true
        }
      }
    }
  });
  
  return {
    avaliacao: {
      id: evaluation.id,
      nome: evaluation.name,
      tipo: evaluation.type,
      periodo: {
        inicio: evaluation.startDate,
        fim: evaluation.endDate
      }
    },
    colaborador: {
      nome: employee.name,
      ra: employee.registrationId,
      email: employee.email
    },
    gestor: {
      nome: evaluation.manager.name,
      cpf: evaluation.manager.registrationId
    },
    respostas: responses.map(r => ({
      competencia: r.competency.name,
      tipo: r.competency.type,
      resposta: r.response,
      observacao: r.observation,
      data: r.submittedAt
    })),
    total_competencias: responses.length
  };
}

// src/controllers/respostaController.js
async function getRelatorioAvaliacaoController(req, res) {
  try {
    const { evaluationId, employeeId } = req.params;
    const result = await getRelatorioAvaliacao(evaluationId, employeeId);
    res.json(result);
  } catch (error) {
    controllerError(res, error);
  }
}

// src/routes/respostasRoutes.js
router.get('/relatorio/:evaluationId/:employeeId', getRelatorioAvaliacaoController);
```

---

#### 3.3 Listar Avaliações Pendentes por Colaborador
**Prioridade:** Média  
**Tempo estimado:** 4-5 horas

**Por que estamos fazendo isso:**
Os colaboradores precisam saber quais avaliações ainda precisam responder e quanto tempo têm pra fazer isso. Sem essa funcionalidade, eles podem esquecer de responder e perder o prazo.

**Descrição:**
Endpoint que mostra quais avaliações um colaborador ainda não respondeu.

**O que fazer:**
- Buscar avaliações ativas do colaborador
- Verificar quais ainda não têm respostas
- Retornar lista de pendências

**Exemplo:**
```javascript
// src/services/avaliacaoService.js
async function getAvaliacoesPendentes(employeeRa) {
  // Busca o colaborador
  const employee = await db.employee.findUnique({
    where: { registrationId: employeeRa }
  });
  
  if (!employee) {
    throw serviceError(404, { message: 'Colaborador não encontrado.' });
  }
  
  // Busca avaliações ativas onde o colaborador participa
  const participations = await db.evaluationParticipant.findMany({
    where: { employeeId: employee.id },
    include: {
      evaluation: {
        where: { status: 'active' },
        include: {
          competencies: true
        }
      }
    }
  });
  
  const pendentes = [];
  
  for (const participation of participations) {
    if (!participation.evaluation) continue;
    
    // Conta quantas competências tem na avaliação
    const totalCompetencias = participation.evaluation.competencies.length;
    
    // Conta quantas respostas o colaborador já deu
    const respostasFeitas = await db.response.count({
      where: {
        evaluationId: participation.evaluation.id,
        employeeId: employee.id
      }
    });
    
    // Se não respondeu todas, está pendente
    if (respostasFeitas < totalCompetencias) {
      pendentes.push({
        avaliacao_id: participation.evaluation.id,
        avaliacao_nome: participation.evaluation.name,
        data_fim: participation.evaluation.endDate,
        competencias_total: totalCompetencias,
        competencias_respondidas: respostasFeitas,
        competencias_pendentes: totalCompetencias - respostasFeitas
      });
    }
  }
  
  return {
    colaborador: {
      nome: employee.name,
      ra: employee.registrationId
    },
    avaliacoes_pendentes: pendentes,
    total_pendentes: pendentes.length
  };
}
```

---

#### 3.4 Criar Ranking de Competências
**Prioridade:** Média  
**Tempo estimado:** 4-5 horas

**Por que estamos fazendo isso:**
Os gestores querem saber quais competências estão indo bem e quais precisam de atenção. Um ranking mostra isso de forma clara e ajuda a tomar decisões sobre treinamentos e desenvolvimento.

**Descrição:**
Endpoint que mostra as competências mais e menos pontuadas.

**O que fazer:**
- Agrupar respostas por competência
- Calcular média de cada competência
- Ordenar do maior para o menor

**Exemplo:**
```javascript
// src/services/competenciaService.js
async function getRankingCompetencias(evaluationId) {
  // Busca todas as respostas da avaliação
  const responses = await db.response.findMany({
    where: { evaluationId: parseInt(evaluationId) },
    include: {
      competency: {
        select: {
          id: true,
          name: true,
          type: true
        }
      }
    }
  });
  
  // Agrupa por competência
  const competenciasMap = {};
  
  responses.forEach(r => {
    const compId = r.competency.id;
    
    if (!competenciasMap[compId]) {
      competenciasMap[compId] = {
        id: compId,
        nome: r.competency.name,
        tipo: r.competency.type,
        respostas: []
      };
    }
    
    competenciasMap[compId].respostas.push(r.response);
  });
  
  // Calcula estatísticas
  const ranking = Object.values(competenciasMap).map(comp => {
    const total = comp.respostas.length;
    
    // Conta quantas vezes cada resposta apareceu
    const contagem = {};
    comp.respostas.forEach(r => {
      contagem[r] = (contagem[r] || 0) + 1;
    });
    
    return {
      competencia: comp.nome,
      tipo: comp.tipo,
      total_avaliacoes: total,
      distribuicao: contagem
    };
  });
  
  return {
    avaliacao_id: evaluationId,
    competencias: ranking,
    total_competencias: ranking.length
  };
}
```

---

#### 3.5 Adicionar Contadores nos Endpoints Existentes
**Prioridade:** Baixa  
**Tempo estimado:** 2-3 horas

**Por que estamos fazendo isso:**
Quando o frontend lista gestores ou colaboradores, não sabe quantos registros existem no total. Isso é útil pra mostrar "Mostrando 10 de 50 registros" e pra implementar paginação depois.

**Descrição:**
Adicionar informação de total de registros nas listagens.

**O que fazer:**
- Adicionar campo `total` nas respostas de listagem
- Contar registros antes de retornar

**Exemplo:**
```javascript
// src/services/gestorService.js
async function listGestores(search = '') {
  const where = { active: true };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  // Busca dados e conta total
  const [managers, total] = await Promise.all([
    db.manager.findMany({
      where,
      orderBy: { name: 'asc' }
    }),
    db.manager.count({ where })
  ]);
  
  return {
    data: managers.map(mgr => ({
      id: mgr.id,
      nome: mgr.name,
      email: mgr.email,
      cpf: mgr.registrationId,
      empresa: mgr.company
    })),
    total: total
  };
}
```

---

## 📊 Como vou dividir

| Pessoa | Área | Tarefas | Tempo Estimado |
|--------|------|---------|----------------|
| **Pessoa 1** | Validações e Erros | 3 tarefas | 9-13 horas |
| **Pessoa 2** | Listagens e Filtros | 3 tarefas | 8-11 horas |
| **Pessoa 3** | Relatórios e Estatísticas | 5 tarefas | 20-25 horas |

---


## 📚 Recursos de Aprendizado

### Para todos
- [JavaScript Básico](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Node.js Guia](https://nodejs.org/pt-br/docs/)
- [Prisma Documentação](https://www.prisma.io/docs)

### Estagiário 1
- [Validação de dados em JavaScript](https://developer.mozilla.org/pt-BR/docs/Learn/Forms/Form_validation)
- [Regex para validações](https://regexr.com/)

### Estagiário 2
- [Prisma Queries](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- [Filtros no Prisma](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting)

### Estagiário 3
- [Prisma Aggregations](https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing)
- [Trabalhando com Datas em JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Estatísticas e Relatórios](https://www.prisma.io/docs/concepts/components/prisma-client/crud)

---

## ✅ Checklist de Entrega

Cada estagiário deve entregar:

- [ ] Código funcionando (testado localmente)
- [ ] Comentários explicando o que foi feito
- [ ] Exemplos de como usar (se aplicável)
- [ ] Avisar se mudou alguma rota ou comportamento

---

## 🤝 Dicas Importantes

1. **Teste antes de entregar** - Rode o servidor e teste suas mudanças
2. **Não tenha medo de perguntar** - É melhor perguntar do que fazer errado
3. **Faça um pouco por vez** - Não tente fazer tudo de uma vez
4. **Salve seu trabalho** - Faça commits frequentes
5. **Leia o código existente** - Veja como as coisas já estão feitas

---

## 🆘 Quando Pedir Ajuda

Peça ajuda se:
- Não entender o que precisa fazer
- Encontrar um erro que não consegue resolver
- Não souber como testar algo
- Tiver dúvida sobre qual abordagem usar

---

**Boa sorte! 🚀**
