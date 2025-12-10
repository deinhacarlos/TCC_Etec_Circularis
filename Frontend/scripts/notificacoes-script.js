const BASE_URL = 'http://localhost:3000';
let allNotifications = [];
let currentFilter = 'todas';

// Verifica autenticação
const userId = localStorage.getItem('usuarioId');
const token = localStorage.getItem('token');

if (!userId || !token) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    carregarNotificacoes();
    
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
});

async function carregarNotificacoes() {
    const listContainer = document.getElementById('notificationsList');
    
    try {
        const response = await fetch(`${BASE_URL}/api/notificacoes?usuario_id=${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Erro ao carregar notificações');

        allNotifications = await response.json();
        renderizarLista();
        atualizarContadorSidebar();

    } catch (error) {
        console.error(error);
        if(listContainer) {
            listContainer.innerHTML = `<div class="alert alert-danger">Erro ao carregar notificações.</div>`;
        }
    }
}

function filtrar(tipo) {
    currentFilter = tipo;
    
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active', 'active-alert');
    });

    const activeBtn = tipo === 'todas' ? document.getElementById('filterAll') :
                      tipo === 'nao-lidas' ? document.getElementById('filterUnread') :
                      document.getElementById('filterAlerts');
    
    if (activeBtn) {
        if (tipo === 'alertas') {
            activeBtn.classList.add('active-alert');
        } else {
            activeBtn.classList.add('active');
        }
    }

    renderizarLista();
}

function renderizarLista() {
    const listContainer = document.getElementById('notificationsList');
    const emptyStateElement = document.getElementById('emptyStateTemplate');
    
    if (!listContainer || !emptyStateElement) return;

    const emptyState = emptyStateElement.innerHTML;

    let filtered = allNotifications;
    if (currentFilter === 'nao-lidas') {
        filtered = allNotifications.filter(n => !n.Lida);
    } else if (currentFilter === 'alertas') {
        filtered = allNotifications.filter(n => n.Tipo_Notificacao === 'Alerta');
    }

    if (filtered.length === 0) {
        listContainer.innerHTML = emptyState;
        return;
    }

    listContainer.innerHTML = filtered.map(notif => {
        const isAlert = notif.Tipo_Notificacao === 'Alerta';
        const iconClass = isAlert ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';
        const cardClass = isAlert ? 'type-alerta' : '';
        const readClass = notif.Lida ? 'read' : 'unread';
        const date = new Date(notif.DataEnvio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute:'2-digit' });

        return `
            <div class="card p-3 notification-card ${readClass} ${cardClass}" 
                 id="notif-${notif.Id_Notificacao}"
                 onclick="gerenciarCliqueNotificacao(event, ${notif.Id_Notificacao}, '${notif.Tipo_Notificacao}')">
                 
                <div class="d-flex align-items-start">
                    <div class="notif-icon-box me-3">
                        <i class="bi ${iconClass}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start">
                            <h6 class="mb-1 fw-bold notification-title">${notif.Titulo}</h6>
                            <small class="text-muted ms-2">${date}</small>
                        </div>
                        <p class="mb-1 text-secondary small">${notif.Mensagem}</p>
                        
                        <div class="mt-2 notif-actions">
                            ${!notif.Lida ? `
                                <button onclick="event.stopPropagation(); marcarComoLida(${notif.Id_Notificacao})" 
                                        class="btn-action">
                                    <i class="bi bi-check2"></i> Marcar como lida
                                </button>
                            ` : '<span class="text-muted small me-3"><i class="bi bi-check2-all"></i> Lida</span>'}
                            
                            <button onclick="event.stopPropagation(); excluirNotificacao(${notif.Id_Notificacao})" 
                                    class="btn-action delete">
                                <i class="bi bi-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function gerenciarCliqueNotificacao(event, id, tipo) {
    if (event.target.closest('button') || event.target.closest('a')) {
        return;
    }

    try {
        const notif = allNotifications.find(n => n.Id_Notificacao === id);
        if (notif && !notif.Lida) {
            await marcarComoLida(id, false); 
        }
    } catch (e) {
        console.error("Erro silencioso ao marcar lida:", e);
    }

    console.log("Tipo da notificação:", tipo);
    
    if (tipo === 'Mensagem' || tipo === 'Chat') {
        window.location.href = 'chat.html';
    } 
    else if (tipo === 'Troca' || tipo === 'SolicitacaoTroca' || tipo === 'StatusTroca') {
        window.location.href = 'trocas-pendentes.html';
    } 
    else if (tipo === 'Sistema' || tipo === 'Alerta') {
        // Apenas visualiza, não faz nada
    }
}

async function marcarComoLida(id, renderizar = true) {
    try {
        await fetch(`${BASE_URL}/api/notificacoes/${id}/lida`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const notif = allNotifications.find(n => n.Id_Notificacao === id);
        if (notif) notif.Lida = 1;
        
        if (renderizar) {
            renderizarLista();
            atualizarContadorSidebar();
        }
        
    } catch (error) {
        console.error('Erro ao marcar como lida', error);
    }
}

async function marcarTodasLidas() {
    try {
        await fetch(`${BASE_URL}/api/notificacoes/usuario/${userId}/marcar-todas-lidas`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        allNotifications.forEach(n => n.Lida = 1);
        renderizarLista();
        atualizarContadorSidebar();
        
        // SUBSTITUIÇÃO: alert -> showToast
        showToast('Todas as notificações foram lidas.', 'success');
        
    } catch (error) {
        console.error('Erro ao marcar todas', error);
        showToast('Erro ao atualizar notificações.', 'error');
    }
}

async function excluirNotificacao(id) {
    // SUBSTITUIÇÃO: confirm -> showConfirm
    showConfirm('Tem certeza que deseja excluir esta notificação?', async () => {
        try {
            await fetch(`${BASE_URL}/api/notificacoes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            allNotifications = allNotifications.filter(n => n.Id_Notificacao !== id);
            renderizarLista();
            atualizarContadorSidebar();
            
            showToast('Notificação excluída.', 'success');
            
        } catch (error) {
            console.error('Erro ao excluir', error);
            showToast('Erro ao excluir.', 'error');
        }
    });
}

function atualizarContadorSidebar() {
    const count = allNotifications.filter(n => !n.Lida).length;
    const badge = document.getElementById('sidebarCount');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
    const headerBadge = document.getElementById('notificationBadge');
    if (headerBadge) {
        headerBadge.textContent = count;
        headerBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}