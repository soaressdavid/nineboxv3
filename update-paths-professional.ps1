# Script para atualizar todos os caminhos para a nova estrutura profissional

Write-Host "🔄 Atualizando caminhos para estrutura profissional..." -ForegroundColor Cyan
Write-Host ""

# Função para atualizar caminhos em um arquivo
function Update-Paths {
    param($filePath)
    
    if (-not (Test-Path $filePath)) {
        return
    }
    
    $content = Get-Content $filePath -Raw -Encoding UTF8
    $originalContent = $content
    
    # Atualiza caminhos de CSS
    $content = $content -replace '\.\.\/CSS\/', '../../assets/styles/'
    $content = $content -replace '\.\/CSS\/', '../assets/styles/'
    $content = $content -replace 'CSS\/', 'assets/styles/'
    
    # Atualiza caminhos de imagens
    $content = $content -replace '\.\.\/ImagensMenu\/', '../../assets/images/icons/'
    $content = $content -replace '\.\/ImagensMenu\/', '../assets/images/icons/'
    $content = $content -replace 'ImagensMenu\/', 'assets/images/icons/'
    
    # Atualiza nomes de imagens
    $content = $content -replace 'mais\.svg', 'add.svg'
    $content = $content -replace 'mais\.gif', 'add.svg'
    $content = $content -replace 'editar\.svg', 'edit.svg'
    $content = $content -replace 'editar\.gif', 'edit.svg'
    $content = $content -replace 'procurar\.svg', 'search.svg'
    $content = $content -replace 'procurar\.gif', 'search.svg'
    $content = $content -replace 'sobre\.svg', 'info.svg'
    $content = $content -replace 'sobre\.gif', 'info.svg'
    $content = $content -replace 'adicionar\.svg', 'add-user.svg'
    $content = $content -replace 'adicionar\.gif', 'add-user.svg'
    $content = $content -replace 'avaliacoes\.svg', 'evaluation.svg'
    $content = $content -replace 'avaliacoes\.gif', 'evaluation.svg'
    $content = $content -replace 'perfil\.svg', 'profile.svg'
    $content = $content -replace 'avaliacao_autoavaliacao-icon\.svg', 'self-evaluation.svg'
    $content = $content -replace 'avaliacao_autoavaliacao_selecionada-icon\.svg', 'self-evaluation-selected.svg'
    $content = $content -replace 'avaliacao_gestor-icon\.svg', 'manager-evaluation.svg'
    $content = $content -replace 'avaliacao_gestor_selecionada-icon\.svg', 'manager-evaluation-selected.svg'
    $content = $content -replace 'eye\.svg', 'view.svg'
    
    # Atualiza caminhos de páginas
    $content = $content -replace 'paginas/menu\.html', 'pages/dashboard/menu.html'
    $content = $content -replace '\.\.\/menu\.html', '../dashboard/menu.html'
    $content = $content -replace '\.\.\/\.\.\/menu\.html', '../../dashboard/menu.html'
    $content = $content -replace '\.\.\/\.\.\/\.\.\/menu\.html', '../../../dashboard/menu.html'
    
    # Atualiza caminhos para index.html
    $content = $content -replace '\.\.\/index\.html', '../../index.html'
    $content = $content -replace '\.\.\/\.\.\/index\.html', '../../../index.html'
    $content = $content -replace '\.\.\/\.\.\/\.\.\/index\.html', '../../../../index.html'
    
    # Atualiza caminhos de navegação entre páginas
    $content = $content -replace 'novaAvaliacao/nova_avaliacao\.html', 'evaluations/create/select-type.html'
    $content = $content -replace 'consultar-contatos\.html', 'contacts/list.html'
    $content = $content -replace 'novo_avaliado\.html', 'contacts/create.html'
    $content = $content -replace 'nova_competencia\.html', 'competencies/create.html'
    $content = $content -replace 'nova_competencia2\.html', 'competencies/edit.html'
    $content = $content -replace 'modelos_avaliacao\.html', 'evaluations/models.html'
    $content = $content -replace 'minhasAvaliacoes/minhasavaliacoes\.html', 'evaluations/my-evaluations/list.html'
    
    # Atualiza script navbar
    $content = $content -replace '\.\.\/navbar\.js', '../../scripts/navbar.js'
    $content = $content -replace '\.\.\/\.\.\/navbar\.js', '../../../scripts/navbar.js'
    $content = $content -replace 'navbar\.js', 'scripts/navbar.js'
    
    # Salva apenas se houve mudanças
    if ($content -ne $originalContent) {
        Set-Content $filePath -Value $content -Encoding UTF8 -NoNewline
        return $true
    }
    return $false
}

# Atualiza todos os arquivos HTML
$files = Get-ChildItem -Path "frontend-pro" -Filter "*.html" -Recurse
$updated = 0

foreach ($file in $files) {
    if (Update-Paths $file.FullName) {
        $updated++
        Write-Host "  ✓ $($file.FullName -replace [regex]::Escape((Get-Location).Path + '\'), '')" -ForegroundColor Green
    }
}

# Atualiza navbar.js
if (Update-Paths "frontend-pro/scripts/navbar.js") {
    $updated++
    Write-Host "  ✓ frontend-pro/scripts/navbar.js" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Atualização concluída!" -ForegroundColor Green
Write-Host "   Arquivos atualizados: $updated" -ForegroundColor Cyan
