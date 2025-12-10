// ARQUIVO: scripts/recuperar-senha.js
import { apiPostPublic } from '../src/Api.js';

const form = document.getElementById('formRecuperacao');
const btn = document.getElementById('btnEnviar');
const emailInput = document.getElementById('email');
const feedback = document.getElementById('emailFeedback');

document.addEventListener('DOMContentLoaded', () => {
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();

            // Validação visual
            if (!email || !email.includes('@')) {
                emailInput.classList.add('error'); // Borda vermelha
                feedback.classList.add('show');    // Texto de erro
                return;
            }

            // Remove erros anteriores
            emailInput.classList.remove('error');
            feedback.classList.remove('show');

            // Estado de carregamento
            const textoOriginal = btn.textContent;
            btn.disabled = true;
            btn.textContent = "Enviando...";

            try {
                // Chama a API do backend
                await apiPostPublic('/usuarios/esqueci-senha', { email: email });
                
                // Exibe o Toast Verde (função do utils.js)
                showToast('Link enviado! Verifique seu e-mail e spam.', 'success');
                form.reset();

            } catch (error) {
                console.error(error);
                let msg = error.message || 'Erro ao conectar ao servidor.';
                
                // Exibe o Toast Vermelho
                showToast(msg, 'error');
            } finally {
                // Restaura o botão
                btn.disabled = false;
                btn.textContent = textoOriginal;
            }
        });

        // Limpa o erro enquanto digita
        emailInput.addEventListener('input', () => {
            emailInput.classList.remove('error');
            feedback.classList.remove('show');
        });
    }
});