document.addEventListener('DOMContentLoaded', () => {
    // Exibe o e-mail salvo no localStorage
    const emailSalvo = localStorage.getItem('emailCadastro');
    const emailDisplay = document.getElementById('emailDisplay');
    
    if (emailSalvo && emailDisplay) {
        emailDisplay.textContent = emailSalvo;
    }

    // Botão de Reenviar (apenas visual)
    const btnReenviar = document.getElementById('reenviarEmailBtn');
    if (btnReenviar) {
        btnReenviar.addEventListener('click', () => {
            if (window.showToast) {
                showToast('Verifique sua caixa de Spam ou tente se cadastrar novamente.', 'warning');
            } else {
                alert('Verifique sua caixa de Spam.');
            }
        });
    }
});