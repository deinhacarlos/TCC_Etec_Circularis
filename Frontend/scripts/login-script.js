// ==================== IMPORTS ====================
import { apiPostPublic, saveToken } from '../src/Api.js';

// ==================== ELEMENTOS DO DOM ====================
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const togglePasswordBtn = document.getElementById('togglePassword');
const submitBtn = loginForm ? loginForm.querySelector('button[type="submit"]') : null;

// ==================== FUNÇÕES DE UTILIDADE ====================
function showError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    input.focus();
}
function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}
function setSubmitButtonState(disabled, text) {
    if (submitBtn) {
        submitBtn.disabled = disabled;
        submitBtn.textContent = text;
    }
}

// ==================== VALIDAÇÃO DE CAMPOS ====================
function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === '') {
        showError(emailInput, emailError, 'Por favor, insira seu e-mail.');
        return false;
    }
    if (!emailRegex.test(email)) {
        showError(emailInput, emailError, 'Por favor, insira um e-mail válido.');
        return false;
    }
    showSuccess(emailInput, emailError);
    return true;
}
function validatePassword() {
    const password = passwordInput.value;
    if (password === '') {
        showError(passwordInput, passwordError, 'Por favor, insira sua senha.');
        return false;
    }
    showSuccess(passwordInput, passwordError);
    return true;
}

// ==================== EVENTOS DE VALIDAÇÃO ====================
if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() !== '') {
            validateEmail();
        } else {
            showSuccess(emailInput, emailError);
        }
    });
}
if (passwordInput) {
    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length > 0) {
            showSuccess(passwordInput, passwordError);
        }
    });
}
if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        const icon = togglePasswordBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('bi-eye');
            icon.classList.toggle('bi-eye-slash');
        }
    });
}

// ==================== SUBMISSÃO DO FORMULÁRIO ====================
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            const loginData = {
                Email: emailInput.value.trim(),
                Senha: passwordInput.value
            };
            setSubmitButtonState(true, 'Entrando...');
            try {
                const response = await apiPostPublic('/usuarios/login', loginData);
                if (response.token) {
                    saveToken(response.token);
                    // Salve SEMPRE como 'usuarioId', usando o campo exato do backend:
                    if (response.userId) {
                        localStorage.setItem('usuarioId', response.userId);
                    }
                    setTimeout(() => {
                        window.location.href = 'busca.html';
                    }, 500);
                } else if (response.erro || response.error || response.message) {
                    const errorMsg = (response.erro || response.error || response.message || "").toLowerCase();
                    if (
                        errorMsg.includes('senha') ||
                        errorMsg.includes('credenciais') ||
                        errorMsg.includes('inválid')
                    ) {
                        showError(passwordInput, passwordError, 'E-mail ou senha incorretos.');
                    } else if (
                        errorMsg.includes('usuário') ||
                        errorMsg.includes('e-mail') ||
                        errorMsg.includes('não encontrado')
                    ) {
                        showError(emailInput, emailError, errorMsg);
                    } else {
                        showError(passwordInput, passwordError, errorMsg || 'Erro ao fazer login.');
                    }
                    setSubmitButtonState(false, 'Entrar');
                } else {
                    showError(passwordInput, passwordError, 'Resposta inesperada do servidor.');
                    setSubmitButtonState(false, 'Entrar');
                }
            } catch (error) {
                showError(passwordInput, passwordError, 'Erro ao conectar com o servidor. Verifique sua conexão.');
                setSubmitButtonState(false, 'Entrar');
            }
        } else {
            const firstError = document.querySelector('.form-control.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
}

// ==================== VERIFICAÇÃO DE SESSÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('login.html')) return;
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');
    if (!token || !usuarioId) {
        localStorage.clear();
        window.location.href = 'login.html';
        return;
    }
});
