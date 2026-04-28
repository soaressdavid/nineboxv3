# Ninebox API - Fluxo de Avaliação 180

Este README reúne as rotas principais para teste do fluxo de avaliação 180, separadas por perfil:

- Colaborador
- Gestor

## Base URL

```bash
http://localhost:3000/api
Autenticação

A autenticação é feita via login e retorna um token JWT.

Esse token deve ser enviado nas rotas protegidas no header:

Authorization: Bearer SEU_TOKEN
Rotas do Colaborador
1) Login do Colaborador

POST /auth/login

URL
http://localhost:3000/api/auth/login
Body
{
  "registrationId": "RA2001",
  "password": "123456",
  "role": "EMPLOYEE"
}
Retorno esperado
Status 200 OK
Token JWT
Dados do usuário autenticado
2) Pendências do Colaborador

GET /responses/employee/pending

URL
http://localhost:3000/api/responses/employee/pending
Header
Authorization: Bearer TOKEN_DO_COLABORADOR
Objetivo

Retorna a lista de avaliações pendentes do colaborador autenticado.

3) Acessar Avaliação do Colaborador

GET /responses/employee/ID_DA_AVALIACAO/form

URL
http://localhost:3000/api/responses/employee/ID_DA_AVALIACAO/form
Header
Authorization: Bearer TOKEN_DO_COLABORADOR
Objetivo

Retorna os dados da avaliação e as competências que o colaborador deverá responder sobre o gestor.

4) Enviar Resposta do Colaborador

POST /responses/employee/1

URL
http://localhost:3000/api/responses/employee/1
Headers
Authorization: Bearer TOKEN_DO_COLABORADOR
Content-Type: application/json
Body
[
  {
    "competencyId": 1,
    "score": 4,
    "observation": "Boa liderança."
  },
  {
    "competencyId": 2,
    "score": 3,
    "observation": "Pode melhorar feedback."
  }
]
Objetivo

Envia as respostas do colaborador para a avaliação do gestor.

Rotas do Gestor
1) Login do Gestor

POST /auth/login

URL
http://localhost:3000/api/auth/login
Body
{
  "registrationId": "RA1001",
  "password": "123456",
  "role": "MANAGER"
}
Retorno esperado
Status 200 OK
Token JWT
Dados do usuário autenticado
2) Pendências do Gestor

GET /responses/manager/pending

URL
http://localhost:3000/api/responses/manager/pending
Header
Authorization: Bearer TOKEN_DO_GESTOR
Objetivo

Retorna a lista de avaliações pendentes do gestor autenticado.

3) Acessar Avaliação do Gestor

GET /responses/manager/ID_DA_AVALIACAO/form

URL
http://localhost:3000/api/responses/manager/ID_DA_AVALIACAO/form
Header
Authorization: Bearer TOKEN_DO_GESTOR
Objetivo

Retorna os dados da avaliação, os participantes e as competências que o gestor deverá responder sobre os colaboradores.

4) Enviar Resposta do Gestor

POST /responses/manager/1

URL
http://localhost:3000/api/responses/manager/1
Headers
Authorization: Bearer TOKEN_DO_GESTOR
Content-Type: application/json
Body
[
  {
    "employeeId": 1,
    "answers": [
      {
        "competencyId": 3,
        "score": 4,
        "observation": "Ótima entrega."
      },
      {
        "competencyId": 4,
        "score": 3,
        "observation": "Boa comunicação."
      }
    ]
  }
]
Objetivo

Envia as respostas do gestor para a avaliação dos colaboradores.

Resumo do Fluxo de Teste
Colaborador
Fazer login
Consultar pendências
Acessar a avaliação
Enviar respostas
Gestor
Fazer login
Consultar pendências
Acessar a avaliação
Enviar respostas
Observações
Todas as rotas, exceto login, exigem autenticação via token JWT.
O token deve ser enviado no header Authorization.
O registrationId representa o RA do usuário.
Os testes foram realizados localmente usando a base:
http://localhost:3000/api
