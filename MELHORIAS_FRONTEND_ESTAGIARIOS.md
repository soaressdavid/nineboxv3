# Melhorias Frontend - Tarefas para a Equipe

Pessoal, separei aqui as melhorias que precisamos fazer no frontend. Dividi entre vocês 2. São melhorias simples mas que vão deixar o sistema bem mais profissional.

---

## 📋 Pessoa 1: Validações e Feedback Visual

### O que você vai fazer
Melhorar a experiência do usuário com validações nos formulários e feedback visual das ações.

### Tarefas

#### 1.1 Adicionar Validação de Formulários
**Prioridade:** Alta  
**Tempo estimado:** 6-8 horas

**Por que estamos fazendo isso:**
Atualmente o usuário preenche o formulário todo, clica em salvar, e só aí descobre que o email tá errado ou faltou algum campo. Isso frustra muito. Precisamos validar enquanto ele digita e mostrar os erros na hora.

**Descrição:**
Adicionar validações nos formulários antes de enviar dados para o backend.

**O que fazer:**
- Validar campos obrigatórios
- Validar formato de email
- Validar formato de CPF
- Validar formato de datas
- Mostrar mensagens de erro claras

**Páginas a modificar:**
- `pages/contacts/create.html` - Criar contato
- `pages/competencies/create.html` - Criar competência
- `pages/evaluations/create/*/step*.html` - Criar avaliação

**Exemplo de implementação:**
```javascript
// Função para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Função para validar CPF
function validarCPF(cpf) {
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.length === 11;
}

// Função para mostrar erro
function mostrarErro(campo, mensagem) {
  const input = document.getElementById(campo);
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = mensagem;
  errorDiv.style.color = 'red';
  errorDiv.style.fontSize = '12px';
  errorDiv.style.marginTop = '5px';
  
  // Remove erro anterior se existir
  const erroAnterior = input.parentElement.querySelector('.error-message');
  if (erroAnterior) {
    erroAnterior.remove();
  }
  
  input.parentElement.appendChild(errorDiv);
  input.style.borderColor = 'red';
}

// Função para limpar erro
function limparErro(campo) {
  const input = document.getElementById(campo);
  const errorDiv = input.parentElement.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
  input.style.borderColor = '';
}

// Exemplo de uso no formulário
function validarFormulario(event) {
  event.preventDefault();
  let valido = true;
  
  // Validar nome
  const nome = document.getElementById('nome').value;
  if (!nome || nome.trim().length < 3) {
    mostrarErro('nome', 'Nome deve ter no mínimo 3 caracteres');
    valido = false;
  } else {
    limparErro('nome');
  }
  
  // Validar email
  const email = document.getElementById('email').value;
  if (!validarEmail(email)) {
    mostrarErro('email', 'Email inválido');
    valido = false;
  } else {
    limparErro('email');
  }
  
  // Validar CPF
  const cpf = document.getElementById('cpf').value;
  if (!validarCPF(cpf)) {
    mostrarErro('cpf', 'CPF deve ter 11 dígitos');
    valido = false;
  } else {
    limparErro('cpf');
  }
  
  if (valido) {
    // Enviar formulário
    enviarFormulario();
  }
}
```

---

#### 1.2 Adicionar Loading/Spinner nas Requisições
**Prioridade:** Alta  
**Tempo estimado:** 4-5 horas

**Por que estamos fazendo isso:**
Quando o usuário clica em salvar ou carregar algo, a tela fica parada sem feedback nenhum. Ele não sabe se travou, se tá carregando, ou se precisa clicar de novo. Um loading resolve isso e deixa claro que o sistema tá processando.

**Descrição:**
Mostrar indicador de carregamento enquanto aguarda resposta do servidor.

**O que fazer:**
- Criar componente de loading
- Mostrar loading ao fazer requisições
- Esconder loading ao receber resposta
- Desabilitar botões durante carregamento

**Exemplo de implementação:**
```html
<!-- Adicionar no HTML -->
<div id="loading" class="loading-overlay" style="display: none;">
  <div class="spinner"></div>
  <p>Carregando...</p>
</div>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  color: white;
  margin-top: 20px;
  font-size: 18px;
}
</style>
```

```javascript
// Funções para controlar loading
function mostrarLoading() {
  document.getElementById('loading').style.display = 'flex';
}

function esconderLoading() {
  document.getElementById('loading').style.display = 'none';
}

// Exemplo de uso em requisição
async function salvarContato() {
  mostrarLoading();
  
  try {
    const response = await fetch('http://localhost:3000/api/avaliados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert('Contato salvo com sucesso!');
    } else {
      alert('Erro: ' + result.message);
    }
  } catch (error) {
    alert('Erro de conexão com o servidor');
  } finally {
    esconderLoading();
  }
}
```

