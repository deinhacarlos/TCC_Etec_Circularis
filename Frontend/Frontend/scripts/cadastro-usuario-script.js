// ==================== CONFIGURAÇÃO ====================
const API_BASE_URL = 'http://localhost:3000';

// ==================== ELEMENTOS DO DOM ====================
const registerForm = document.getElementById('registerForm');
// ... (demais elementos permanecem iguais)
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');

const termsModal = document.getElementById('termsModal');
const privacyModal = document.getElementById('privacyModal');
const openTermsBtn = document.getElementById('openTerms');
const openPrivacyBtn = document.getElementById('openPrivacy');
const closeTermsBtn = document.getElementById('closeTerms');
const closePrivacyBtn = document.getElementById('closePrivacy');

// ==================== FUNÇÕES DE VALIDAÇÃO VISUAL ====================
function showError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

// ==================== VALIDAÇÕES LÓGICAS (IGUAIS) ====================
function validateName() {
    const name = fullNameInput.value.trim();
    if (name === '') { showError(fullNameInput, nameError, 'Por favor, insira seu nome completo'); return false; }
    if (name.length < 3) { showError(fullNameInput, nameError, 'Nome deve ter pelo menos 3 caracteres'); return false; }
    if (!name.includes(' ')) { showError(fullNameInput, nameError, 'Por favor, insira nome e sobrenome'); return false; }
    showSuccess(fullNameInput, nameError); return true;
}

function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') { showError(emailInput, emailError, 'Por favor, insira seu e-mail'); return false; }
    if (!emailRegex.test(email)) { showError(emailInput, emailError, 'Por favor, insira um e-mail válido'); return false; }
    showSuccess(emailInput, emailError); return true;
}

function validatePassword() {
    const password = passwordInput.value;
    if (password === '') { showError(passwordInput, passwordError, 'Por favor, crie uma senha'); return false; }
    if (password.length < 6) { showError(passwordInput, passwordError, 'Senha deve ter pelo menos 6 caracteres'); return false; }
    showSuccess(passwordInput, passwordError); return true;
}

function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    if (confirmPassword === '') { showError(confirmPasswordInput, confirmPasswordError, 'Por favor, confirme sua senha'); return false; }
    if (password !== confirmPassword) { showError(confirmPasswordInput, confirmPasswordError, 'As senhas não coincidem'); return false; }
    showSuccess(confirmPasswordInput, confirmPasswordError); return true;
}

// Event Listeners Inputs
fullNameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);
confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

// Toggle Senha
if(togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordBtn.querySelector('i').classList.toggle('bi-eye');
        togglePasswordBtn.querySelector('i').classList.toggle('bi-eye-slash');
    });
}
if(toggleConfirmPasswordBtn) {
    toggleConfirmPasswordBtn.addEventListener('click', () => {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        toggleConfirmPasswordBtn.querySelector('i').classList.toggle('bi-eye');
        toggleConfirmPasswordBtn.querySelector('i').classList.toggle('bi-eye-slash');
    });
}

// ==================== SUBMIT DO FORMULÁRIO ====================
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    
    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
        
        const btnSubmit = registerForm.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerText;
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Cadastrando...";

        const formData = new FormData();
        formData.append('Nome', fullNameInput.value.trim());
        formData.append('Email', emailInput.value.trim());
        formData.append('Senha', passwordInput.value);

        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/cadastro`, {
                method: 'POST',
                body: formData 
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('emailCadastro', emailInput.value.trim());
                window.location.href = 'verificacao-email.html';
            } else {
                // SUBSTITUIÇÃO: alert -> showToast
                showToast(data.message || 'Erro ao realizar cadastro.', 'error');
                btnSubmit.disabled = false;
                btnSubmit.innerText = textoOriginal;
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            // SUBSTITUIÇÃO: alert -> showToast
            showToast("Erro de conexão. Verifique o servidor.", "error");
            btnSubmit.disabled = false;
            btnSubmit.innerText = textoOriginal;
        }
    }
});

// ==================== MODAIS ====================
openTermsBtn.addEventListener('click', (e) => { e.preventDefault(); termsModal.classList.add('show'); });
closeTermsBtn.addEventListener('click', () => termsModal.classList.remove('show'));
openPrivacyBtn.addEventListener('click', (e) => { e.preventDefault(); privacyModal.classList.add('show'); });
closePrivacyBtn.addEventListener('click', () => privacyModal.classList.remove('show'));
window.addEventListener('click', (e) => {
    if (e.target === termsModal) termsModal.classList.remove('show');
    if (e.target === privacyModal) privacyModal.classList.remove('show');
});