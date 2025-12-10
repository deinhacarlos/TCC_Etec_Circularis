// ==================== UTILS.JS ====================

// --- TOAST ---
window.showToast = function(message, type = 'success') {
    let container = document.querySelector('.toast-container-global');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container-global';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    
    let iconClass = 'bi-info-circle-fill';
    let titleText = 'Informação';

    if (type === 'success') { iconClass = 'bi-check-circle-fill'; titleText = 'Sucesso!'; }
    else if (type === 'error') { iconClass = 'bi-x-circle-fill'; titleText = 'Erro'; }
    else if (type === 'warning') { iconClass = 'bi-exclamation-triangle-fill'; titleText = 'Atenção'; }

    toast.innerHTML = `
        <i class="bi ${iconClass} toast-icon"></i>
        <div class="toast-content">
            <span class="toast-title">${titleText}</span>
            <p class="toast-msg">${message}</p>
        </div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
};

// --- CONFIRM MODAL ---
window.showConfirm = function(message, onYes) {
    const existing = document.getElementById('customConfirmOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'customConfirmOverlay';
    overlay.className = 'custom-confirm-overlay';
    
    overlay.innerHTML = `
        <div class="custom-confirm-box">
            <div class="confirm-icon"><i class="bi bi-question-circle-fill"></i></div>
            <h3 class="confirm-title">Confirmação</h3>
            <p class="confirm-desc">${message}</p>
            <div class="confirm-actions">
                <button class="btn-confirm-no" id="btnConfirmNo">Cancelar</button>
                <button class="btn-confirm-yes" id="btnConfirmYes">Sim, confirmar</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    const btnYes = document.getElementById('btnConfirmYes');
    const btnNo = document.getElementById('btnConfirmNo');

    function close() {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }

    btnYes.addEventListener('click', () => {
        close();
        if (onYes) onYes();
    });

    btnNo.addEventListener('click', () => {
        close();
        // Se a ação for cancelar no dropdown, precisamos recarregar a lista para voltar o valor visualmente
        // Mas como a função é genérica, quem chama deve tratar se necessário.
        // No caso do trocas-script, se o usuário fecha o modal sem clicar em Sim, o select já mudou visualmente.
        // Para ficar perfeito, recarregue a página ou a lista se cancelar:
        if(window.location.href.includes('trocas-pendentes')) {
             // Pequeno hack para resetar o select visualmente se cancelar
             setTimeout(() => {
                 if(typeof carregarTrocas === 'function') carregarTrocas();
             }, 300);
        }
    });
};