---

#### 1.3 Adicionar Mensagens de Sucesso/Erro (Toast)
**Prioridade:** Média  
**Tempo estimado:** 4-5 horas

**Por que estamos fazendo isso:**
Atualmente usamos alert() do JavaScript que é feio e bloqueia a tela. Precisamos de notificações modernas que aparecem no canto, mostram se deu certo ou errado, e somem sozinhas. Fica muito mais profissional.

**Descrição:**
Criar sistema de notificações toast para feedback de ações.

**O que fazer:**
- Criar componente de toast
- Mostrar toast de sucesso
- Mostrar toast de erro
- Auto-fechar após alguns segundos

**Exemplo de implementação:**
```html
<!-- Adicionar no HTML -->
<div id="toast-container"></div>

<style>
#toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
}

.toast {
  background: white;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  min-width: 300px;
  animation: slideIn 0.3s ease-out;
}

.toast.success {
  border-left: 4px solid #28a745;
}

.toast.error {
  border-left: 4px solid #dc3545;
}

.toast.warning {
  border-left: 4px solid #ffc107;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.toast-message {
  font-size: 14px;
  color: #666;
}
</style>
```

```javascript
// Função para mostrar toast
function mostrarToast(tipo, titulo, mensagem, duracao = 3000) {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `
    <div class="toast-title">${titulo}</div>
    <div class="toast-message">${mensagem}</div>
  `;
  
  container.appendChild(toast);
  
  // Remove após duração
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, duracao);
}

// Exemplos de uso
mostrarToast('success', 'Sucesso!', 'Contato salvo com sucesso');
mostrarToast('error', 'Erro!', 'Não foi possível salvar o contato');
mostrarToast('warning', 'Atenção!', 'Preencha todos os campos obrigatórios');
```

---

## 📋 Pessoa 2: Melhorias de Interface e Usabilidade

### O que você vai fazer
Melhorar a interface e experiência do usuário com funcionalidades práticas e responsividade.

### Tarefas

#### 2.1 Adicionar Confirmação antes de Ações Importantes
**Prioridade:** Alta  
**Tempo estimado:** 5-6 horas

**Por que estamos fazendo isso:**
Já aconteceu de usuários clicarem em deletar sem querer e perderem dados importantes. Precisamos de uma confirmação "Tem certeza?" antes de ações que não dá pra desfazer. É uma segurança básica que todo sistema deve ter.

**Descrição:**
Adicionar modais de confirmação antes de deletar ou cancelar.

**O que fazer:**
- Criar modal de confirmação reutilizável
- Adicionar confirmação ao deletar contatos
- Adicionar confirmação ao cancelar avaliações
- Adicionar confirmação ao sair de formulários não salvos

**Exemplo de implementação:**
```html
<!-- Modal de Confirmação -->
<div id="confirmModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3 id="confirmTitle">Confirmar Ação</h3>
    </div>
    <div class="modal-body">
      <p id="confirmMessage">Tem certeza que deseja continuar?</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="fecharConfirmacao()">Cancelar</button>
      <button class="btn btn-danger" id="confirmButton">Confirmar</button>
    </div>
  </div>
</div>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 0;
  border-radius: 8px;
  min-width: 400px;
  max-width: 500px;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
```

```javascript
// Função para mostrar confirmação
function mostrarConfirmacao(titulo, mensagem, callback) {
  const modal = document.getElementById('confirmModal');
  const confirmButton = document.getElementById('confirmButton');
  
  document.getElementById('confirmTitle').textContent = titulo;
  document.getElementById('confirmMessage').textContent = mensagem;
  
  modal.style.display = 'flex';
  
  // Remove listeners anteriores
  const novoButton = confirmButton.cloneNode(true);
  confirmButton.parentNode.replaceChild(novoButton, confirmButton);
  
  // Adiciona novo listener
  document.getElementById('confirmButton').addEventListener('click', () => {
    callback();
    fecharConfirmacao();
  });
}

function fecharConfirmacao() {
  document.getElementById('confirmModal').style.display = 'none';
}

// Exemplo de uso
function deletarContato(id) {
  mostrarConfirmacao(
    'Deletar Contato',
    'Tem certeza que deseja deletar este contato? Esta ação não pode ser desfeita.',
    async () => {
      // Código para deletar
      await fetch(`http://localhost:3000/api/avaliados/${id}`, {
        method: 'DELETE'
      });
      alert('Contato deletado com sucesso!');
      carregarContatos();
    }
  );
}
```

---

#### 2.2 Adicionar Máscaras de Entrada
**Prioridade:** Alta  
**Tempo estimado:** 4-5 horas

**Por que estamos fazendo isso:**
Quando o usuário digita CPF ou telefone, ele não sabe se precisa colocar pontos e traços ou não. Com máscara automática, ele só digita os números e o sistema formata sozinho. Fica mais fácil e evita erros.

**Descrição:**
Adicionar máscaras automáticas em campos de CPF, telefone e data.

**O que fazer:**
- Máscara de CPF (000.000.000-00)
- Máscara de telefone ((00) 00000-0000)
- Máscara de data (DD/MM/AAAA)
- Aplicar em todos os formulários

**Exemplo de implementação:**
```javascript
// Máscara de CPF
function mascaraCPF(input) {
  input.addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    
    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }
    
    if (valor.length > 9) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    e.target.value = valor;
  });
}

