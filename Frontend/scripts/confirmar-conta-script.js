document.addEventListener('DOMContentLoaded', async () => {
    // 1. Pega o token da URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    // Elementos da tela
    const loadingDiv = document.getElementById('loadingState');
    const successDiv = document.getElementById('successState');
    const errorDiv = document.getElementById('errorState');
    const errorMsg = document.getElementById('errorMsg');

    // URL do Backend (Verifique se a porta é 3000 ou 5000)
    const API_URL = 'http://localhost:3000/api/usuarios/confirmar-conta';

    // Se não tiver token, mostra erro direto
    if (!token) {
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        errorMsg.textContent = "Nenhum código de verificação encontrado.";
        return;
    }

    try {
        // 2. Chama o Backend
        const response = await fetch(`${API_URL}?token=${token}`, {
            method: 'GET'
        });

        const data = await response.json();

        // Esconde carregamento
        loadingDiv.style.display = 'none';

        if (response.ok) {
            // SUCESSO
            successDiv.style.display = 'block';
        } else {
            // ERRO (Ex: Token expirado)
            errorDiv.style.display = 'block';
            errorMsg.textContent = data.message || "Não foi possível ativar a conta.";
        }

    } catch (error) {
        // ERRO DE CONEXÃO
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        errorMsg.textContent = "Erro de conexão com o servidor. Tente novamente.";
    }
});