const BASE_URL = 'http://localhost:3000';
let allNotifications = [];
let currentFilter = 'todas';
let lastCount = 0; 
let isFirstLoad = true;

const userId = localStorage.getItem('usuarioId');
const token = localStorage.getItem('token');

if (!userId || !token) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    carregarNotificacoes();
    
    // Pooling de 3 segundos para buscar novas notificações
    setInterval(carregarNotificacoes, 3000);

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
        // Usa timestamp para evitar cache do navegador
        const response = await fetch(`${BASE_URL}/api/notificacoes?usuario_id=${userId}&_=${Date.now()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Erro ao carregar notificações');

        const novasNotificacoes = await response.json();
        const listaFinal = Array.isArray(novasNotificacoes) ? novasNotificacoes : [];
        
        const qtdNaoLidas = listaFinal.filter(n => !n.Lida).length;
        
        // Atualiza a tela apenas se houver mudanças nos dados ou for a primeira vez
        // Isso evita "piscar" a tela desnecessariamente
        if (isFirstLoad || JSON.stringify(listaFinal) !== JSON.stringify(allNotifications)) {
            allNotifications = listaFinal;
            lastCount = qtdNaoLidas;
            
            renderizarLista();
            atualizarContadorSidebar();
            
            isFirstLoad = false;
        }

    } catch (error) {
        console.error("Erro polling notificações:", error);
        if (isFirstLoad && listContainer) {
            listContainer.innerHTML = `<div class="text-center mt-5 text-danger">Erro de conexão com servidor.</div>`;
            isFirstLoad = false;
        }
    }
}

function filtrar(tipo) {
    currentFilter = tipo;
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active', 'active-alert'));
    
    if (tipo === 'todas') document.getElementById('filterAll')?.classList.add('active');
    else if (tipo === 'nao-lidas') document.getElementById('filterUnread')?.classList.add('active');
    else if (tipo === 'alertas') document.getElementById('filterAlerts')?.classList.add('active-alert');
    
    renderizarLista();
}

function renderizarLista() {
    const listContainer = document.getElementById('notificationsList');
    const emptyStateElement = document.getElementById('emptyStateTemplate');
    if (!listContainer) return;

    let filtered = allNotifications;
    if (currentFilter === 'nao-lidas') filtered = allNotifications.filter(n => !n.Lida);
    else if (currentFilter === 'alertas') filtered = allNotifications.filter(n => n.Tipo_Notificacao === 'Alerta');

    // Ordena da mais recente para a mais antiga
    filtered.sort((a, b) => new Date(b.DataEnvio) - new Date(a.DataEnvio));

    if (filtered.length === 0) {
        if (emptyStateElement) {
            listContainer.innerHTML = emptyStateElement.innerHTML;
        } else {
            listContainer.innerHTML = '<div class="text-center mt-5 text-muted">Nenhuma notificação encontrada.</div>';
        }
        return;
    }

    listContainer.innerHTML = filtered.map(notif => {
        const isAlert = notif.Tipo_Notificacao === 'Alerta';
        const iconClass = isAlert ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';
        const cardClass = isAlert ? 'type-alerta' : '';
        const readClass = notif.Lida ? 'read' : 'unread';
        const date = new Date(notif.DataEnvio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' });

        return `
            <div class="card p-3 notification-card ${readClass} ${cardClass}" 
                 onclick="gerenciarClique(event, ${notif.Id_Notificacao}, '${notif.Tipo_Notificacao}')">
                <div class="d-flex align-items-start w-100">
                    <div class="notif-icon-box me-3"><i class="bi ${iconClass}"></i></div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start">
                            <h6 class="mb-1 fw-bold notif-title">${notif.Titulo}</h6>
                            <small class="text-muted ms-2">${date}</small>
                        </div>
                        <p class="mb-1 small text-secondary">${notif.Mensagem}</p>
                        <div class="mt-2 notif-actions">
                            ${!notif.Lida ? `<button onclick="event.stopPropagation(); marcarComoLida(${notif.Id_Notificacao})" class="btn-action"><i class="bi bi-check2"></i> Marcar lida</button>` : ''}
                            <button onclick="event.stopPropagation(); excluirNotificacao(${notif.Id_Notificacao})" class="btn-action delete"><i class="bi bi-trash"></i> Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function gerenciarClique(event, id, tipo) {
    // Evita ação se clicou num botão dentro do card
    if (event.target.closest('button')) return;

    try {
        const notif = allNotifications.find(n => n.Id_Notificacao === id);
        if (notif && !notif.Lida) {
            await marcarComoLida(id, false); // Marca como lida no banco sem redesenhar tudo ainda
        }
    } catch (e) { console.error(e); }

    // Redirecionamento baseado no tipo
    if (tipo === 'Mensagem' || tipo === 'Chat') {
        window.location.href = 'chat.html';
    } else if (tipo === 'Troca' || tipo === 'SolicitacaoTroca') {
        window.location.href = 'trocas-pendentes.html';
    }
}

async function marcarComoLida(id, renderizar = true) {
    try {
        await fetch(`${BASE_URL}/api/notificacoes/${id}/lida`, { 
            method: 'PATCH', 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        
        // Atualiza estado local
        const notif = allNotifications.find(n => n.Id_Notificacao === id);
        if (notif) notif.Lida = 1;
        
        if (renderizar) { 
            renderizarLista(); 
            atualizarContadorSidebar(); 
        }
    } catch (error) { console.error(error); }
}

async function marcarTodasLidas() {
    if (allNotifications.length === 0) return;
    try {
        await fetch(`${BASE_URL}/api/notificacoes/usuario/${userId}/marcar-todas-lidas`, { 
            method: 'PATCH', 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        allNotifications.forEach(n => n.Lida = 1);
        renderizarLista();
        atualizarContadorSidebar();
        if(window.showToast) showToast('Todas marcadas como lidas.', 'success');
    } catch (error) { console.error(error); }
}

async function excluirNotificacao(id) {
    if (window.showConfirm) {
        showConfirm("Excluir esta notificação?", async () => await executarExclusaoUnica(id));
    } else if(confirm("Excluir?")) {
        await executarExclusaoUnica(id);
    }
}

async function executarExclusaoUnica(id) {
    try {
        await fetch(`${BASE_URL}/api/notificacoes/${id}`, { 
            method: 'DELETE', 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        allNotifications = allNotifications.filter(n => n.Id_Notificacao !== id);
        renderizarLista();
        atualizarContadorSidebar();
        if(window.showToast) showToast('Excluída.', 'success');
    } catch (error) { console.error(error); }
}

async function excluirTodasNotificacoes() {
    if (allNotifications.length === 0) return;
    if (window.showConfirm) {
        showConfirm("Excluir TODAS as notificações?", async () => await executarExclusaoTodas());
    } else if(confirm("Excluir TODAS?")) {
        await executarExclusaoTodas();
    }
}

async function executarExclusaoTodas() {
    try {
        const response = await fetch(`${BASE_URL}/api/notificacoes/usuario/${userId}`, { 
            method: 'DELETE', 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (response.ok) {
            allNotifications = [];
            renderizarLista();
            atualizarContadorSidebar();
            if(window.showToast) showToast('Todas excluídas.', 'success');
        }
    } catch (error) { console.error(error); }
}

function atualizarContadorSidebar() {
    const count = allNotifications.filter(n => !n.Lida).length;
    
    const badgeSidebar = document.getElementById('sidebarCount');
    if (badgeSidebar) { 
        badgeSidebar.textContent = count; 
        badgeSidebar.style.display = count > 0 ? 'inline-block' : 'none'; 
    }
    
    const badgeHeader = document.getElementById('notificationBadge'); 
    if (badgeHeader) { 
        badgeHeader.textContent = count; 
        badgeHeader.style.display = count > 0 ? 'inline-block' : 'none'; 
    }
}