// Máscara de Telefone
function mascaraTelefone(input) {
  input.addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    
    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }
    
    if (valor.length > 10) {
      valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    e.target.value = valor;
  });
}

// Máscara de Data
function mascaraData(input) {
  input.addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    
    if (valor.length > 8) {
      valor = valor.substring(0, 8);
    }
    
    if (valor.length > 4) {
      valor = valor.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    }
    
    e.target.value = valor;
  });
}

// Aplicar máscaras ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  const cpfInputs = document.querySelectorAll('input[name="cpf"]');
  cpfInputs.forEach(input => mascaraCPF(input));
  
  const telefoneInputs = document.querySelectorAll('input[name="telefone"]');
  telefoneInputs.forEach(input => mascaraTelefone(input));
  
  const dataInputs = document.querySelectorAll('input[type="text"][name="data"]');
  dataInputs.forEach(input => mascaraData(input));
});
```

---

#### 2.3 Melhorar Responsividade Mobile
**Prioridade:** Média  
**Tempo estimado:** 5-6 horas

**Por que estamos fazendo isso:**
Muita gente vai acessar o sistema pelo celular. Atualmente as tabelas ficam quebradas e os formulários saem da tela. Precisamos ajustar pra funcionar bem em qualquer tamanho de tela.

**Descrição:**
Ajustar layout para funcionar bem em dispositivos móveis.

**O que fazer:**
- Ajustar tabelas para mobile
- Ajustar formulários para mobile
- Ajustar navbar para mobile
- Testar em diferentes tamanhos de tela

**Exemplo de implementação:**
```css
/* Responsividade para tabelas */
@media (max-width: 768px) {
  /* Esconde cabeçalho da tabela */
  table thead {
    display: none;
  }
  
  /* Transforma linhas em cards */
  table tr {
    display: block;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
  }
  
  table td {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  table td:last-child {
    border-bottom: none;
  }
  
  /* Adiciona label antes do conteúdo */
  table td::before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 10px;
  }
}

/* Responsividade para formulários */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .form-group {
    width: 100% !important;
    margin-bottom: 15px;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
}

/* Responsividade para navbar */
@media (max-width: 768px) {
  .navbar h2 {
    font-size: 18px;
  }
  
  .navbar img {
    width: 35px;
    height: 35px;
  }
}
```

```html
<!-- Adicionar data-label nas células da tabela -->
<tr>
  <td data-label="Nome">João Silva</td>
  <td data-label="CPF">123.456.789-00</td>
  <td data-label="Email">joao@email.com</td>
  <td data-label="Ações">
    <button>Editar</button>
  </td>
</tr>
```

---

#### 2.4 Adicionar Paginação nas Listagens
**Prioridade:** Baixa  
**Tempo estimado:** 4-5 horas

**Por que estamos fazendo isso:**
Quando tiver 100+ colaboradores cadastrados, a página vai ficar lenta e difícil de navegar. Com paginação, mostramos 10 por vez e o usuário navega entre as páginas. Melhora muito a performance e usabilidade.

**Descrição:**
Adicionar paginação para listagens com muitos itens.

**O que fazer:**
- Criar componente de paginação
- Dividir lista em páginas
- Adicionar navegação entre páginas
- Mostrar total de itens

**Exemplo de implementação:**
```html
<!-- Componente de Paginação -->
<div class="pagination">
  <button id="btnPrimeira" onclick="irParaPagina(1)">Primeira</button>
  <button id="btnAnterior" onclick="paginaAnterior()">Anterior</button>
  <span id="paginaAtual">Página 1 de 10</span>
  <button id="btnProxima" onclick="proximaPagina()">Próxima</button>
  <button id="btnUltima" onclick="irParaUltimaPagina()">Última</button>
</div>

<style>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:hover {
  background: #f0f0f0;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  padding: 0 15px;
  font-weight: bold;
}
</style>
```

```javascript
// Variáveis de paginação
let paginaAtual = 1;
let itensPorPagina = 10;
let totalItens = 0;
let todosItens = [];

