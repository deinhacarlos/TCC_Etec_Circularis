document.addEventListener('DOMContentLoaded', () => {
    // Recupera o email salvo no cadastro
    const email = localStorage.getItem('emailCadastro');
    
    // Elemento onde o email será exibido (procurei no seu HTML, é o strong dentro de .form-subtitle)
    const emailDisplay = document.querySelector('.form-subtitle strong');
    
    if (email && emailDisplay) {
        emailDisplay.textContent = email;
    }

    // Lógica do botão Reenviar (Opcional, caso implemente no backend depois)
    const btnReenviar = document.getElementById('reenviarEmailBtn');
    if (btnReenviar) {
        btnReenviar.addEventListener('click', () => {
            showToast('Se você não recebeu o e-mail em alguns minutos, verifique sua caixa de Spam ou tente se cadastrar novamente.');
        });
    }
});