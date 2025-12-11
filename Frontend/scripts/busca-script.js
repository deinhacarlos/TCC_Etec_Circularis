// ==================== CONFIGURAÇÃO ====================
const BASE_URL = 'http://localhost:3000';

// ==================== VARIÁVEIS DO DOM ====================
const searchInput = document.getElementById('searchInput');
const locationSelect = document.getElementById('locationSelect');
const booksGrid = document.getElementById('booksGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const noRegionState = document.getElementById('noRegionState');
const badge = document.getElementById('notificationBadge');

// ==================== ESTADO ====================
let materiaisData = [];
let isInitialLoad = true;
let lastNotifCount = 0;

// ==================== UTILS ====================
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// ==================== LÓGICA DO SINO (NOTIFICAÇÕES) ====================
function iniciarSistemaNotificacoes() {
    const userId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem('token');

    if (!userId || !token) return;

    const checarNotificacoes = async () => {
        try {
            // Usa Date.now() para o navegador não usar cache
            const response = await fetch(`${BASE_URL}/api/notificacoes?usuario_id=${userId}&_=${Date.now()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const lista = await response.json();
                // Conta apenas as NÃO lidas
                const naoLidas = Array.isArray(lista) ? lista.filter(n => !n.Lida).length : 0;

                if (badge) {
                    if (naoLidas > 0) {
                        badge.textContent = naoLidas;
                        badge.style.display = 'flex';
                        
                        // Efeito visual se aumentou o número
                        if (naoLidas > lastNotifCount && !isInitialLoad) {
                            badge.classList.remove('pulse-animation');
                            void badge.offsetWidth; // Força reinício da animação
                            badge.classList.add('pulse-animation');
                            
                            if(window.showToast) showToast(`Você tem ${naoLidas} novas notificações!`, 'success');
                        }
                    } else {
                        badge.style.display = 'none';
                    }
                }
                lastNotifCount = naoLidas;
            }
        } catch (error) {
            console.warn("Erro ao buscar notificações (polling):", error);
        }
    };

    // Executa agora e depois a cada 3 segundos
    checarNotificacoes();
    setInterval(checarNotificacoes, 3000);
}

// ==================== LÓGICA DE BUSCA ====================
async function fetchAllMateriais() {
    if (isInitialLoad && loadingState) loadingState.style.display = 'block';
    try {
        const response = await fetch(`${BASE_URL}/api/materiais?disponibilidade=true`);
        if (!response.ok) throw new Error('Erro API');
        const data = await response.json();
        materiaisData = Array.isArray(data) ? data : [];
        filtrarMateriais();
    } catch (error) {
        console.error(error);
        if(booksGrid) booksGrid.innerHTML = '<div class="col-12 text-center text-danger">Erro ao carregar livros.</div>';
        hideAllStates();
    } finally {
        isInitialLoad = false;
    }
}

function filtrarMateriais() {
    if(!booksGrid) return;
    const term = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const loc = locationSelect ? locationSelect.value : '';

    const filtered = materiaisData.filter(m => {
        const title = (m.Titulo || '').toLowerCase();
        const author = (m.Autor || '').toLowerCase();
        const local = m.Localizacao || '';
        const matchText = title.includes(term) || author.includes(term);
        const matchLoc = loc === '' || local.includes(loc);
        return matchText && matchLoc;
    });

    renderizarMateriais(filtered);
}

function renderizarMateriais(lista) {
    if(!booksGrid) return;
    booksGrid.innerHTML = '';
    hideAllStates();

    if (lista.length === 0) {
        if(locationSelect && locationSelect.value !== '') {
            if(noRegionState) noRegionState.style.display = 'block';
        } else {
            if(emptyState) emptyState.style.display = 'block';
        }
        return;
    }

    const myId = localStorage.getItem('usuarioId');
    const stateNames = { 'SP': 'São Paulo', 'RJ': 'Rio de Janeiro', 'MG': 'Minas Gerais', 'BA': 'Bahia' }; 

    lista.forEach(book => {
        const imgUrl = book.Imagem ? `${BASE_URL}/uploads/${book.Imagem}` : 'assets/logo.png';
        const isDono = (String(book.Id_Usuario_FK) === String(myId));
        const localNome = stateNames[book.Localizacao] || book.Localizacao || 'Brasil';

        const btnHtml = isDono 
            ? `<button class="btn w-100" disabled style="background:#eee;color:#999;border:1px solid #ddd;">Seu Material</button>`
            : `<a href="chat.html?book=${book.Id_Material}" class="btn-propor-troca text-center text-decoration-none d-block">Propor Troca</a>`;

        booksGrid.insertAdjacentHTML('beforeend', `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="book-card h-100 d-flex flex-column">
                    <div style="position:relative;">
                        <img src="${imgUrl}" class="book-image" onerror="this.src='assets/logo.png'">
                        ${!isDono ? `<div class="dropdown" style="position:absolute;top:10px;right:10px;">
                            <button class="book-menu" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button>
                            <ul class="dropdown-menu"><li><a class="dropdown-item" href="#" onclick="reportBook(${book.Id_Material})"><i class="bi bi-flag"></i> Denunciar</a></li></ul>
                        </div>` : ''}
                    </div>
                    <div class="book-info d-flex flex-column flex-grow-1">
                        <h5 class="book-title mb-1">${book.Titulo}</h5>
                        <p class="book-author mb-2">${book.Autor || ''}</p>
                        <p class="book-location mb-3"><i class="bi bi-geo-alt"></i> ${localNome}</p>
                        <div class="mt-auto">${btnHtml}</div>
                    </div>
                </div>
            </div>
        `);
    });
}

function hideAllStates() {
    if(loadingState) loadingState.style.display = 'none';
    if(emptyState) emptyState.style.display = 'none';
    if(noRegionState) noRegionState.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    loadingState.style.display = 'none';
    fetchAllMateriais();
    iniciarSistemaNotificacoes(); // Inicia o sino
    
    if(searchInput) searchInput.addEventListener('input', debounce(filtrarMateriais, 300));
    if(locationSelect) locationSelect.addEventListener('change', filtrarMateriais);
});

window.reportBook = function(id) {
    if(window.abrirModalDenuncia) window.abrirModalDenuncia(id);
    else alert("Denúncia indisponível.");
};