// Função para calcular total de páginas
function calcularTotalPaginas() {
  return Math.ceil(totalItens / itensPorPagina);
}

// Função para renderizar página atual
function renderizarPagina() {
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const itensPagina = todosItens.slice(inicio, fim);
  
  // Renderiza itens da página
  renderizarItens(itensPagina);
  
  // Atualiza controles de paginação
  atualizarControlesPaginacao();
}

// Função para atualizar controles
function atualizarControlesPaginacao() {
  const totalPaginas = calcularTotalPaginas();
  
  document.getElementById('paginaAtual').textContent = 
    `Página ${paginaAtual} de ${totalPaginas}`;
  
  document.getElementById('btnPrimeira').disabled = paginaAtual === 1;
  document.getElementById('btnAnterior').disabled = paginaAtual === 1;
  document.getElementById('btnProxima').disabled = paginaAtual === totalPaginas;
  document.getElementById('btnUltima').disabled = paginaAtual === totalPaginas;
}

// Funções de navegação
function proximaPagina() {
  if (paginaAtual < calcularTotalPaginas()) {
    paginaAtual++;
    renderizarPagina();
  }
}

function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderizarPagina();
  }
}

function irParaPagina(pagina) {
  paginaAtual = pagina;
  renderizarPagina();
}

function irParaUltimaPagina() {
  paginaAtual = calcularTotalPaginas();
  renderizarPagina();
}

// Inicializar paginação
function inicializarPaginacao(itens) {
  todosItens = itens;
  totalItens = itens.length;
  paginaAtual = 1;
  renderizarPagina();
}
```

---

## 📊 Resumo de Distribuição

| Estagiário | Área | Tarefas | Tempo Total |
|------------|------|---------|-------------|
| **Estagiário 1** | Validações e Feedback | 3 tarefas | 14-18 horas |
| **Estagiário 2** | Interface e Usabilidade | 4 tarefas | 18-22 horas |

---

## 📚 Recursos de Aprendizado

### Para todos
- [HTML Básico](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
- [CSS Básico](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
- [JavaScript Básico](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Bootstrap 5](https://getbootstrap.com/docs/5.3/)

### Estagiário 1
- [Validação de Formulários](https://developer.mozilla.org/pt-BR/docs/Learn/Forms/Form_validation)
- [Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [CSS Animations](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_Animations)

### Estagiário 2
- [Responsive Design](https://developer.mozilla.org/pt-BR/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Media Queries](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Media_Queries)
- [JavaScript Events](https://developer.mozilla.org/pt-BR/docs/Web/Events)

---

## ✅ Checklist de Entrega

Cada estagiário deve entregar:

- [ ] Código funcionando (testado no navegador)
- [ ] Funcionalidade testada em diferentes cenários
- [ ] Código comentado explicando o que foi feito
- [ ] Print screens ou vídeo mostrando funcionamento
- [ ] Lista de páginas modificadas

---

## 🤝 Dicas Importantes

1. **Teste no navegador** - Sempre teste suas mudanças antes de entregar
2. **Use o console** - Use `console.log()` para debugar
3. **Inspecione elementos** - Use F12 para ver erros e testar CSS
4. **Teste em mobile** - Use o modo responsivo do navegador (F12 > Toggle device toolbar)
5. **Pergunte quando tiver dúvida** - É melhor perguntar do que fazer errado

---

## 🆘 Quando Pedir Ajuda

Peça ajuda se:
- Não entender o que precisa fazer
- Encontrar um erro que não consegue resolver
- Não souber como testar algo
- Tiver dúvida sobre qual abordagem usar
- O código não funcionar como esperado

---

## 🧪 Como Testar

### Teste 1: Validação de Formulário
1. Abra a página de criar contato
2. Tente enviar formulário vazio
3. Deve mostrar mensagens de erro
4. Preencha corretamente e envie
5. Deve funcionar normalmente

### Teste 2: Loading
1. Abra a página de listagem
2. Observe o loading aparecer
3. Aguarde carregar os dados
4. Loading deve desaparecer

### Teste 3: Toast
1. Salve um contato
2. Deve aparecer toast de sucesso
3. Toast deve desaparecer sozinho após 3 segundos

### Teste 4: Confirmação
1. Tente deletar um contato
2. Deve aparecer modal de confirmação
3. Clique em cancelar - não deve deletar
4. Tente novamente e confirme - deve deletar

### Teste 5: Máscaras
1. Digite CPF sem pontos/traços
2. Deve formatar automaticamente
3. Teste com telefone e data também

### Teste 6: Responsividade
1. Abra F12 no navegador
2. Clique no ícone de dispositivo móvel
3. Teste em diferentes tamanhos
4. Tudo deve funcionar bem

---

**Boa sorte e bom trabalho! 🚀**
