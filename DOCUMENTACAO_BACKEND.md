# 📚 Documentação Completa do Backend - Sistema NineBox

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Correções Realizadas](#correções-realizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Configuração e Instalação](#configuração-e-instalação)
5. [Autenticação e Segurança](#autenticação-e-segurança)
6. [API Endpoints](#api-endpoints)
7. [Modelos de Dados](#modelos-de-dados)
8. [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 Visão Geral

O backend do Sistema NineBox é uma API RESTful construída com:
- **Node.js** + **Express.js**
- **Prisma ORM** (PostgreSQL)
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **CORS** habilitado para integração com frontend

### Funcionalidades Principais
- ✅ Sistema de autenticação com 3 tipos de usuários (Admin, Gestor, Colaborador)
- ✅ Gestão completa de avaliações de competências
- ✅ CRUD de colaboradores, gestores e competências
- ✅ Sistema de respostas e dashboard de resultados
- ✅ Segurança com bcrypt e JWT

---

## 🔧 Correções Realizadas

### 1. **Correção Crítica no authController.js**

**ANTES (ERRO):**
```javascript
async function loginController(res, res) {  // ❌ Parâmetros duplicados
    try {
        const { email, password, accessType} = req.body;  // ❌ req não existe
        // ...
    }
}
```

**DEPOIS (CORRETO):**
```javascript
async function loginController(req, res) {  // ✅ Parâmetros corretos
    try {
        const { email, password, accessType} = req.body;  // ✅ req agora existe
        // ...
    }
}
```

### 2. **Implementação de Hash de Senhas**

**authService.js - ANTES:**
```javascript
if (user.password !== password) {  // ❌ Comparação de texto plano
    throw serviceError(401, { message: 'Senha incorreta.' });
}
```

**authService.js - DEPOIS:**
```javascript
const senhaValida = await bcrypt.compare(password, user.password);  // ✅ Usa bcrypt
if (!senhaValida) {
    throw serviceError(401, { message: 'Senha incorreta.' });
}
```

### 3. **Correção do Nome do Modelo no Prisma**

**ANTES:**
```javascript
const user = await db.usuario.findFirst({  // ❌ Modelo errado
    where: { email }
});
```

**DEPOIS:**
```javascript
const user = await db.user.findFirst({  // ✅ Modelo correto do schema
    where: { email }
});
```

### 4. **Melhoria no Login de Usuário**

**ANTES:**
```javascript
async function loginUsuario({cpf, tipoCargo }) {
    if (tipoCargo === 'employee') {
        const employee = await db.employee.findUnique({
            where: { registrationId: cpf }
        });
        if (!employee) {
            throw serviceError(401, { message: 'Nenhum colaborador encontrado.' });
        }
        // ❌ Não retorna dados do employee
    }
    return {
        token: gerarToken({ cpf, tipoCargo})  // ❌ Token com dados incompletos
    };
}
```

**DEPOIS:**
```javascript
async function loginUsuario({ cpf, tipoCargo }) {
    let userData = { cpf, tipoCargo };

    if (tipoCargo === 'colaborador') {
        const employee = await db.employee.findUnique({
            where: { registrationId: cpf }
        });
        
        if (!employee) {
            throw serviceError(401, { message: 'Nenhum colaborador encontrado.' });
        }

        // ✅ Retorna dados completos do employee
        userData.id = employee.id;
        userData.name = employee.name;
        userData.email = employee.email;
        userData.role = 'employee';
    }
    
    return {
        token: gerarToken(userData)  // ✅ Token com dados completos
    };
}
```

### 5. **Criação de Serviços Completos**

Foram criados/corrigidos os seguintes serviços:

#### **avaliadoService.js** (NOVO)
```javascript
const db = require('../database/connection');
const { serviceError } = require('../utils/serviceError');

async function listAvaliados() {
    const avaliados = await db.employee.findMany({
        where: { active: true },
        include: {
            manager: {
                select: {
                    name: true,
                    registrationId: true
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    return avaliados.map(emp => ({
        id: emp.id,
        nome: emp.name,
        email: emp.email,
        ra: emp.registrationId,
        empresa: emp.company,
        nome_gestor: emp.manager.name,
        cpf_gestor: emp.manager.registrationId,
        ativo: emp.active
    }));
}

async function createAvaliado({ nome, email, ra, empresa, cpf_gestor }) {
    const manager = await db.manager.findUnique({
        where: { registrationId: cpf_gestor }
    });

    if (!manager) {
        throw serviceError(404, { message: 'Gestor não encontrado.' });
    }

    const existingEmployee = await db.employee.findUnique({
        where: { registrationId: ra }
    });

    if (existingEmployee) {
        throw serviceError(400, { message: 'Já existe um colaborador com este RA.' });
    }

    const employee = await db.employee.create({
        data: {
            name: nome,
            email,
            registrationId: ra,
            company: empresa,
            managerId: manager.id
        }
    });

    return {
        message: 'Colaborador criado com sucesso!',
        avaliado: {
            id: employee.id,
            nome: employee.name,
            email: employee.email,
            ra: employee.registrationId,
            empresa: employee.company
        }
    };
}

// ... outras funções
```

#### **gestorService.js** (NOVO)
```javascript
const db = require('../database/connection');
const { serviceError } = require('../utils/serviceError');
const bcrypt = require('bcrypt');

async function createGestor({ nome, cpf, email, empresa, senha }) {
    const existingManager = await db.manager.findUnique({
        where: { registrationId: cpf }
    });

    if (existingManager) {
        throw serviceError(400, { message: 'Já existe um gestor com este CPF.' });
    }

    // ✅ Cria o usuário primeiro com senha hasheada
    const hashedPassword = await bcrypt.hash(senha || 'gestor123', 10);
    
    const user = await db.user.create({
        data: {
            email,
            password: hashedPassword,
            role: 'manager'
        }
    });

    // ✅ Cria o gestor vinculado ao usuário
    const manager = await db.manager.create({
        data: {
            userId: user.id,
            name: nome,
            email,
            registrationId: cpf,
            company: empresa
        }
    });

    return {
        message: 'Gestor criado com sucesso!',
        gestor: {
            id: manager.id,
            nome: manager.name,
            email: manager.email,
            cpf: manager.registrationId,
            empresa: manager.company
        }
    };
}
```

#### **competenciaService.js** (NOVO)
```javascript
async function createCompetencia({ competencia, tipo, descricao, ideal, bom, mediano, a_melhorar }) {
    const existingCompetency = await db.competency.findUnique({
        where: { name: competencia }
    });

    if (existingCompetency) {
        throw serviceError(400, { message: 'Já existe uma competência com este nome.' });
    }

    const competency = await db.competency.create({
        data: {
            name: competencia,
            type: tipo,
            description: descricao,
            levelIdeal: ideal,
            levelGood: bom,
            levelAverage: mediano,
            levelNeedsImprovement: a_melhorar
        }
    });

    return {
        message: 'Competência criada com sucesso!',
        competencia: {
            id: competency.id,
            competencia: competency.name,
            tipo: competency.type,
            descricao: competency.description
        }
    };
}
```

#### **respostaService.js** (NOVO)
```javascript
async function salvarResposta({ evaluationId, employeeId, competencyId, response, observation }) {
    const existingResponse = await db.response.findFirst({
        where: {
            evaluationId: Number(evaluationId),
            employeeId: Number(employeeId),
            competencyId: Number(competencyId)
        }
    });

    if (existingResponse) {
        // ✅ Atualiza se já existe
        const updated = await db.response.update({
            where: { id: existingResponse.id },
            data: { response, observation }
        });

        return {
            message: 'Resposta atualizada com sucesso!',
            id: updated.id
        };
    }

    // ✅ Cria nova resposta
    const newResponse = await db.response.create({
        data: {
            evaluationId: Number(evaluationId),
            employeeId: Number(employeeId),
            competencyId: Number(competencyId),
            response,
            observation
        }
    });

    return {
        message: 'Resposta salva com sucesso!',
        id: newResponse.id
    };
}
```

### 6. **Script de Criação de Admin**

**createAdmin.js** (NOVO):
```javascript
const bcrypt = require('bcrypt');
const prisma = require('../config/prismaClient');

async function createAdmin() {
    try {
        const adminExists = await prisma.user.findFirst({
            where: { email: 'admin@ninebox.com' }
        });

        if (adminExists) {
            console.log('❌ Admin já existe!');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.create({
            data: {
                email: 'admin@ninebox.com',
                password: hashedPassword,
                role: 'admin'
            }
        });

        console.log('✅ Admin criado com sucesso!');
        console.log('📧 Email: admin@ninebox.com');
        console.log('🔑 Senha: admin123');
        console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

    } catch (error) {
        console.error('❌ Erro ao criar admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
```

---

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Migrações do banco
├── src/
│   ├── config/
│   │   ├── env.js            # Configurações de ambiente
│   │   └── prismaClient.js   # Cliente do Prisma
│   ├── controllers/          # Controllers da API
│   │   ├── authController.js
│   │   ├── avaliacaoController.js
│   │   ├── avaliadoController.js
│   │   ├── competenciaController.js
│   │   ├── gestorController.js
│   │   └── respostaController.js
│   ├── database/
│   │   └── connection.js     # Conexão com banco
│   ├── middlewares/
│   │   └── authMiddleware.js # Middleware de autenticação
│   ├── routes/               # Rotas da API
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── avaliacaoRoutes.js
│   │   ├── avaliadoRoutes.js
│   │   ├── competenciaRoutes.js
│   │   ├── gestorRoutes.js
│   │   └── respostasRoutes.js
│   ├── scripts/
│   │   └── createAdmin.js    # Script para criar admin
│   ├── services/             # Lógica de negócio
│   │   ├── authService.js
│   │   ├── avaliacaoService.js
│   │   ├── avaliadoService.js
│   │   ├── competenciaService.js
│   │   ├── gestorService.js
│   │   ├── respostaService.js
│   │   └── tokenService.js
│   ├── utils/
│   │   ├── controllerError.js
│   │   ├── cpf.js
│   │   └── serviceError.js
│   ├── app.js                # Configuração do Express
│   └── server.js             # Servidor HTTP
├── .env                      # Variáveis de ambiente
└── package.json              # Dependências
```

---

## ⚙️ Configuração e Instalação

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente
Arquivo `.env`:
```env
DATABASE_URL="postgresql://usuario:senha@host:porta/database?pgbouncer=true"
DIRECT_URL="postgresql://usuario:senha@host:porta/database"
TOKEN_SECRET='sua_chave_secreta_aqui'
PORT=3000
```

### 3. Executar Migrações do Banco
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Criar Usuário Admin
```bash
npm run create-admin
```

**Saída esperada:**
```
✅ Admin criado com sucesso!
📧 Email: admin@ninebox.com
🔑 Senha: admin123
⚠️  IMPORTANTE: Altere a senha após o primeiro login!
```

### 5. Iniciar o Servidor
```bash
npm run dev
```

**Saída esperada:**
```
Servidor rodando em http://localhost:3000
```

---

## 🔐 Autenticação e Segurança

### Sistema de Autenticação

O sistema possui 3 tipos de usuários:

1. **Admin** - Acesso total ao sistema
2. **Manager (Gestor)** - Cria avaliações e gerencia colaboradores
3. **Employee (Colaborador)** - Responde avaliações

### Fluxo de Autenticação

```javascript
// 1. Login de Admin/Gestor
POST /api/auth/login
{
  "email": "admin@ninebox.com",
  "password": "admin123",
  "accessType": "admin"  // ou "manager"
}

// Resposta:
{
  "message": "Login bem-sucedido",
  "tipo": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// 2. Login de Colaborador (por CPF)
POST /api/auth/loginUsuario
{
  "cpf": "123.456.789-00",
  "tipoCargo": "colaborador"  // ou "gestor"
}

// Resposta:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Uso do Token

Todas as rotas protegidas requerem o token no header:

```javascript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Verificação de Token

```javascript
GET /api/auth/verify
Headers: {
  Authorization: Bearer <token>
}

// Resposta:
{
  "message": "Token válido"
}
```

---

## 🛣️ API Endpoints

### 🔑 Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login admin/gestor | Não |
| POST | `/api/auth/loginUsuario` | Login colaborador por CPF | Não |
| GET | `/api/auth/verify` | Verifica validade do token | Sim |

### 👥 Gestores

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/gestores` | Lista todos os gestores | Sim |
| POST | `/api/gestores` | Cria novo gestor | Sim |
| PUT | `/api/gestores/:id` | Atualiza gestor | Sim |
| GET | `/api/gestores/:cpf` | Busca gestor por CPF | Sim |

### 👤 Colaboradores (Avaliados)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/avaliados` | Lista todos os colaboradores | Sim |
| POST | `/api/avaliados` | Cria novo colaborador | Sim |
| PUT | `/api/avaliados/:ra` | Atualiza colaborador | Sim |
| GET | `/api/avaliados/:ra` | Busca colaborador por RA | Sim |
| DELETE | `/api/avaliados/:id` | Desativa colaborador | Sim |

### 🎯 Competências

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/competencias` | Lista todas as competências | Sim |
| POST | `/api/competencias` | Cria nova competência | Sim |
| GET | `/api/competencias/:id` | Busca competência por ID | Sim |
| GET | `/api/competencias/avaliacao/:idAvaliacao` | Lista competências de uma avaliação | Sim |

### 📋 Avaliações

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/avaliacoes` | Lista todas as avaliações | Sim |
| POST | `/api/avaliacoes` | Cria nova avaliação | Sim |
| GET | `/api/avaliacoes/:id` | Busca avaliação por ID | Sim |
| GET | `/api/avaliacoes/user` | Lista avaliações do usuário logado | Sim |
| GET | `/api/avaliacoes/manager/:managerId` | Lista avaliações de um gestor | Sim |
| GET | `/api/avaliacoes/status/all` | Lista avaliações com status | Sim |

### ✍️ Respostas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/respostas` | Salva/atualiza resposta | Sim |
| GET | `/api/respostas/:idAvaliacao` | Lista respostas de uma avaliação | Sim |
| GET | `/api/respostas/:idAvaliacao/:cpfAvaliado` | Lista respostas de um colaborador | Sim |
| GET | `/api/respostas/dashboard/:idAvaliacao` | Dados do dashboard | Sim |

---

## 📊 Modelos de Dados

### User (Usuário)
```javascript
{
  id: number,
  email: string,
  password: string,  // Hash bcrypt
  role: string,      // "admin", "manager", "employee"
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Manager (Gestor)
```javascript
{
  id: number,
  userId: number,
  name: string,
  email: string,
  registrationId: string,  // CPF
  company: string,
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Employee (Colaborador)
```javascript
{
  id: number,
  managerId: number,
  userId: number | null,
  name: string,
  email: string,
  registrationId: string,  // RA
  company: string,
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Competency (Competência)
```javascript
{
  id: number,
  name: string,
  type: string,  // "technical", "behavioral", "leadership"
  description: string,
  levelIdeal: string,
  levelGood: string,
  levelAverage: string,
  levelNeedsImprovement: string,
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Evaluation (Avaliação)
```javascript
{
  id: number,
  managerId: number,
  name: string,
  type: string,  // "employee" ou "manager"
  status: string,  // "draft", "active", "closed", "cancelled"
  company: string,
  startDate: Date,
  endDate: Date,
  description: string,
  closingText: string | null,
  createdAt: Date,
  updatedAt: Date
}
```

### Response (Resposta)
```javascript
{
  id: number,
  evaluationId: number,
  employeeId: number,
  competencyId: number,
  response: string,
  observation: string | null,
  submittedAt: Date
}
```

---

## 💡 Exemplos de Uso

### 1. Criar Admin (Primeira vez)
```bash
npm run create-admin
```

### 2. Login como Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ninebox.com",
    "password": "admin123",
    "accessType": "admin"
  }'
```

### 3. Criar um Gestor
```bash
curl -X POST http://localhost:3000/api/gestores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{
    "nome": "João Silva",
    "cpf": "123.456.789-00",
    "email": "joao@empresa.com",
    "empresa": "Empresa XYZ",
    "senha": "senha123"
  }'
```

### 4. Criar um Colaborador
```bash
curl -X POST http://localhost:3000/api/avaliados \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@empresa.com",
    "ra": "2024001",
    "empresa": "Empresa XYZ",
    "cpf_gestor": "123.456.789-00"
  }'
```

### 5. Criar uma Competência
```bash
curl -X POST http://localhost:3000/api/competencias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{
    "competencia": "Comunicação",
    "tipo": "behavioral",
    "descricao": "Capacidade de se comunicar claramente",
    "ideal": "Excelente comunicação verbal e escrita",
    "bom": "Boa comunicação na maioria das situações",
    "mediano": "Comunicação adequada",
    "a_melhorar": "Precisa melhorar a clareza"
  }'
```

### 6. Criar uma Avaliação
```bash
curl -X POST http://localhost:3000/api/avaliacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{
    "nomeAvaliacao": "Avaliação Q1 2024",
    "empresa": "Empresa XYZ",
    "dataInicio": "2024-01-01",
    "dataFim": "2024-03-31",
    "descricao": "Avaliação trimestral de competências",
    "textoFinal": "Obrigado por participar!",
    "criadorId": 1,
    "tipo": "employee",
    "avaliados": [
      { "id": 1 },
      { "id": 2 }
    ],
    "competencias": [
      { "id": 1 },
      { "id": 2 }
    ]
  }'
```

### 7. Colaborador Responde Avaliação
```bash
# 1. Login do colaborador
curl -X POST http://localhost:3000/api/auth/loginUsuario \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "2024001",
    "tipoCargo": "colaborador"
  }'

# 2. Salvar resposta
curl -X POST http://localhost:3000/api/respostas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_colaborador>" \
  -d '{
    "evaluationId": 1,
    "employeeId": 1,
    "competencyId": 1,
    "response": "Bom",
    "observation": "Estou trabalhando para melhorar"
  }'
```

### 8. Ver Dashboard de Avaliação
```bash
curl -X GET http://localhost:3000/api/respostas/dashboard/1 \
  -H "Authorization: Bearer <seu_token>"
```

---

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Inicia servidor em modo desenvolvimento

# Banco de Dados
npm run prisma:generate        # Gera cliente Prisma
npm run prisma:migrate         # Cria nova migração
npm run prisma:deploy          # Aplica migrações em produção
npm run prisma:studio          # Abre interface visual do banco

# Admin
npm run create-admin           # Cria usuário admin
```

---

## ✅ Checklist de Funcionalidades

- [x] Sistema de autenticação com JWT
- [x] Hash de senhas com bcrypt
- [x] CRUD de gestores
- [x] CRUD de colaboradores
- [x] CRUD de competências
- [x] CRUD de avaliações
- [x] Sistema de respostas
- [x] Dashboard de resultados
- [x] Validações de dados
- [x] Tratamento de erros
- [x] CORS configurado
- [x] Middleware de autenticação
- [x] Script de criação de admin

---

## 📝 Notas Importantes

1. **Segurança**: Todas as senhas são hasheadas com bcrypt (10 rounds)
2. **Tokens**: JWT com expiração configurável
3. **Validações**: Todos os endpoints validam dados de entrada
4. **Erros**: Sistema padronizado de tratamento de erros
5. **CORS**: Habilitado para permitir requisições do frontend
6. **Soft Delete**: Colaboradores são desativados, não deletados

---

## 🐛 Troubleshooting

### Erro: "Admin já existe"
```bash
# Verifique no banco se já existe
npm run prisma:studio
# Ou delete e recrie
```

### Erro: "Token inválido"
```bash
# Verifique se o TOKEN_SECRET no .env está correto
# Faça login novamente para obter novo token
```

### Erro: "Gestor não encontrado"
```bash
# Certifique-se de criar o gestor antes de criar colaboradores
# Use o CPF correto do gestor
```

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Use `npm run prisma:studio` para verificar o banco
3. Teste os endpoints com Postman ou curl
4. Verifique se todas as migrações foram aplicadas

---

**Desenvolvido com ❤️ para o Sistema NineBox**
