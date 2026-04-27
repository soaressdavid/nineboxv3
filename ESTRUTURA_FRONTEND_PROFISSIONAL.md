# 🎨 Estrutura Frontend Profissional

## 📁 Nova Estrutura Proposta

```
frontend/
├── assets/
│   ├── images/
│   │   ├── icons/
│   │   │   ├── add.svg
│   │   │   ├── edit.svg
│   │   │   ├── delete.svg
│   │   │   ├── search.svg
│   │   │   ├── profile.svg
│   │   │   ├── evaluation.svg
│   │   │   ├── self-evaluation.svg
│   │   │   ├── manager-evaluation.svg
│   │   │   └── info.svg
│   │   └── logo/
│   │       └── ninebox.svg
│   └── styles/
│       ├── main.css
│       ├── login.css
│       ├── navbar.css
│       ├── contacts.css
│       ├── evaluations.css
│       └── models.css
├── pages/
│   ├── auth/
│   │   ├── login.html
│   │   └── employee-login.html
│   ├── dashboard/
│   │   └── menu.html
│   ├── contacts/
│   │   ├── list.html
│   │   └── create.html
│   ├── competencies/
│   │   ├── create.html
│   │   └── edit.html
│   ├── evaluations/
│   │   ├── my-evaluations/
│   │   │   ├── list.html
│   │   │   ├── dashboard.html
│   │   │   └── responses.html
│   │   ├── create/
│   │   │   ├── select-type.html
│   │   │   ├── self-evaluation/
│   │   │   │   ├── step1.html
│   │   │   │   ├── step2.html
│   │   │   │   ├── step3.html
│   │   │   │   └── step4.html
│   │   │   └── manager-evaluation/
│   │   │       ├── step1.html
│   │   │       ├── step2.html
│   │   │       ├── step3.html
│   │   │       └── step4.html
│   │   ├── respond/
│   │   │   ├── employee/
│   │   │   │   ├── list.html
│   │   │   │   ├── instructions.html
│   │   │   │   ├── form.html
│   │   │   │   └── thanks.html
│   │   │   └── manager/
│   │   │       ├── list.html
│   │   │       ├── instructions.html
│   │   │       ├── form.html
│   │   │       └── thanks.html
│   │   └── models.html
│   └── matrix/
│       └── ninebox.html
├── scripts/
│   ├── navbar.js
│   └── utils.js
├── index.html
└── README.md
```

## 🔄 Mapeamento de Nomes

### Pastas
| Antigo | Novo | Motivo |
|--------|------|--------|
| `CSS/` | `assets/styles/` | Padrão profissional |
| `ImagensMenu/` | `assets/images/` | Inglês + organizado |
| `paginas/` | `pages/` | Inglês |
| `minhasAvaliacoes/` | `evaluations/my-evaluations/` | Inglês + descritivo |
| `novaAvaliacao/` | `evaluations/create/` | Inglês + descritivo |
| `responderAvaliacao/` | `evaluations/respond/employee/` | Inglês + específico |
| `responderAvaliacaoGestor/` | `evaluations/respond/manager/` | Inglês + específico |

### Arquivos HTML
| Antigo | Novo | Motivo |
|--------|------|--------|
| `consultar-contatos.html` | `contacts/list.html` | Inglês + RESTful |
| `novo_avaliado.html` | `contacts/create.html` | Inglês + RESTful |
| `nova_competencia.html` | `competencies/create.html` | Inglês + RESTful |
| `nova_competencia2.html` | `competencies/edit.html` | Inglês + RESTful |
| `modelos_avaliacao.html` | `evaluations/models.html` | Inglês |
| `minhasavaliacoes.html` | `my-evaluations/list.html` | Inglês + RESTful |
| `nova_avaliacao.html` | `create/select-type.html` | Descritivo |
| `nova_avaliacao1.html` | `step1.html` | Simplificado |
| `nova_avaliacao2.html` | `step2.html` | Simplificado |
| `nova_avaliacao3.html` | `step3.html` | Simplificado |
| `nova_avaliacao4.html` | `step4.html` | Simplificado |
| `avaliacao_lista.html` | `list.html` | Simplificado |
| `avaliacao_orientacoes.html` | `instructions.html` | Inglês |
| `avaliacao_conteudo.html` | `form.html` | Descritivo |
| `avaliacao_agradecimentos.html` | `thanks.html` | Inglês |
| `login.usuario.html` | `employee-login.html` | Descritivo |
| `mvpMatriz.html` | `matrix/ninebox.html` | Organizado |

### Arquivos CSS
| Antigo | Novo | Motivo |
|--------|------|--------|
| `style.css` | `main.css` | Mais descritivo |
| `login.usuario.css` | `login.css` | Simplificado |
| `consultar-contatos.css` | `contacts.css` | Inglês |
| `modelos-avaliacao.css` | `evaluations.css` | Inglês |
| `nova_avaliacao.css` | `evaluations.css` | Consolidado |
| `csspagina5.css` | `evaluations.css` | Consolidado |
| `csspagina6.css` | `evaluations.css` | Consolidado |

### Arquivos de Imagem
| Antigo | Novo | Motivo |
|--------|------|--------|
| `mais.svg` | `add.svg` | Inglês |
| `editar.svg` | `edit.svg` | Inglês |
| `procurar.svg` | `search.svg` | Inglês |
| `sobre.svg` | `info.svg` | Inglês |
| `adicionar.svg` | `add-user.svg` | Descritivo |
| `avaliacoes.svg` | `evaluation.svg` | Inglês |
| `perfil.svg` | `profile.svg` | Inglês |
| `avaliacao_autoavaliacao-icon.svg` | `self-evaluation.svg` | Inglês |
| `avaliacao_gestor-icon.svg` | `manager-evaluation.svg` | Inglês |

### Scripts
| Antigo | Novo | Motivo |
|--------|------|--------|
| `navbar.js` | `scripts/navbar.js` | Organizado |
| `server.js` | ❌ Remover | Não é frontend |

## 🎯 Benefícios

1. ✅ **Nomenclatura em inglês** - Padrão internacional
2. ✅ **Estrutura RESTful** - Organização por recurso
3. ✅ **Hierarquia clara** - Fácil navegação
4. ✅ **Nomes descritivos** - Auto-explicativos
5. ✅ **Separação de concerns** - Assets, pages, scripts
6. ✅ **Escalável** - Fácil adicionar novos recursos
7. ✅ **Profissional** - Segue best practices

## ⚠️ Importante

Após renomear, será necessário:
1. Atualizar TODOS os caminhos nos arquivos HTML
2. Atualizar imports de CSS
3. Atualizar caminhos de imagens
4. Atualizar links de navegação
5. Testar TODAS as páginas

## 🚀 Próximo Passo

Deseja que eu execute a reorganização completa?
