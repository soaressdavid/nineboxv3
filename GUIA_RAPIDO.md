# ⚡ Guia Rápido - Backend NineBox

## 🚀 Início Rápido (5 minutos)

### 1️⃣ Instalar e Configurar
```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Criar admin
npm run create-admin

# Iniciar servidor
npm run dev
```

### 2️⃣ Testar Login Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ninebox.com",
    "password": "admin123",
    "accessType": "admin"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Login bem-sucedido",
  "tipo": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3️⃣ Usar o Token
Copie o token da resposta e use em todas as requisições:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Credenciais Padrão

| Tipo | Email | Senha | Uso |
|------|-------|-------|-----|
| Admin | admin@ninebox.com | admin123 | Primeiro acesso |

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

---

## 🔑 Endpoints Principais

### Login
```bash
# Admin/Gestor
POST /api/auth/login
Body: { email, password, accessType }

# Colaborador (por CPF)
POST /api/auth/loginUsuario
Body: { cpf, tipoCargo }
```

### Gestores
```bash
GET    /api/gestores           # Listar
POST   /api/gestores           # Criar
PUT    /api/gestores/:id       # Atualizar
GET    /api/gestores/:cpf      # Buscar por CPF
```

### Colaboradores
```bash
GET    /api/avaliados          # Listar
POST   /api/avaliados          # Criar
PUT    /api/avaliados/:ra      # Atualizar
GET    /api/avaliados/:ra      # Buscar por RA
DELETE /api/avaliados/:id      # Desativar
```

### Competências
```bash
GET    /api/competencias                        # Listar
POST   /api/competencias                        # Criar
GET    /api/competencias/:id                    # Buscar
GET    /api/competencias/avaliacao/:idAvaliacao # Por avaliação
```

### Avaliações
```bash
GET    /api/avaliacoes                    # Listar todas
POST   /api/avaliacoes                    # Criar
GET    /api/avaliacoes/:id                # Buscar
GET    /api/avaliacoes/user               # Do usuário logado
GET    /api/avaliacoes/manager/:managerId # De um gestor
```

### Respostas
```bash
POST   /api/respostas                           # Salvar
GET    /api/respostas/:idAvaliacao              # De uma avaliação
GET    /api/respostas/:idAvaliacao/:cpfAvaliado # De um colaborador
GET    /api/respostas/dashboard/:idAvaliacao    # Dashboard
```

---

## 💡 Exemplos Práticos

### Criar Gestor
```bash
curl -X POST http://localhost:3000/api/gestores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nome": "João Silva",
    "cpf": "123.456.789-00",
    "email": "joao@empresa.com",
    "empresa": "Empresa XYZ",
    "senha": "senha123"
  }'
```

### Criar Colaborador
```bash
curl -X POST http://localhost:3000/api/avaliados \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@empresa.com",
    "ra": "2024001",
    "empresa": "Empresa XYZ",
    "cpf_gestor": "123.456.789-00"
  }'
```

### Criar Competência
```bash
curl -X POST http://localhost:3000/api/competencias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "competencia": "Comunicação",
    "tipo": "behavioral",
    "descricao": "Capacidade de comunicação",
    "ideal": "Excelente comunicação",
    "bom": "Boa comunicação",
    "mediano": "Comunicação adequada",
    "a_melhorar": "Precisa melhorar"
  }'
```

### Criar Avaliação
```bash
curl -X POST http://localhost:3000/api/avaliacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nomeAvaliacao": "Avaliação Q1 2024",
    "empresa": "Empresa XYZ",
    "dataInicio": "2024-01-01",
    "dataFim": "2024-03-31",
    "descricao": "Avaliação trimestral",
    "textoFinal": "Obrigado por participar!",
    "criadorId": 1,
    "tipo": "employee",
    "avaliados": [{"id": 1}],
    "competencias": [{"id": 1}]
  }'
```

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev                 # Iniciar servidor

# Banco de Dados
npm run prisma:generate     # Gerar cliente
npm run prisma:migrate      # Criar migração
npm run prisma:studio       # Interface visual

# Admin
npm run create-admin        # Criar admin
```

---

## 🐛 Problemas Comuns

### "Admin já existe"
```bash
# Já foi criado antes, use as credenciais padrão
Email: admin@ninebox.com
Senha: admin123
```

### "Token inválido"
```bash
# Faça login novamente para obter novo token
```

### "Gestor não encontrado"
```bash
# Crie o gestor antes de criar colaboradores
# Use o CPF correto do gestor
```

### Servidor não inicia
```bash
# Verifique se a porta 3000 está livre
# Verifique o arquivo .env
# Execute: npm run prisma:generate
```

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- **DOCUMENTACAO_BACKEND.md** - Documentação completa
- **RESUMO_CORRECOES.md** - Resumo das correções

---

## ✅ Checklist de Verificação

- [ ] Dependências instaladas (`npm install`)
- [ ] Prisma gerado (`npm run prisma:generate`)
- [ ] Migrações executadas (`npm run prisma:migrate`)
- [ ] Admin criado (`npm run create-admin`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Login testado (curl ou Postman)
- [ ] Token obtido e funcionando

---

## 🎯 Próximos Passos

1. ✅ Testar todos os endpoints
2. ✅ Integrar com frontend
3. ✅ Criar dados de teste
4. ✅ Configurar ambiente de produção

---

**🚀 Pronto para usar!**

**Desenvolvido com ❤️ para o Sistema NineBox**
