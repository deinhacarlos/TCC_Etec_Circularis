const BASE_URL = 'http://localhost:3000';

// Variáveis de Estado
let conversationsData = [];
let currentConversation = null;
let currentPartnerId = null;

// Elementos DOM
const profilePhoto = document.getElementById('profilePhoto');
const chatAvatar = document.getElementById('chatAvatar');
const chatName = document.getElementById('chatName');
const chatHeader = document.getElementById('chatHeader');
const chatMessagesArea = document.getElementById('chatMessagesArea');
const chatInputArea = document.getElementById('chatInput');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const emptyOverlay = document.getElementById('emptyModalOverlay');
const conversationsList = document.getElementById('conversationsList');

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');

    if (!token || !usuarioId) {
        window.location.href = 'login.html';
        return;
    }

    initChat();
});

async function initChat() {
    console.log("Iniciando chat...");
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('usuarioId');
    
    const params = new URLSearchParams(window.location.search);
    const materialIdParam = params.get('book');
    const targetUserId = params.get('targetUser');

    try {
        await loadConversations(); 

        // CENÁRIO A: Tem usuário alvo
        if (targetUserId) {
            console.log("Abrindo chat com usuário alvo:", targetUserId);
            
            const conversation = conversationsData.find(c => 
                c.Id_Usuario1_FK == targetUserId || c.Id_Usuario2_FK == targetUserId
            );

            if (conversation) {
                await loadChat(conversation.Id_Chat);
            } else {
                await prepararChatPorUsuario(targetUserId);
            }
            
            if(emptyOverlay) emptyOverlay.classList.remove('show');
            return;
        }

        // CENÁRIO B: Propor Troca (Livro)
        if (materialIdParam && !targetUserId) {
            const resp = await fetch(`${BASE_URL}/api/materiais/${materialIdParam}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (resp.ok) {
                const material = await resp.json();
                
                if (String(material.Id_Dono) === String(userId)) {
                    // SUBSTITUIÇÃO DE ALERT
                    showToast("Você não pode trocar com você mesmo!", "warning");
                    setTimeout(() => window.location.href = 'busca.html', 2000);
                    return;
                }
                
                prepararChatNovaTroca(material);
                if (emptyOverlay) emptyOverlay.classList.remove('show');
            }
            return;
        }

        // CENÁRIO C: Auto-abrir última
        if (conversationsData.length > 0) {
            await loadChat(conversationsData[0].Id_Chat);
            if (emptyOverlay) emptyOverlay.classList.remove('show');
            return;
        }

        // Vazio
        if (emptyOverlay) emptyOverlay.classList.add('show');

    } catch (error) {
        console.error("Erro no fluxo inicial:", error);
    }
}

async function loadConversations() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('usuarioId');

    try {
        const resp = await fetch(`${BASE_URL}/api/chats?usuario_id=${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (resp.ok) {
            conversationsData = await resp.json();
            renderConversationsList();
        }
    } catch (error) {
        console.error("Erro ao carregar conversas:", error);
    }
}

function renderConversationsList() {
    if (!conversationsList) return;
    const myId = localStorage.getItem('usuarioId');

    conversationsList.innerHTML = conversationsData.map(chat => {
        const isUser1Me = (chat.Id_Usuario1_FK == myId);
        const otherName = isUser1Me ? chat.Nome_Usuario2 : chat.Nome_Usuario1;
        const otherPhoto = isUser1Me ? chat.Foto_Usuario2 : chat.Foto_Usuario1;
        const photoUrl = otherPhoto ? `${BASE_URL}/uploads/${otherPhoto}` : 'assets/user.png';
        
        const isActive = currentConversation && currentConversation.id === chat.Id_Chat ? 'active' : '';

        // LÓGICA VISUAL DO STATUS
        let statusBadge = '';
        let itemClass = '';

        if (chat.Ultimo_Status_Troca === 'Concluido') {
            statusBadge = '<div class="status-badge text-success"><i class="bi bi-check-circle-fill"></i> Concluído</div>';
            itemClass = 'concluded-item';
        } else if (chat.Ultimo_Status_Troca === 'Cancelado' || chat.Ultimo_Status_Troca === 'Rejeitado') {
            statusBadge = '<div class="status-badge text-muted"><i class="bi bi-x-circle-fill"></i> Cancelado</div>';
            itemClass = 'canceled-item';
        } else {
            statusBadge = '<div class="conv-preview text-muted small">Clique para conversar</div>';
        }

        return `
            <div class="conversation-item ${isActive} ${itemClass}" onclick="loadChat(${chat.Id_Chat})">
                <div style="position: relative;">
                    <img src="${photoUrl}" class="conv-avatar" onerror="this.src='assets/user.png'">
                    ${chat.Ultimo_Status_Troca === 'Pendente' || chat.Ultimo_Status_Troca === 'Aceito' ? 
                      '<span class="online-indicator"></span>' : ''}
                </div>
                <div class="conv-info">
                    <div class="conv-name">${otherName || 'Usuário'}</div>
                    ${statusBadge}
                </div>
            </div>
        `;
    }).join('');
}
async function loadChat(chatId) {
    const token = localStorage.getItem('token');
    const myId = localStorage.getItem('usuarioId');

    try {
        const respChat = await fetch(`${BASE_URL}/api/chats/${chatId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const chat = await respChat.json();

        const isUser1Me = (chat.Id_Usuario1_FK == myId);
        currentPartnerId = isUser1Me ? chat.Id_Usuario2_FK : chat.Id_Usuario1_FK;
        
        const otherName = isUser1Me ? chat.Nome_Usuario2 : chat.Nome_Usuario1;
        const otherPhoto = isUser1Me ? chat.Foto_Usuario2 : chat.Foto_Usuario1;
        
        if (chatHeader) chatHeader.style.display = 'flex';
        if (chatName) chatName.textContent = otherName;
        if (chatAvatar) chatAvatar.src = otherPhoto ? `${BASE_URL}/uploads/${otherPhoto}` : 'assets/user.png';
        if (chatInputArea) chatInputArea.style.display = 'flex'; // GARANTE QUE O INPUT APARECE

        currentConversation = { id: chatId };

        const respMsg = await fetch(`${BASE_URL}/api/mensagens?chat_id=${chatId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const mensagens = await respMsg.json();
        
        renderMensagens(mensagens);
        
        if (emptyOverlay) emptyOverlay.classList.remove('show');
        renderConversationsList();

    } catch (e) {
        console.error("Erro ao carregar chat:", e);
    }
}

function renderMensagens(lista) {
    if (!chatMessagesArea) return;
    const myId = localStorage.getItem('usuarioId');
    
    chatMessagesArea.innerHTML = lista.map(msg => {
        const isMe = (msg.Id_Usuario_Remetente_FK == myId);
        return `
            <div class="message-wrapper ${isMe ? 'sent' : 'received'}">
                <div class="message-bubble">
                    ${!isMe ? `<img src="${chatAvatar.src}" class="msg-avatar">` : ''}
                    <div class="message-content">
                        <div class="message-text">${msg.Conteudo}</div>
                        <div class="message-time">${new Date(msg.DataEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
}

async function prepararChatPorUsuario(targetUserId) {
    const token = localStorage.getItem('token');
    
    try {
        const resp = await fetch(`${BASE_URL}/api/usuarios/${targetUserId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (resp.ok) {
            const user = await resp.json();
            
            if (chatHeader) chatHeader.style.display = 'flex';
            if (chatName) chatName.textContent = user.Nome_Completo;
            if (chatAvatar) chatAvatar.src = user.FotoPerfil ? `${BASE_URL}/uploads/${user.FotoPerfil}` : 'assets/user.png';
            
            if (chatInputArea) chatInputArea.style.display = 'flex'; // GARANTE QUE O INPUT APARECE
            if (chatMessagesArea) chatMessagesArea.innerHTML = `<div class="text-center text-muted mt-5">Inicie a conversa com ${user.Nome_Completo}</div>`;
            
            currentPartnerId = targetUserId;
            currentConversation = null; 
        }
    } catch (e) {
        console.error("Erro ao buscar usuário:", e);
    }
}

function prepararChatNovaTroca(material) {
    const donoNome = material.Nome_Dono || "Usuário";
    const donoFoto = material.Foto_Dono
        ? `${BASE_URL}/uploads/${material.Foto_Dono}`
        : 'assets/user.png';

    if (chatHeader) chatHeader.style.display = 'flex';
    if (chatAvatar) chatAvatar.src = donoFoto;
    if (chatName) chatName.textContent = donoNome;

    currentPartnerId = material.Id_Dono;
    currentConversation = null;

    if (chatMessagesArea) chatMessagesArea.innerHTML = `
        <div class="text-center text-muted mt-4 mb-4">
            <small>Iniciando negociação sobre: <strong>${material.Titulo}</strong></small>
        </div>
    `;
    if (chatInputArea) chatInputArea.style.display = 'flex'; // GARANTE QUE O INPUT APARECE
    if (messageInput) {
        messageInput.value = `Olá ${donoNome}, tenho interesse no seu material "${material.Titulo}". Podemos combinar?`;
        messageInput.focus();
    }
}

if (sendBtn) sendBtn.addEventListener('click', enviarMensagem);
if (messageInput) messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') enviarMensagem(); });

async function enviarMensagem() {
    const texto = messageInput.value.trim();
    if (!texto) return;

    if (!currentPartnerId) {
        // SUBSTITUIÇÃO DE ALERT
        showToast("Erro: Destinatário não definido. Tente recarregar.", "error");
        return;
    }

    if (!currentConversation) {
        try {
            const token = localStorage.getItem('token');
            const myId = localStorage.getItem('usuarioId');

            const respChat = await fetch(`${BASE_URL}/api/chats`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ Id_Usuario1_FK: myId, Id_Usuario2_FK: currentPartnerId })
            });
            const dadosChat = await respChat.json();
            
            if (respChat.ok || dadosChat.existente) {
                currentConversation = { id: dadosChat.id };
                loadConversations();
            } else {
                // SUBSTITUIÇÃO DE ALERT
                return showToast("Erro ao iniciar chat: " + dadosChat.message, "error");
            }
        } catch (e) { console.error(e); return; }
    }

    try {
        const token = localStorage.getItem('token');
        const myId = localStorage.getItem('usuarioId');

        const respMsg = await fetch(`${BASE_URL}/api/mensagens`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                Id_Chat_FK: currentConversation.id, 
                Id_Usuario_Remetente_FK: myId, 
                Conteudo: texto 
            })
        });

        if (respMsg.ok) {
            addMessageToUI(texto, true);
            messageInput.value = '';

            const params = new URLSearchParams(window.location.search);
            const materialId = params.get('book');
            
            if (materialId) {
                await criarRegistroTroca(materialId, currentPartnerId);
            }
            
            await criarNotificacao(currentPartnerId, "Nova Mensagem", "Você recebeu uma mensagem no chat.", "Mensagem");

        } else {
            const erro = await respMsg.json();
            // SUBSTITUIÇÃO DE ALERT
            showToast("Erro ao enviar: " + erro.message, "error");
        }
    } catch (e) { console.error("Erro de envio:", e); }
}

function addMessageToUI(text, sent) {
    const div = document.createElement('div');
    div.className = `message-wrapper ${sent ? 'sent' : 'received'}`;
    div.innerHTML = `<div class="message-bubble"><div class="message-content"><div class="message-text">${text}</div><div class="message-time">Agora</div></div></div>`;
    chatMessagesArea.appendChild(div);
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
}

// Funções auxiliares mantidas iguais (sem alerts)
async function criarRegistroTroca(materialId, donoId) {
    const token = localStorage.getItem('token');
    const meuId = localStorage.getItem('usuarioId');
    try {
        await fetch(`${BASE_URL}/api/trocas`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Id_Usuario_Solicitante_FK: meuId,
                Id_Usuario_Doador_FK: donoId,
                Id_Material_FK: materialId,
                Status: 'Pendente',
                Observacoes: 'Iniciado via Chat'
            })
        });
    } catch (e) { console.error("Erro ao registrar troca:", e); }
}

async function criarNotificacao(destId, tit, msg, tipo) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`${BASE_URL}/api/notificacoes`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ Id_Usuario_FK: destId, Titulo: tit, Mensagem: msg, Tipo_Notificacao: tipo })
        });
    } catch (e) {}
}

document.getElementById('modalCloseBtn')?.addEventListener('click', () => window.location.href = 'busca.html');