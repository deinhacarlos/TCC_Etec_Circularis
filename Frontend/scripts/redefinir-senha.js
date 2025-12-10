// ARQUIVO: scripts/redefinir-senha.js
import { apiPostPublic } from '../src/Api.js';

// Pega o token da URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

const container = document.getElementById('containerPrincipal');
const form = document.getElementById('formRedefinir');
const btn = document.getElementById('btnSalvar');
const passwordInput = document.getElementById('novaSenha');
const toggleBtn = document.getElementById('togglePassword');

// 1. Verifica se o link é válido (tem token)
if (!token) {
    // Se não tiver token, mostra mensagem de erro dentro do card
    container.innerHTML = `
        <a href="index.html"><img src="assets/logo.png" alt="Logo" class="logo-img"></a>
        <h3 class="form-title" style="color: #FF4757;">Link Inválido</h3>
        <p class="form-subtitle">O link expirou ou está quebrado.</p>
        <a href="recuperar-senha.html" class="btn-login-full text-decoration-none" style="display:block; color:white;">Solicitar Novo Link</a>
    `;
}

// 2. Lógica do Olhinho (Mostrar/Esconder Senha)
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = toggleBtn.querySelector('i');
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
    });
}

// 3. Envio do Formulário
if (form && token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const novaSenha = passwordInput.value.trim();

        // --- VALIDAÇÃO DE 8 CARACTERES ---
        if (novaSenha.length < 8) {
            passwordInput.classList.add('error'); // Borda vermelha
            
            // Chama o Toast Colorido (Função do utils.js)
            showToast("A senha deve ter no mínimo 8 caracteres.", "error");
            return;
        }

        // Se passou na validação, limpa erro e envia
        passwordInput.classList.remove('error');
        btn.disabled = true;
        btn.textContent = "Salvando...";

        try {
            await apiPostPublic(`/usuarios/redefinir-senha/${token}`, { novaSenha });
            
            showToast('Senha alterada com sucesso! Redirecionando...', 'success');
            
            // Redireciona para o login após 2.5 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2500);

        } catch (error) {
            let texto = error.message || 'Erro desconhecido';
            
            if (texto.includes('expirado') || texto.includes('inválido')) {
                texto = 'Este link expirou. Por favor, solicite um novo.';
            }
            
            showToast(texto, 'error');
            
            btn.disabled = false;
            btn.textContent = "Alterar Senha";
        }
    });

    // Remove a borda vermelha assim que o usuário começa a digitar
    passwordInput.addEventListener('input', () => {
        passwordInput.classList.remove('error');
    });
}