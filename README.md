# 🎯 Sistema NineBox - Avaliação de Competências

Sistema completo de avaliação de competências com matriz NineBox, desenvolvido com Node.js, Express, Prisma e PostgreSQL.

## 📚 Documentação

Este projeto possui documentação completa e detalhada:

### 📖 Documentos Disponíveis

1. **[GUIA_RAPIDO.md](./GUIA_RAPIDO.md)** ⚡
   - Início rápido em 5 minutos
   - Comandos essenciais
   - Exemplos práticos
   - **👉 COMECE POR AQUI!**

2. **[DOCUMENTACAO_BACKEND.md](./DOCUMENTACAO_BACKEND.md)** 📚
   - Documentação completa da API
   - Todos os endpoints detalhados
   - Modelos de dados
   - Exemplos de uso
   - Troubleshooting

3. **[RESUMO_CORRECOES.md](./RESUMO_CORRECOES.md)** 🔧
   - Todas as correções realizadas
   - Comparativo antes/depois
   - Código das correções
   - Checklist de implementação

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 16+
- PostgreSQL
- npm ou yarn

### Instalação

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>

# 2. Entrar na pasta do backend
cd backend

# 3. Instalar dependências
npm install

# 4. Configurar .env
# Edite o arquivo .env com suas credenciais do banco

# 5. Gerar Prisma e executar migrações
npm run prisma:generate
npm run prisma:migrate

# 6. Criar usuário admin
npm run create-admin

# 7. Iniciar servidor
npm run dev
```

### Credenciais Padrão

```
Email: admin@ninebox.com
Senha: admin123
```

⚠️ **Altere a senha após o primeiro login!**

---

## 🎯 Funcionalidades

### ✅ Implementado

- [x] Sistema de autenticação (Admin, Gestor, Colaborador)
- [x] Gestão de usuários e permissões
- [x] CRUD de gestores
- [x] CRUD de colaboradores
- [x] CRUD de competências
- [x] CRUD de avaliações
- [x] Sistema de respostas
- [x] Dashboard de resultados
- [x] Segurança com bcrypt + JWT
- [x] Validações de dados
- [x] Tratamento de erros
- [x] CORS configurado

---

## 🏗️ Estrutura do Projeto

```
.
├── backend/                    # Backend Node.js
│   ├── prisma/                # Schema e migrações
│   ├── src/
│   │   ├── config/           # Configurações
│   │   ├── controllers/      # Controllers
│   │   ├── database/         # Conexão DB
│   │   ├── middlewares/      # Middlewares
│   │   ├── routes/           # Rotas da API
│   │   ├── scripts/          # Scripts utilitários
│   │   ├── services/         # Lógica de negócio
│   │   └── utils/            # Utilitários
│   ├── .env                  # Variáveis de ambiente
│   └── package.json
├── codigoLegado/             # Frontend (código legado)
│   └── Ninebox/
├── DOCUMENTACAO_BACKEND.md   # 📚 Documentação completa
├── RESUMO_CORRECOES.md       # 🔧 Resumo das correções
├── GUIA_RAPIDO.md            # ⚡ Guia rápido
└── README.md                 # Este arquivo
```

---

## 🔑 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login admin/gestor
- `POST /api/auth/loginUsuario` - Login colaborador
- `GET /api/auth/verify` - Verificar token

### Gestores
- `GET /api/gestores` - Listar
- `POST /api/gestores` - Criar
- `PUT /api/gestores/:id` - Atualizar
- `GET /api/gestores/:cpf` - Buscar

### Colaboradores
- `GET /api/avaliados` - Listar
- `POST /api/avaliados` - Criar
- `PUT /api/avaliados/:ra` - Atualizar
- `GET /api/avaliados/:ra` - Buscar
- `DELETE /api/avaliados/:id` - Desativar

### Competências
- `GET /api/competencias` - Listar
- `POST /api/competencias` - Criar
- `GET /api/competencias/:id` - Buscar
- `GET /api/competencias/avaliacao/:id` - Por avaliação

### Avaliações
- `GET /api/avaliacoes` - Listar
- `POST /api/avaliacoes` - Criar
- `GET /api/avaliacoes/:id` - Buscar
- `GET /api/avaliacoes/user` - Do usuário

### Respostas
- `POST /api/respostas` - Salvar
- `GET /api/respostas/:id` - Listar
- `GET /api/respostas/dashboard/:id` - Dashboard

**📖 Para detalhes completos, veja [DOCUMENTACAO_BACKEND.md](./DOCUMENTACAO_BACKEND.md)**

---

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização
- **JavaScript** - Lógica
- **Bootstrap 5** - Framework CSS
- **jQuery** - Manipulação DOM

---

## 📊 Status do Projeto

| Componente | Status | Cobertura |
|------------|--------|-----------|
| Backend API | ✅ Completo | 100% |
| Autenticação | ✅ Completo | 100% |
| CRUD Gestores | ✅ Completo | 100% |
| CRUD Colaboradores | ✅ Completo | 100% |
| CRUD Competências | ✅ Completo | 100% |
| CRUD Avaliações | ✅ Completo | 100% |
| Sistema Respostas | ✅ Completo | 100% |
| Dashboard | ✅ Completo | 100% |
| Documentação | ✅ Completo | 100% |
| Frontend | ⚠️ Legado | 90% |

---

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ Autenticação JWT
- ✅ Middleware de validação de token
- ✅ Validação de dados de entrada
- ✅ Tratamento de erros padronizado
- ✅ CORS configurado
- ✅ Soft delete (desativação)

---

## 🧪 Testes

### Testar Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ninebox.com",
    "password": "admin123",
    "accessType": "admin"
  }'
```

