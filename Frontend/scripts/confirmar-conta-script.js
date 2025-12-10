document.addEventListener('DOMContentLoaded', async () => {
    // 1. Pega o token da URL (?token=XYZ...)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const loadingDiv = document.getElementById('loadingState');
    const successDiv = document.getElementById('successState');
    const errorDiv = document.getElementById('errorState');
    const errorMsg = document.getElementById('errorMsg');

    // URL do Backend
    const API_URL = 'http://localhost:3000/api/usuarios/confirmar-conta';

    if (!token) {
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        errorMsg.textContent = "Token não fornecido na URL.";
        return;
    }

    try {
        // 2. Faz a requisição ao backend
        const response = await fetch(`${API_URL}?token=${token}`, {
            method: 'GET'
        });

        const data = await response.json();

        loadingDiv.style.display = 'none';

        if (response.ok) {
            // Sucesso
            successDiv.style.display = 'block';
        } else {
            // Erro vindo do backend (ex: Token expirado)
            errorDiv.style.display = 'block';
            errorMsg.textContent = data.message || "Falha na validação.";
        }

    } catch (error) {
        console.error(error);
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        errorMsg.textContent = "Erro de conexão com o servidor.";
    }
});