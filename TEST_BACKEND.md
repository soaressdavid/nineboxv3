# Teste do Backend - Diagnóstico

## Erro Atual
```
POST http://localhost:3000/api/avaliados 500 (Internal Server Error)
Erro no SQL: Erro no servidor
```

## Causa Provável
O erro "Gestor não encontrado" indica que o `cpf_gestor` enviado não existe no banco de dados.

## Como Testar

### 1. Verificar se o Gestor Existe

Abra o terminal e teste:

```bash
curl http://localhost:3000/api/gestores
```

Isso deve retornar a lista de gestores. Verifique se o CPF **68527119005** está na lista.

### 2. Verificar o Formato do CPF

O CPF pode estar sendo salvo de forma diferente:
- Com pontos e traço: `685.271.190-05`
- Sem formatação: `68527119005`

### 3. Criar um Gestor Manualmente (se necessário)

Use o Postman ou curl:

```bash
curl -X POST http://localhost:3000/api/gestores \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Gestor Teste",
    "email": "gestor@teste.com",
    "cpf": "68527119005",
    "empresa": "Empresa Teste"
  }'
```

### 4. Verificar Logs do Backend

No terminal onde o backend está rodando, procure por:
- Erros de conexão com banco de dados
- Mensagens de erro do Prisma
- Stack traces

### 5. Testar Criação de Avaliado

Depois de confirmar que o gestor existe, teste criar um avaliado:

```bash
curl -X POST http://localhost:3000/api/avaliados \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@teste.com",
    "ra": "12345",
    "empresa": "Empresa Teste",
    "cpf_gestor": "68527119005"
  }'
```

## Possíveis Soluções

### Solução 1: Verificar Banco de Dados

```bash
cd backend
npx prisma studio
```

Isso abre uma interface visual para ver os dados no banco.

### Solução 2: Resetar Banco de Dados (CUIDADO: Apaga dados)

```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

### Solução 3: Verificar Schema do Prisma

Verifique se o campo `registrationId` no modelo `Manager` está correto:

```prisma
model Manager {
  id             Int    @id @default(autoincrement())
  name           String
  email          String @unique
  registrationId String @unique  // Este é o CPF
  company        String
  active         Boolean @default(true)
  // ...
}
```

## Debug no Frontend

Para ver exatamente o que está sendo enviado, adicione no `create.html`:

```javascript
console.log('Dados enviados:', JSON.stringify({
  nome, email, ra, empresa, cpf_gestor
}));
```

## Checklist de Verificação

- [ ] Backend está rodando na porta 3000
- [ ] Banco de dados está conectado
- [ ] Tabela `Manager` existe
- [ ] Existe pelo menos um gestor cadastrado
- [ ] O CPF do gestor está no formato correto
- [ ] O frontend está enviando o CPF no formato correto
- [ ] Não há erros de validação no Prisma

## Próximos Passos

1. Execute o comando para listar gestores
2. Verifique se o CPF 68527119005 aparece
3. Se não aparecer, crie o gestor manualmente
4. Tente criar o avaliado novamente
5. Se o erro persistir, compartilhe os logs do backend
