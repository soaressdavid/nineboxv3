# Script de Migração para Frontend Profissional
# Este script reorganiza o frontend com nomenclatura profissional

Write-Host "🚀 Iniciando migração para estrutura profissional..." -ForegroundColor Cyan
Write-Host ""

# 1. Criar estrutura de diretórios
Write-Host "📁 Criando estrutura de diretórios..." -ForegroundColor Yellow

$directories = @(
    "frontend-pro/assets/images/icons",
    "frontend-pro/assets/images/logo", 
    "frontend-pro/assets/styles",
    "frontend-pro/pages/auth",
    "frontend-pro/pages/dashboard",
    "frontend-pro/pages/contacts",
    "frontend-pro/pages/competencies",
    "frontend-pro/pages/evaluations/my-evaluations",
    "frontend-pro/pages/evaluations/create/self-evaluation",
    "frontend-pro/pages/evaluations/create/manager-evaluation",
    "frontend-pro/pages/evaluations/respond/employee",
    "frontend-pro/pages/evaluations/respond/manager",
    "frontend-pro/pages/matrix",
    "frontend-pro/scripts"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "  ✓ $dir" -ForegroundColor Green
}

Write-Host ""
Write-Host "📄 Copiando e renomeando arquivos..." -ForegroundColor Yellow

# 2. Copiar index.html
Copy-Item "codigoLegado/Ninebox/index.html" "frontend-pro/index.html"
Write-Host "  ✓ index.html" -ForegroundColor Green

# 3. Copiar e renomear CSS
$cssFiles = @{
    "codigoLegado/Ninebox/CSS/style.css" = "frontend-pro/assets/styles/main.css"
    "codigoLegado/Ninebox/CSS/login.usuario.css" = "frontend-pro/assets/styles/login.css"
    "codigoLegado/Ninebox/CSS/navbar.css" = "frontend-pro/assets/styles/navbar.css"
    "codigoLegado/Ninebox/CSS/consultar-contatos.css" = "frontend-pro/assets/styles/contacts.css"
    "codigoLegado/Ninebox/CSS/modelos-avaliacao.css" = "frontend-pro/assets/styles/models.css"
    "codigoLegado/Ninebox/CSS/nova_avaliacao.css" = "frontend-pro/assets/styles/evaluations.css"
}

foreach ($source in $cssFiles.Keys) {
    if (Test-Path $source) {
        Copy-Item $source $cssFiles[$source]
        Write-Host "  ✓ $($cssFiles[$source])" -ForegroundColor Green
    }
}

# 4. Copiar e renomear imagens
$imageFiles = @{
    "codigoLegado/Ninebox/ImagensMenu/mais.svg" = "frontend-pro/assets/images/icons/add.svg"
    "codigoLegado/Ninebox/ImagensMenu/editar.svg" = "frontend-pro/assets/images/icons/edit.svg"
    "codigoLegado/Ninebox/ImagensMenu/procurar.svg" = "frontend-pro/assets/images/icons/search.svg"
    "codigoLegado/Ninebox/ImagensMenu/sobre.svg" = "frontend-pro/assets/images/icons/info.svg"
    "codigoLegado/Ninebox/ImagensMenu/adicionar.svg" = "frontend-pro/assets/images/icons/add-user.svg"
    "codigoLegado/Ninebox/ImagensMenu/avaliacoes.svg" = "frontend-pro/assets/images/icons/evaluation.svg"
    "codigoLegado/Ninebox/ImagensMenu/perfil.svg" = "frontend-pro/assets/images/icons/profile.svg"
    "codigoLegado/Ninebox/ImagensMenu/delete-icon.png" = "frontend-pro/assets/images/icons/delete.png"
    "codigoLegado/Ninebox/ImagensMenu/edit-icon.png" = "frontend-pro/assets/images/icons/edit.png"
    "codigoLegado/Ninebox/ImagensMenu/eye.svg" = "frontend-pro/assets/images/icons/view.svg"
    "codigoLegado/Ninebox/ImagensMenu/ninebox.svg" = "frontend-pro/assets/images/logo/ninebox.svg"
    "codigoLegado/Ninebox/ImagensMenu/avaliacao_autoavaliacao-icon.svg" = "frontend-pro/assets/images/icons/self-evaluation.svg"
    "codigoLegado/Ninebox/ImagensMenu/avaliacao_autoavaliacao_selecionada-icon.svg" = "frontend-pro/assets/images/icons/self-evaluation-selected.svg"
    "codigoLegado/Ninebox/ImagensMenu/avaliacao_gestor-icon.svg" = "frontend-pro/assets/images/icons/manager-evaluation.svg"
    "codigoLegado/Ninebox/ImagensMenu/avaliacao_gestor_selecionada-icon.svg" = "frontend-pro/assets/images/icons/manager-evaluation-selected.svg"
}

foreach ($source in $imageFiles.Keys) {
    if (Test-Path $source) {
        Copy-Item $source $imageFiles[$source]
        Write-Host "  ✓ $($imageFiles[$source])" -ForegroundColor Green
    }
}

