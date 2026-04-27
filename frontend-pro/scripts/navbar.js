/* ------------------------------- Leia com atenção ! ------------------------------------- 

Para aplicar o navbar em uma nova página já com o modal de logout, é necessário colocar 
os seguintes códigos:

//1º No Head da página, importar o css do estilo:

<link rel="stylesheet" href="../assets/styles/navbar.css">

//2º No javascript, chamar o arquivo javascript e adicionar a funcionalidade script do modal de logout

    <script src="../../scripts/navbar.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        crossorigin="anonymous"></script>

//3° ainda no javascript, use a seguinte variável para identificar a página. É aqui que o script
pega o nome da página para identificá-la no navbar. Troque o nome conforme a página.

//Identificação da página para o navbar
        window.nomePagina = "Minhas Avaliações";   

//Feito todos os passos o navbar será injetado no DOM, seguindo a lógica do código abaixo

O navbar a parte tem o propósito de facilitar a manuntenção do código. Qualquer alteração realizada aqui
influenciará todas as páginas

--------------------------------------------------------------------------------------------------------*/

function getRootBasePath() {
  const path = window.location.pathname;
  const parts = path.split('/');
  const idx = parts.indexOf('frontend-pro');
  if (idx >= 0) {
    const basePath = parts.slice(0, idx + 1).join('/');
    // Garante que sempre comece com /
    const finalPath = basePath.startsWith('/') ? basePath : '/' + basePath;
    console.log('getRootBasePath:', finalPath);
    return finalPath;
  }
  console.log('getRootBasePath: frontend-pro not found in path');
  return '';
}

function getAbsoluteUrl(relativePath) {
  const basePath = getRootBasePath();
  const fullPath = basePath + relativePath;
  console.log('getAbsoluteUrl:', fullPath);
  return fullPath;
}

function pagePathEndsWith(target) {
  return window.location.pathname.endsWith(target);
}

