# 🔧 Correções Pendentes no Frontend

## 📋 Resumo
Este documento lista TODAS as correções necessárias no frontend para garantir compatibilidade com o backend, mantendo EXATAMENTE o mesmo visual e funcionalidades.

---

## 🎯 Tipos de Correções Necessárias

### 1. URLs da API (adicionar `/api/`)
### 2. Caminhos relativos para `index.html`
### 3. Endpoints que mudaram de nome

---

## 📝 Correções Detalhadas por Arquivo

### ✅ JÁ CORRIGIDOS
- `codigoLegado/Ninebox/paginas/consultar-contatos.html`
- `codigoLegado/Ninebox/paginas/menu.html`
- `codigoLegado/Ninebox/paginas/novaAvaliacao/nova_avaliacao.html`
- `codigoLegado/Ninebox/paginas/novaAvaliacao/autoavaliacao/nova_avaliacao4.html`
- `codigoLegado/Ninebox/paginas/novaAvaliacao/avaliacaoGestor/nova_avaliacao_gestor4.html`
- `codigoLegado/Ninebox/navbar.js`

---

### ❌ PENDENTES

#### 1. `codigoLegado/Ninebox/paginas/responderAvaliacao/avaliacao_conteudo.html`
**Correções:**
- Linha ~247: `window.location.href = 'index.html'` → `window.location.href = '../../index.html'`
- Linha ~251: `window.location = 'index.html'` → `window.location = '../../index.html'`
- Adicionar `/api/` nas chamadas de API se houver

#### 2. `codigoLegado/Ninebox/paginas/responderAvaliacao/avaliacao_lista.html`
**Correções:**
- Linha ~193: `window.location.href = 'index.html'` → `window.location.href = '../../index.html'`
- Linha ~226: `window.location.href = 'index.html'` → `window.location.href = '../../index.html'`

#### 3. `codigoLegado/Ninebox/paginas/responderAvaliacao/avaliacao_orientacoes.html`
**Correções:**
- Linha ~81: `window.location.href = 'index.html'` → `window.location.href = '../../index.html'`
- Linha ~85: `window.location = '.index.html'` → `window.location = '../../index.html'`
- Linha ~91: `http://localhost:3000/descricaoPoridAvaliacao` → `http://localhost:3000/api/avaliacoes/descricao` (NOVO ENDPOINT NECESSÁRIO)

#### 4. `codigoLegado/Ninebox/paginas/responderAvaliacao/avaliacao_agradecimentos.html`
**Correções:**
- Linha ~64: `onclick="window.location='index.html'"` → `onclick="window.location='../../index.html'"`

#### 5. `codigoLegado/Ninebox/paginas/responderAvaliacaoGestor/avaliacao_conteudo_gestor.html`
**Correções:**
- Linha ~251: `window.location.href = 'index.html'` → `window.location.href = '../../index.html'`
- Linha ~256: `window.location.href = 'index.html'` → `window.location.href = '../../index.html'`
- Linha ~520: `http://localhost:3000/salvarRespostaGestor` → `http://localhost:3000/api/respostas/gestor`

#### 6. `codigoLegado/Ninebox/paginas/responderAvaliacaoGestor/avaliacao_lista_gestor.html`
**Correções:**
- Linha ~193: `window.location.href = 'index.html'` → `window.location.href = '../../index.html'`
- Linha ~225: `window.location.href = 'index.html'` → `window.location.href = '../../index.html'`

#### 7. `codigoLegado/Ninebox/paginas/responderAvaliacaoGestor/avaliacao_orientacoes_gestor.html`
**Correções:**
- Linha ~81: `window.location.href = 'index.html'` → `window.location.href = '../../index.html'`
- Linha ~85: `window.location.href = 'index.html'` → `window.location.href = '../../index.html'`