# 5. Copiar e renomear páginas HTML
$htmlFiles = @{
    # Auth
    "codigoLegado/Ninebox/paginas/responderAvaliacao/login.usuario.html" = "frontend-pro/pages/auth/employee-login.html"
    
    # Dashboard
    "codigoLegado/Ninebox/paginas/menu.html" = "frontend-pro/pages/dashboard/menu.html"
    
    # Contacts
    "codigoLegado/Ninebox/paginas/consultar-contatos.html" = "frontend-pro/pages/contacts/list.html"
    "codigoLegado/Ninebox/paginas/novo_avaliado.html" = "frontend-pro/pages/contacts/create.html"
    
    # Competencies
    "codigoLegado/Ninebox/paginas/nova_competencia.html" = "frontend-pro/pages/competencies/create.html"
    "codigoLegado/Ninebox/paginas/nova_competencia2.html" = "frontend-pro/pages/competencies/edit.html"
    
    # My Evaluations
    "codigoLegado/Ninebox/paginas/minhasAvaliacoes/minhasavaliacoes.html" = "frontend-pro/pages/evaluations/my-evaluations/list.html"
    "codigoLegado/Ninebox/paginas/minhasAvaliacoes/dashboard.html" = "frontend-pro/pages/evaluations/my-evaluations/dashboard.html"
    "codigoLegado/Ninebox/paginas/minhasAvaliacoes/respostas.html" = "frontend-pro/pages/evaluations/my-evaluations/responses.html"
    
    # Create Evaluation
    "codigoLegado/Ninebox/paginas/novaAvaliacao/nova_avaliacao.html" = "frontend-pro/pages/evaluations/create/select-type.html"
    
    # Self Evaluation Steps
    "codigoLegado/Ninebox/paginas/novaAvaliacao/autoavaliacao/nova_avaliacao1.html" = "frontend-pro/pages/evaluations/create/self-evaluation/step1.html"
    "codigoLegado/Ninebox/paginas/novaAvaliacao/autoavaliacao/nova_avaliacao2.html" = "frontend-pro/pages/evaluations/create/self-evaluation/step2.html"
    "codigoLegado/Ninebox/paginas/novaAvaliacao/autoavaliacao/nova_avaliacao3.html" = "frontend-pro/pages/evaluations/create/self-evaluation/step3.html"
    "codigoLegado/Ninebox/paginas/novaAvaliacao/autoavaliacao/nova_avaliacao4.html" = "frontend-pro/pages/evaluations/create/self-evaluation/step4.html"
    
    # Manager Evaluation Steps
    "codigoLegado/Ninebox/paginas/novaAvaliacao/avaliacaoGestor/nova_avaliacao_gestor1.html" = "frontend-pro/pages/evaluations/create/manager-evaluation/step1.html"
    "codigoLegado/Ninebox/paginas/novaAvaliacao/avaliacaoGestor/nova_avaliacao_gestor2.html" = "frontend-pro/pages/evaluations/create/manager-evaluation/step2.html"
    "codigoLegado/Ninebox/paginas/novaAvaliacao/avaliacaoGestor/nova_avaliacao_gestor3.html" = "frontend-pro/pages/evaluations/create/manager-evaluation/step3.html"
    "codigoLegado/Ninebox/paginas/novaAvaliacao/avaliacaoGestor/nova_avaliacao_gestor4.html" = "frontend-pro/pages/evaluations/create/manager-evaluation/step4.html"
    
    # Respond Employee
    "codigoLegado/Ninebox/paginas/responderAvaliacao/avaliacao_lista.html" = "frontend-pro/pages/evaluations/respond/employee/list.html"
    "codigoLegado/Ninebox/paginas/responderAvaliacao/avaliacao_orientacoes.html" = "frontend-pro/pages/evaluations/respond/employee/instructions.html"
    "codigoLegado/Ninebox/paginas/responderAvaliacao/avaliacao_conteudo.html" = "frontend-pro/pages/evaluations/respond/employee/form.html"
    "codigoLegado/Ninebox/paginas/responderAvaliacao/avaliacao_agradecimentos.html" = "frontend-pro/pages/evaluations/respond/employee/thanks.html"
    
    # Respond Manager
    "codigoLegado/Ninebox/paginas/responderAvaliacaoGestor/avaliacao_lista_gestor.html" = "frontend-pro/pages/evaluations/respond/manager/list.html"
    "codigoLegado/Ninebox/paginas/responderAvaliacaoGestor/avaliacao_orientacoes_gestor.html" = "frontend-pro/pages/evaluations/respond/manager/instructions.html"
    "codigoLegado/Ninebox/paginas/responderAvaliacaoGestor/avaliacao_conteudo_gestor.html" = "frontend-pro/pages/evaluations/respond/manager/form.html"
    "codigoLegado/Ninebox/paginas/responderAvaliacaoGestor/avaliacao_agradecimentos_gestor.html" = "frontend-pro/pages/evaluations/respond/manager/thanks.html"
    
    # Models
    "codigoLegado/Ninebox/paginas/modelos_avaliacao.html" = "frontend-pro/pages/evaluations/models.html"
    
    # Matrix
    "codigoLegado/Ninebox/mvpMatriz.html" = "frontend-pro/pages/matrix/ninebox.html"
}

foreach ($source in $htmlFiles.Keys) {
    if (Test-Path $source) {
        Copy-Item $source $htmlFiles[$source]
        Write-Host "  ✓ $($htmlFiles[$source])" -ForegroundColor Green
    }
}

# 6. Copiar scripts
Copy-Item "codigoLegado/Ninebox/navbar.js" "frontend-pro/scripts/navbar.js"
Write-Host "  ✓ scripts/navbar.js" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Migração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Estatísticas:" -ForegroundColor Cyan
Write-Host "  - Diretórios criados: $($directories.Count)" -ForegroundColor White
Write-Host "  - Arquivos CSS: $($cssFiles.Count)" -ForegroundColor White
Write-Host "  - Imagens: $($imageFiles.Count)" -ForegroundColor White
Write-Host "  - Páginas HTML: $($htmlFiles.Count)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  PRÓXIMO PASSO: Atualizar caminhos nos arquivos HTML!" -ForegroundColor Yellow
Write-Host "   Execute: ./update-paths-professional.ps1" -ForegroundColor Yellow