//Como o nome sugere, ela injeta o seguinte html no DOM:
function injectNavbar() {
  //Essa const serve para verificar se a página está na lista de páginas que não devem redirecionar para o menu
  //Se a página não estiver na lista, ele injeta o navbar geral que redireciona para o menu
  //Mas se tiver na lista, ele injeta um navbar diferente
  const responderAvaliacao = [
    "/pages/evaluations/respond/employee/form.html",
    "/pages/evaluations/respond/employee/list.html",
    "/pages/evaluations/respond/employee/instructions.html",
    "/pages/evaluations/respond/employee/thanks.html"
  ];

  const responderAvaliacaoGestor = [
    "/pages/evaluations/respond/manager/form.html",
    "/pages/evaluations/respond/manager/list.html",
    "/pages/evaluations/respond/manager/instructions.html",
    "/pages/evaluations/respond/manager/thanks.html"
  ];

  const basePath = getRootBasePath();
  const menuUrl = getAbsoluteUrl('/pages/dashboard/menu.html');
  const perfilUrl = getAbsoluteUrl('/assets/images/icons/profile.svg');
  
  const navbarAdmin = `
    <nav class="navbar navbar-expand-lg navbar-light p-0 m-0 mb-5">
  <div class="container-fluid p-0">

    <a class="navbar-brand" href="${menuUrl}">
      <h2 id="tituloNavbar" class="header-avaliacao m-2 ps-1"><!--Aqui fica o titulo injetado do navbar--></h2>
    </a>
    <div class="dropdown ms-auto">
        <a href="#" class="d-flex align-items-center text-decoration-none" id="profileDropdown"
          data-bs-toggle="dropdown" aria-expanded="false">
          <img src="${perfilUrl}" alt="Logo" width="50" height="50" class="d-flex align-text-top"
            style="margin-right: 30px;">

        </a>
        <ul class="dropdown-menu" aria-labelledby="profileDropdown">
          <li><a class="dropdown-item" href="#" id="logout">Sair</a></li>
        </ul>
      </div>
    </div>
    </div>
  </nav>

<div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="logoutModalLabel">Confirmação de Logout</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Tem certeza de que deseja sair?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="confirmLogout">Sair</button>
      </div>
    </div>
  </div>
</div>
  `;

  const navbarAvaliado = `
    <nav class="navbar navbar-expand-lg navbar-light p-0 m-0 mb-5">
  <div class="container-fluid p-0">

    <a class="navbar-brand" href="${getAbsoluteUrl('/pages/evaluations/respond/employee/list.html')}">
      <h2 id="tituloNavbar" class="header-avaliacao m-2 ps-1"><!--Aqui fica o titulo injetado do navbar--></h2>
    </a>
    <div class="dropdown ms-auto">
        <a href="#" class="d-flex align-items-center text-decoration-none" id="profileDropdown"
          data-bs-toggle="dropdown" aria-expanded="false">
          <img src="${perfilUrl}" alt="Logo" width="50" height="50" class="d-flex align-text-top"
            style="margin-right: 30px;">

        </a>
        <ul class="dropdown-menu" aria-labelledby="profileDropdown">
          <li><a class="dropdown-item" href="#" id="logout">Sair</a></li>
        </ul>
      </div>
    </div>
    </div>
  </nav>

<div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="logoutModalLabel">Confirmação de Logout</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Tem certeza de que deseja sair?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="confirmLogout">Sair</button>
      </div>
    </div>
  </div>
</div>
  `;

  const navbarGestor = `
  <nav class="navbar navbar-expand-lg navbar-light p-0 m-0 mb-5">
  <div class="container-fluid p-0">

    <a class="navbar-brand" href="${getAbsoluteUrl('/pages/evaluations/respond/manager/list.html')}">
      <h2 id="tituloNavbar" class="header-avaliacao m-2 ps-1"><!--Aqui fica o titulo injetado do navbar--></h2>
    </a>
    <div class="dropdown ms-auto">
        <a href="#" class="d-flex align-items-center text-decoration-none" id="profileDropdown"
          data-bs-toggle="dropdown" aria-expanded="false">
          <img src="${perfilUrl}" alt="Logo" width="50" height="50" class="d-flex align-text-top"
            style="margin-right: 30px;">

        </a>
        <ul class="dropdown-menu" aria-labelledby="profileDropdown">
          <li><a class="dropdown-item" href="#" id="logout">Sair</a></li>
        </ul>
      </div>
    </div>
    </div>
  </nav>

<div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="logoutModalLabel">Confirmação de Logout</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Tem certeza de que deseja sair?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="confirmLogout">Sair</button>
      </div>
    </div>
  </div>
</div>
  `;

  if (responderAvaliacao.some(pagePathEndsWith)) {

    document.body.insertAdjacentHTML('afterbegin', navbarAvaliado);

  } else if (responderAvaliacaoGestor.some(pagePathEndsWith)) {
    document.body.insertAdjacentHTML('afterbegin', navbarGestor);
  } else {
    document.body.insertAdjacentHTML('afterbegin', navbarAdmin);
  }

}

//Atualiza o h2 do código injetado com o valor da variável window.nomePagina
function atualizarTituloNavbar() {

  const nomePagina = window.nomePagina;
  const h2Navbar = document.querySelector('#tituloNavbar');
  if (h2Navbar && nomePagina) {
    h2Navbar.textContent = nomePagina;
  }
}

//Adiciona funcionalidade script para o modal de logout
function configurarLogout() {

  const logoutButton = document.getElementById('logout');
  const logoutModal = document.getElementById('logoutModal');
  const confirmLogout = document.getElementById('confirmLogout');

  if (logoutButton && logoutModal && confirmLogout) {
    logoutButton.addEventListener('click', () => {
      const modal = new bootstrap.Modal(logoutModal);
      modal.show();
    });

    confirmLogout.addEventListener('click', () => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      const indexUrl = getAbsoluteUrl('/index.html');
      window.location = indexUrl;
    });
  } else {
    console.error("Erro: Elementos do logout não encontrados.");
  }
}

//Gatilho para as funções. Espera o DOM estar totalmente carregado para injetar os scripts
window.addEventListener('DOMContentLoaded', () => {
  injectNavbar();
  atualizarTituloNavbar();
  configurarLogout();
});
