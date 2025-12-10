const BASE_URL = 'http://localhost:3000';
let allNotifications = [];
let currentFilter = 'todas';

const userId = localStorage.getItem('usuarioId');
const token = localStorage.getItem('token');

if (!userId || !token) window.location.href = 'login.html';

document.addEventListener('DOMContentLoaded', () => {
    carregarNotificacoes();
    document.getElementById('btnLogout')?.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
});

async function carregarNotificacoes() {
    try {
        const response = await fetch(`${BASE_URL}/api/notificacoes?usuario_id=${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Erro ao carregar');
        allNotifications = await response.json();
        renderizarLista();
        atualizarContadorSidebar();
    } catch (error) {
        console.error(error);
    }
}

function filtrar(tipo) {
    currentFilter = tipo;
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active', 'active-alert'));
    
    const map = { 'todas': 'filterAll', 'nao-lidas': 'filterUnread', 'alertas': 'filterAlerts' };
    const btn = document.getElementById(map[tipo]);
    if(btn) btn.classList.add(tipo === 'alertas' ? 'active-alert' : 'active');
    
    renderizarLista();
}

function renderizarLista() {
    const listContainer = document.getElementById('notificationsList');
    const emptyStateHTML = document.getElementById('emptyStateTemplate').innerHTML;

    let filtered = allNotifications;
    if (currentFilter === 'nao-lidas') filtered = allNotifications.filter(n => !n.Lida);
    else if (currentFilter === 'alertas') filtered = allNotifications.filter(n => n.Tipo_Notificacao === 'Alerta');

    if (filtered.length === 0) {
        listContainer.innerHTML = emptyStateHTML;
        return;
    }

    listContainer.innerHTML = filtered.map(notif => {
        const isAlert = notif.Tipo_Notificacao === 'Alerta';
        const date = new Date(notif.DataEnvio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' });
        
        return `
            <div class="card p-3 notification-card ${notif.Lida ? 'read' : 'unread'} ${isAlert ? 'type-alerta' : ''}" 
                 onclick="gerenciarCliqueNotificacao(event, ${notif.Id_Notificacao}, '${notif.Tipo_Notificacao}')">
                <div class="d-flex align-items-start">
                    <div class="notif-icon-box me-3"><i class="bi ${isAlert ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'}"></i></div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between">
                            <h6 class="mb-1 fw-bold">${notif.Titulo}</h6>
                            <small class="text-muted">${date}</small>
                        </div>
                        <p class="mb-1 text-secondary small">${notif.Mensagem}</p>
                        <div class="mt-2 notif-actions">
                            ${!notif.Lida ? `<button onclick="event.stopPropagation(); marcarComoLida(${notif.Id_Notificacao})" class="btn-action"><i class="bi bi-check2"></i> Lida</button>` : ''}
                            <button onclick="event.stopPropagation(); excluirNotificacao(${notif.Id_Notificacao})" class="btn-action delete"><i class="bi bi-trash"></i> Excluir</button>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');
}

async function gerenciarCliqueNotificacao(event, id, tipo) {
    if (event.target.closest('button')) return;
    const notif = allNotifications.find(n => n.Id_Notificacao === id);
    if (notif && !notif.Lida) await marcarComoLida(id, false);
    
    if (tipo === 'Mensagem') window.location.href = 'chat.html';
    if (['Troca', 'SolicitacaoTroca'].includes(tipo)) window.location.href = 'trocas-pendentes.html';
}

async function marcarComoLida(id, render = true) {
    try {
        await fetch(`${BASE_URL}/api/notificacoes/${id}/lida`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
        const n = allNotifications.find(x => x.Id_Notificacao === id);
        if(n) n.Lida = 1;
        if(render) { renderizarLista(); atualizarContadorSidebar(); }
    } catch(e) { console.error(e); }
}

async function marcarTodasLidas() {
    try {
        await fetch(`${BASE_URL}/api/notificacoes/usuario/${userId}/marcar-todas-lidas`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
        allNotifications.forEach(n => n.Lida = 1);
        renderizarLista();
        atualizarContadorSidebar();
        showToast('Todas marcadas como lidas!', 'success');
    } catch(e) { showToast('Erro ao atualizar.', 'error'); }
}

// --- FUNÇÃO PARA EXCLUIR UMA ---
async function excluirNotificacao(id) {
    showConfirm('Excluir esta notificação?', async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/notificacoes/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if(!res.ok) throw new Error();
            allNotifications = allNotifications.filter(n => n.Id_Notificacao !== id);
            renderizarLista();
            atualizarContadorSidebar();
            showToast('Notificação excluída.', 'success');
        } catch(e) { showToast('Erro ao excluir.', 'error'); }
    });
}

// --- FUNÇÃO PARA EXCLUIR TODAS (NOVA) ---
async function excluirTodasNotificacoes() {
    if(allNotifications.length === 0) {
        showToast('Não há notificações para excluir.', 'warning');
        return;
    }
    
    showConfirm('Tem certeza que deseja excluir TODAS as notificações? Isso não pode ser desfeito.', async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/notificacoes/usuario/${userId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if(!res.ok) throw new Error();
            
            allNotifications = []; // Limpa array local
            renderizarLista();
            atualizarContadorSidebar();
            showToast('Todas as notificações foram excluídas!', 'success');
        } catch(e) { showToast('Erro ao excluir todas.', 'error'); }
    });
}

function atualizarContadorSidebar() {
    const count = allNotifications.filter(n => !n.Lida).length;
    const badge = document.getElementById('sidebarCount');
    if(badge) { badge.textContent = count; badge.style.display = count > 0 ? 'inline-block' : 'none'; }
}