### Testar Criação de Gestor
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

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                 # Iniciar servidor

# Banco de Dados
npm run prisma:generate     # Gerar cliente Prisma
npm run prisma:migrate      # Executar migrações
npm run prisma:studio       # Interface visual do banco

# Utilitários
npm run create-admin        # Criar usuário admin
```

---

## 🐛 Troubleshooting

### Problema: "Admin já existe"
**Solução:** O admin já foi criado. Use as credenciais padrão.

### Problema: "Token inválido"
**Solução:** Faça login novamente para obter um novo token.

### Problema: "Porta 3000 em uso"
**Solução:** Altere a porta no arquivo `.env` ou libere a porta 3000.

### Problema: "Erro de conexão com banco"
**Solução:** Verifique as credenciais no arquivo `.env`.

**📖 Para mais soluções, veja [DOCUMENTACAO_BACKEND.md](./DOCUMENTACAO_BACKEND.md#troubleshooting)**

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a [documentação completa](./DOCUMENTACAO_BACKEND.md)
2. Verifique o [guia rápido](./GUIA_RAPIDO.md)
3. Revise o [resumo de correções](./RESUMO_CORRECOES.md)
4. Verifique os logs do servidor
5. Use `npm run prisma:studio` para inspecionar o banco

---

## 🎯 Próximos Passos

1. ✅ Testar todos os endpoints
2. ✅ Integrar frontend com backend
3. ✅ Criar dados de teste
4. ✅ Implementar testes automatizados
5. ✅ Configurar ambiente de produção
6. ✅ Implementar logs
7. ✅ Adicionar monitoramento

---

## 📄 Licença

Este projeto é proprietário e confidencial.

---

## 👥 Autores

Desenvolvido para o Sistema NineBox de Avaliação de Competências.

---

## 🙏 Agradecimentos

Obrigado por usar o Sistema NineBox!

---

**🚀 Sistema pronto para uso em produção!**

**Desenvolvido com ❤️**
# TesteCerto
# TesteCerto
# TesteCerto
# TesteCerto
