const BASE_URL = 'http://localhost:3000'; 
let isEditing = false;
let currentUserId = null;
let currentToken = null;
let profileData = {};

// ==================== ELEMENTOS ====================
const profilePhoto = document.getElementById('profilePhoto');
const photoInput = document.getElementById('photoInput');
const profileName = document.getElementById('profileName');
const profileEmailDisplay = document.getElementById('profileEmailDisplay');
const profileLocationDisplay = document.getElementById('profileLocationDisplay');

const nomeCompletoInput = document.getElementById('nomeCompleto');
const emailInput = document.getElementById('email');
const localizacaoInput = document.getElementById('localizacao');

const btnEditarPerfil = document.getElementById('btnEditarPerfil');
const btnSalvar = document.getElementById('btnSalvar');
const btnTrocarFoto = document.getElementById('btnTrocarFoto');
const btnVoltar = document.getElementById('btnVoltar');
const btnLogout = document.getElementById('btnLogout');

// ==================== NOTIFICAÇÃO ====================
function notificar(msg, tipo) {
    console.log(`[Notificação] ${tipo}: ${msg}`);
    if (typeof showToast === 'function') {
        showToast(msg, tipo);
    } else {
        alert(msg);
    }
}

// ==================== EDIÇÃO ====================
function toggleEdicao(enable) {
    isEditing = enable;
    
    // Inputs
    if(nomeCompletoInput) nomeCompletoInput.disabled = !enable;
    if(localizacaoInput) localizacaoInput.disabled = !enable;
    
    // Botão Salvar
    if(btnSalvar) btnSalvar.style.display = enable ? 'inline-block' : 'none';
    
    // Botão Editar
    if(btnEditarPerfil) {
        btnEditarPerfil.textContent = enable ? 'Cancelar' : 'Editar Perfil';
        btnEditarPerfil.className = enable ? 'btn btn-outline-secondary' : 'btn-editar-perfil';
    }

    // Se cancelar, restaura
    if (!enable && profileData.Nome_Completo) {
        nomeCompletoInput.value = profileData.Nome_Completo || '';
        localizacaoInput.value = profileData.Endereco || '';
    }
}

// ==================== CARREGAR USUÁRIO ====================
async function fetchUser() {
    console.log("Buscando usuário...");
    
    if (!currentUserId || !currentToken) {
        console.warn("Sem credenciais.");
        return; 
    }

    try {
        const resp = await fetch(`${BASE_URL}/api/usuarios/${currentUserId}`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        if (!resp.ok) throw new Error("Erro ao buscar dados (Status " + resp.status + ")");

        const data = await resp.json();
        profileData = data; 

        // Preenche HTML
        if(profileName) profileName.textContent = data.Nome_Completo || 'Sem Nome';
        if(profileEmailDisplay) profileEmailDisplay.textContent = data.Email || '';
        if(profileLocationDisplay) profileLocationDisplay.textContent = data.Endereco || 'Endereço não informado';

        // Preenche Inputs
        if(nomeCompletoInput) nomeCompletoInput.value = data.Nome_Completo || '';
        if(emailInput) emailInput.value = data.Email || '';
        if(localizacaoInput) localizacaoInput.value = data.Endereco || '';

        // Foto
        if (profilePhoto) {
            if (data.FotoPerfil && data.FotoPerfil !== 'padrao.png') {
                profilePhoto.src = `${BASE_URL}/uploads/${data.FotoPerfil}?t=${Date.now()}`;
            } else {
                profilePhoto.src = 'https://via.placeholder.com/150/6C63FF/FFFFFF?text=User';
            }
        }

    } catch (error) {
        console.error(error);
        notificar("Não foi possível carregar o perfil.", "error");
    }
}

// ==================== SALVAR DADOS (LÓGICA PRINCIPAL) ====================
async function salvarDados() {
    console.log("Tentando salvar...");

    if (!currentUserId) {
        notificar("Erro de sessão. Faça login novamente.", "error");
        return;
    }

    const novosDados = {
        Nome_Completo: nomeCompletoInput.value.trim(),
        Endereco: localizacaoInput.value.trim()
    };

    // UI Loading
    const textoOriginal = btnSalvar.textContent;
    btnSalvar.textContent = "Salvando...";
    btnSalvar.disabled = true;

    try {
        const resp = await fetch(`${BASE_URL}/api/usuarios/${currentUserId}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(novosDados)
        });

        const data = await resp.json();

        if (!resp.ok) {
            throw new Error(data.message || "Erro ao atualizar.");
        }

        notificar("Perfil atualizado com sucesso!", "success");
        await fetchUser(); // Recarrega para garantir
        toggleEdicao(false);

    } catch (error) {
        console.error(error);
        notificar(error.message, "error");
    } finally {
        btnSalvar.textContent = textoOriginal;
        btnSalvar.disabled = false;
    }
}

// ==================== FOTO ====================
async function salvarFoto() {
    const file = photoInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('FotoPerfil', file);

    notificar("Enviando foto...", "warning");

    try {
        const resp = await fetch(`${BASE_URL}/api/usuarios/foto/${currentUserId}`, {
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${currentToken}` },
            body: formData
        });

        if (!resp.ok) throw new Error("Erro no upload");

        const data = await resp.json();
        
        // Atualiza a imagem na hora
        if (data.foto) {
            profilePhoto.src = `${BASE_URL}/uploads/${data.foto}?t=${Date.now()}`;
        }
        
        notificar("Foto atualizada!", "success");

    } catch (error) {
        console.error(error);
        notificar("Erro ao enviar foto.", "error");
    }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega dados
    currentUserId = localStorage.getItem('usuarioId');
    currentToken = localStorage.getItem('token');

    // 2. Valida Sessão
    if (!currentUserId || !currentToken) {
        window.location.href = 'login.html';
        return;
    }

    // 3. Carrega
    fetchUser();
    toggleEdicao(false);

    // 4. Eventos
    if (btnEditarPerfil) {
        btnEditarPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            toggleEdicao(!isEditing);
        });
    }

    // MUDANÇA IMPORTANTE: Evento CLICK direto no botão, não submit no form
    if (btnSalvar) {
        btnSalvar.addEventListener('click', (e) => {
            e.preventDefault();
            salvarDados();
        });
    }

    if (btnTrocarFoto) {
        btnTrocarFoto.addEventListener('click', (e) => {
            e.preventDefault();
            photoInput.click();
        });
    }

    if (photoInput) {
        photoInput.addEventListener('change', salvarFoto);
    }

    if (btnVoltar) btnVoltar.addEventListener('click', () => window.location.href = 'busca.html');
    
    if (btnLogout) btnLogout.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
});