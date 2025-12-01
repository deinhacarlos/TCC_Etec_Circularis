// CÓDIGO FINAL E CORRIGIDO PARA configuracoes-conta-script.js

// Escopo global: Apenas o URL base.
const BASE_URL = 'http://localhost:3000'; 

document.addEventListener('DOMContentLoaded', () => {

    // 1. CARREGA VARIÁVEIS DE AUTENTICAÇÃO
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('userId') || localStorage.getItem('usuarioId'); 

    // 2. VERIFICA LOGIN
    if (!token || !usuarioId) {
        window.location.href = 'login.html';
        return; // Interrompe o script se não estiver logado
    }
    
    // 3. CONFIGURA LOGOUT
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // ==========================================
    // FUNÇÕES UTILITÁRIAS
    // ==========================================
    // ... (função showToast e Toggle Password permanecem as mesmas) ...
    function showToast(message, type = 'success') {
        const toastEl = document.getElementById('feedbackToast');
        const toastIcon = document.getElementById('toastIcon');
        const toastMsg = document.getElementById('toastMessage');

        toastMsg.textContent = message;

        // Remove classes anteriores
        toastEl.className = 'toast show';

        if (type === 'success') {
            toastEl.style.backgroundColor = 'var(--success-green)';
            toastEl.style.color = 'white';
            toastIcon.className = 'bi bi-check-circle-fill';
        } else {
            toastEl.style.backgroundColor = 'var(--error-red)';
            toastEl.style.color = 'white';
            toastIcon.className = 'bi bi-exclamation-circle-fill';
        }

        setTimeout(() => {
            toastEl.classList.remove('show');
        }, 3000);
    }
    
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });

    // ==========================================
    // ALTERAR SENHA
    // ==========================================
    const formSenha = document.getElementById('formSenha');
    const senhaError = document.getElementById('senhaError');

    formSenha.addEventListener('submit', async (e) => {
        e.preventDefault();

        const senhaAtual = document.getElementById('senhaAtual').value;
        const novaSenha = document.getElementById('novaSenha').value;
        const confirmaSenha = document.getElementById('confirmaSenha').value;

        if (novaSenha !== confirmaSenha) {
            senhaError.textContent = 'As senhas não coincidem.';
            senhaError.classList.add('show');
            return;
        }

        if (novaSenha.length < 6) {
            senhaError.textContent = 'A senha deve ter no mínimo 6 caracteres.';
            senhaError.classList.add('show');
            return;
        }

        senhaError.classList.remove('show');

        try {
            // CORRIGIDO: Usando BASE_URL
            const response = await fetch(`${BASE_URL}/api/usuarios/${usuarioId}/senha`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ senhaAtual, novaSenha })
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Senha atualizada com sucesso!');
                formSenha.reset();
            } else {
                showToast(data.message || 'Erro ao atualizar senha.', 'error');
            }

        } catch (error) {
            console.error('Erro:', error);
            showToast('Erro de conexão com o servidor.', 'error');
        }
    });

    // ==========================================
    // DESATIVAR CONTA E EXCLUIR PERMANENTEMENTE
    // (Também corrigido para usar BASE_URL)
    // ==========================================
    
    // Desativar
    const btnConfirmarDesativar = document.getElementById('btnConfirmarDesativar');
    btnConfirmarDesativar.addEventListener('click', async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/usuarios/${usuarioId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // ... (Restante da lógica)
            const modalEl = document.getElementById('modalDesativar');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            alert('Sua conta foi desativada com sucesso. Você será redirecionado.');
            localStorage.clear();
            window.location.href = 'login.html';
        } catch (error) { showToast('Erro ao conectar com o servidor.', 'error'); }
    });

    // Excluir Permanentemente
    const inputConfirmacaoDelete = document.getElementById('inputConfirmacaoDelete');
    const btnConfirmarExcluir = document.getElementById('btnConfirmarExcluir');
    const erroExclusao = document.getElementById('erroExclusao');

    inputConfirmacaoDelete.addEventListener('input', (e) => {
        if (e.target.value === 'DELETAR') { btnConfirmarExcluir.removeAttribute('disabled'); } 
        else { btnConfirmarExcluir.setAttribute('disabled', 'true'); }
    });

    btnConfirmarExcluir.addEventListener('click', async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/usuarios/${usuarioId}/permanente`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // ... (Restante da lógica)
            const modalEl = document.getElementById('modalExcluir');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            alert('Sua conta foi excluída permanentemente. Sentiremos sua falta!');
            localStorage.clear();
            window.location.href = 'index.html'; 
        } catch (error) { 
            erroExclusao.textContent = 'Erro de conexão.';
            erroExclusao.classList.remove('d-none');
        }
    });
});