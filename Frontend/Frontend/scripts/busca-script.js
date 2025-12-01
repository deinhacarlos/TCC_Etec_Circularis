// ==================== CONFIGURAÇÃO ====================
const BASE_URL = 'http://localhost:3000'; 

// ==================== VARIÁVEIS DO DOM ====================
const searchInput = document.getElementById('searchInput');
const locationSelect = document.getElementById('locationSelect'); 
const booksGrid = document.getElementById('booksGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const noRegionState = document.getElementById('noRegionState');
const loadMoreBtn = document.getElementById('loadMoreBtn'); 

// ==================== ESTADO ====================
let materiaisData = []; 
let filteredMateriais = []; 
let isInitialLoad = true;

// ==================== UTILS ====================
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// ==================== NOTIFICAÇÕES (NOVO CÓDIGO) ====================
async function atualizarBadgeNotificacoes() {
    const userId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem('token');
    const badge = document.getElementById('notificationBadge');

    // Se não tiver usuário ou badge na tela, sai
    if (!userId || !token || !badge) return;

    try {
        const response = await fetch(`${BASE_URL}/api/notificacoes?usuario_id=${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const lista = await response.json();
            // Conta quantas não estão lidas (Lida = 0 ou false)
            const naoLidas = lista.filter(n => !n.Lida).length;
            
            if (naoLidas > 0) {
                badge.textContent = naoLidas;
                badge.style.display = 'flex'; // Mostra a bolinha
            } else {
                badge.style.display = 'none'; // Esconde se for 0
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar badge:", error);
    }
}

// ==================== RENDERIZAÇÃO DE LIVROS ====================
function renderizarMateriais(lista) {
    booksGrid.innerHTML = '';
    
    const usuarioLogadoId = localStorage.getItem('usuarioId');

    const stateNames = {
        'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia', 
        'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás', 
        'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais', 
        'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco', 'PI': 'Piauí', 
        'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul', 
        'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo', 
        'SE': 'Sergipe', 'TO': 'Tocantins'
    };

    lista.forEach(book => {
        const imgUrl = book.Imagem ? `${BASE_URL}/uploads/${book.Imagem}` : `${BASE_URL}/imagens/padrao.png`;
        
        let locationDisplay = book.Localizacao || 'Não Informada';
        locationDisplay = locationDisplay.trim();
        if (stateNames[locationDisplay]) locationDisplay = stateNames[locationDisplay];

        // Verifica dono
        const isDono = (String(book.Id_Usuario_FK) === String(usuarioLogadoId));

        let actionButton = '';

        if (isDono) {
            actionButton = `
                <button class="btn w-100" disabled style="background-color: #e9ecef; color: #6c757d; border: 1px solid #ced4da; cursor: not-allowed; font-weight: 600;">
                    <i class="bi bi-person-circle me-1"></i> Seu Material
                </button>
            `;
        } else {
            actionButton = `
                <a href="chat.html?book=${book.Id_Material}" class="btn-propor-troca text-center text-decoration-none d-block">
                    Propor Troca
                </a>
            `;
        }

        const cardHtml = `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="book-card h-100 d-flex flex-column">
                    <div style="position: relative;">
                        <img src="${imgUrl}" alt="${book.Titulo}" class="book-image" onerror="this.src='assets/logo.png'">
                        
                        ${!isDono ? `
                        <div class="dropdown" style="position: absolute; top: 10px; right: 10px;">
                            <button class="book-menu" data-bs-toggle="dropdown">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="reportBook(${book.Id_Material}); return false;"><i class="bi bi-flag"></i> Denunciar</a></li>
                            </ul>
                        </div>` : ''}
                    </div>

                    <div class="book-info d-flex flex-column flex-grow-1">
                        <h5 class="book-title mb-1">${book.Titulo || 'Sem Título'}</h5>
                        <p class="book-author mb-2">${book.Autor ? 'Autor: ' + book.Autor : ''}</p>
                        <p class="book-location mb-3"><i class="bi bi-geo-alt"></i> ${locationDisplay}</p>
                        
                        <div class="mt-auto">
                            ${actionButton}
                        </div>
                    </div>
                </div>
            </div>
        `;
        booksGrid.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// ==================== RESTO DAS FUNÇÕES (IGUAL ANTES) ====================
function hideAllStates() {
    loadingState.style.display = 'none';
    emptyState.style.display = 'none';
    noRegionState.style.display = 'none';
}
function showLoading() {
    hideAllStates();
    booksGrid.innerHTML = '';
    loadingState.style.display = 'block';
}
function showEmptyState(isLocationFilter = false) {
    booksGrid.innerHTML = '';
    hideAllStates();
    if (isLocationFilter) noRegionState.style.display = 'block';
    else emptyState.style.display = 'block';
}

async function fetchAllMateriais() {
    if (!isInitialLoad) showLoading();
    try {
        // CORREÇÃO: Adicionado ?disponibilidade=true para esconder livros já trocados
        const response = await fetch(`${BASE_URL}/api/materiais?disponibilidade=true`);
        
        if (!response.ok) throw new Error('Erro API');
        const data = await response.json();
        
        // Verifica se é array e popula a variável global
        materiaisData = Array.isArray(data) ? data : [];
        
        // Chama a função de filtro para renderizar na tela
        filtrarMateriais();
        
    } catch (error) {
        console.error(error);
        hideAllStates();
        booksGrid.innerHTML = '<div class="col-12 text-center text-danger">Erro ao carregar materiais.</div>';
    } finally { 
        isInitialLoad = false; 
    }
}

function filtrarMateriais() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedLocation = locationSelect.value;
    
    filteredMateriais = materiaisData.filter(material => {
        const title = (material.Titulo || '').toLowerCase();
        const local = material.Localizacao || '';
        const matchText = title.includes(searchTerm);
        const matchLoc = selectedLocation === '' || local.includes(selectedLocation);
        return matchText && matchLoc;
    });

    hideAllStates();
    if (filteredMateriais.length === 0) showEmptyState();
    else renderizarMateriais(filteredMateriais);
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    loadingState.style.display = 'none';
    
    // 1. Busca os materiais
    fetchAllMateriais(); 
    
    // 2. Busca as notificações para atualizar o ícone
    atualizarBadgeNotificacoes();

    searchInput.addEventListener('input', debounce(filtrarMateriais, 300));
    locationSelect.addEventListener('change', filtrarMateriais);
});

// Mock denuncia
window.reportBook = function(id) { 
    // Se você tiver o arquivo denuncia-modal.js importado no HTML, chame a função dele:
    if(window.abrirModalDenuncia) {
        window.abrirModalDenuncia(id);
    } else {
        alert("Funcionalidade de denúncia indisponível.");
    }
}