#### 8. `codigoLegado/Ninebox/paginas/responderAvaliacaoGestor/avaliacao_agradecimentos_gestor.html`
**Correções:**
- Linha ~64: `onclick="window.location='index.html'"` → `onclick="window.location='../../index.html'"`

#### 9. `codigoLegado/Ninebox/paginas/modelos_avaliacao.html`
**Correções:**
- Linha ~485: `http://localhost:3000/listarTodasAvaliacoes` → `http://localhost:3000/api/avaliacoes/todas`
- Linha ~493: `http://localhost:3000/listarTodasAvaliacoesGestor` → `http://localhost:3000/api/avaliacoes/todas/gestor`
- Linha ~1089: `http://localhost:3000/competencias` → `http://localhost:3000/api/competencias`

#### 10. `codigoLegado/Ninebox/paginas/minhasAvaliacoes/dashboard.html`
**Correções:**
- Linha ~285: `http://localhost:3000/dashboardPoridAvaliacao` → `http://localhost:3000/api/avaliacoes/dashboard`
- Linha ~319: `http://localhost:3000/respostasAvaliadosGeral` → `http://localhost:3000/api/respostas/avaliacao`

#### 11. `codigoLegado/Ninebox/paginas/minhasAvaliacoes/respostas.html`
**Correções:**
- Linha ~262: `http://localhost:3000/competenciaPoridAvaliacao` → `http://localhost:3000/api/competencias/avaliacao`

#### 12. `codigoLegado/Ninebox/paginas/novaAvaliacao/autoavaliacao/nova_avaliacao3.html`
**Correções:**
- Linha ~87: `http://localhost:3000/competencias` → `http://localhost:3000/api/competencias`

#### 13. `codigoLegado/Ninebox/paginas/novaAvaliacao/avaliacaoGestor/nova_avaliacao_gestor3.html`
**Correções:**
- Linha ~87: `http://localhost:3000/competencias` → `http://localhost:3000/api/competencias`

#### 14. `codigoLegado/Ninebox/paginas/novo_avaliado.html`
**Correções:**
- Linha ~448: `window.location.href = "paginas/menu.html"` → `window.location.href = "menu.html"`

#### 15. `codigoLegado/Ninebox/paginas/nova_competencia.html`
**Correções:**
- Linha ~153: `window.location.href = "paginas/menu.html"` → `window.location.href = "menu.html"`

#### 16. `codigoLegado/Ninebox/paginas/nova_competencia2.html`
**Correções:**
- Linha ~255: `window.location.href = "paginas/menu.html"` → `window.location.href = "menu.html"`

---

## 🔄 Novos Endpoints Necessários no Backend

Alguns endpoints do frontend não existem no backend. Precisam ser criados ou mapeados:

1. ❌ `/descricaoPoridAvaliacao` → Criar ou mapear para endpoint existente
2. ❌ `/listarTodasAvaliacoes` → Mapear para `/api/avaliacoes`
3. ❌ `/listarTodasAvaliacoesGestor` → Mapear para `/api/avaliacoes?tipo=gestor`
4. ❌ `/salvarRespostaGestor` → Mapear para `/api/respostas`
5. ❌ `/dashboardPoridAvaliacao` → Criar endpoint de dashboard
6. ❌ `/respostasAvaliadosGeral` → Criar endpoint de respostas
7. ❌ `/competenciaPoridAvaliacao` → Mapear para `/api/competencias/avaliacao/:id`

---

## 📊 Estatísticas

- **Total de arquivos HTML**: 29
- **Arquivos já corrigidos**: 6 (21%)
- **Arquivos pendentes**: 16 (55%)
- **Arquivos sem problemas**: 7 (24%)

---

## ✅ Próximos Passos

1. Aplicar correções nos 16 arquivos pendentes
2. Criar/mapear os 7 endpoints faltantes no backend
3. Testar cada página individualmente
4. Verificar que visual e funcionalidades permanecem idênticos

---

**Deseja que eu aplique todas essas correções automaticamente?**
