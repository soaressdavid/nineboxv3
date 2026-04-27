function normalizarCPF (cpf) {
    return String(cpf).replace(/\D/g, '');
}

module.exports = {
    normalizarCPF
};