// ==================== CONFIGURAÇÃO ====================
const BASE_URL = 'http://localhost:3000';
let conversationsData = [];
let currentConversation = null;
let currentPartnerId = null;
let materialParaTroca = null;

// Elementos do DOM
const chatHeader = document.getElementById('chatHeader');
const chatAvatar = document.getElementById('chatAvatar');
const chatName = document.getElementById('chatName');
const chatMessagesArea = document.getElementById('chatMessagesArea');
const chatInputArea = document.getElementById('chatInput');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const emptyOverlay = document.getElementById('emptyModalOverlay');
const conversationsList = document.getElementById('conversationsList');

// URL de imagem padrão para evitar erro 404 se não tiver user.png local
const DEFAULT_AVATAR = 'https://via.placeholder.com/150/CCCCCC/666666?text=User';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');
    
    // Redireciona se não estiver logado
    if (!token || !usuarioId) { 
        window.location.href = 'login.html'; 
        return; 
    }
    
    initChat();
});

async function initChat() {
    const params = new URLSearchParams(window.location.search);
    const materialIdParam = params.get('book');
    const targetUserId = params.get('targetUser');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('usuarioId');

    try {
        await loadConversations();

        // CASO 1: Abrir chat direto com usuário específico
        if (targetUserId) {
            await abrirOuCriarChatComUsuario(targetUserId);
            return;
        }

        // CASO 2: Proposta de Troca (Vindo do botão "Propor Troca")
        if (materialIdParam) {
            const resp = await fetch(`${BASE_URL}/api/materiais/${materialIdParam}`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (resp.ok) {
                const material = await resp.json();
                // Impede troca consigo mesmo
                if (String(material.Id_Dono) === String(userId)) {
                    if(window.showToast) showToast("Você não pode trocar com você mesmo!", "warning");
                    setTimeout(() => window.location.href = 'busca.html', 1500);
                    return;
                }
                await prepararChatParaTroca(material);
            }
            return;
        }

        // CASO 3: Carregar o primeiro chat da lista ou mostrar vazio
        if (conversationsData.length > 0) {
            await loadChat(conversationsData[0].Id_Chat);
            if (emptyOverlay) emptyOverlay.classList.remove('show');
        } else {
            if (emptyOverlay) emptyOverlay.classList.add('show');
        }

    } catch (error) { 
        console.error("Erro na inicialização do chat:", error); 
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
        console.error("Erro ao carregar lista de conversas:", error); 
    }
}

function renderConversationsList() {
    if (!conversationsList) return;
    const myId = localStorage.getItem('usuarioId');
    
    conversationsList.innerHTML = conversationsData.map(chat => {
        const isUser1Me = (chat.Id_Usuario1_FK == myId);
        const otherName = isUser1Me ? chat.Nome_Usuario2 : chat.Nome_Usuario1;
        const otherPhoto = isUser1Me ? chat.Foto_Usuario2 : chat.Foto_Usuario1;
        
        // Define a URL da foto ou fallback
        const photoUrl = otherPhoto ? `${BASE_URL}/uploads/${otherPhoto}` : DEFAULT_AVATAR;
        const isActive = currentConversation && currentConversation.id == chat.Id_Chat ? 'active' : '';
        
        let statusBadge = '';
        if (chat.Ultimo_Status_Troca === 'Concluido') {
            statusBadge = '<div class="status-badge text-success"><i class="bi bi-check-circle-fill"></i> Concluído</div>';
        } else if (chat.Ultimo_Status_Troca === 'Pendente') {
            statusBadge = '<div class="status-badge text-warning"><i class="bi bi-hourglass-split"></i> Ativo</div>';
        }

        return `
            <div class="conversation-item ${isActive}" onclick="loadChat(${chat.Id_Chat})">
                <div style="position:relative;">
                    <img src="${photoUrl}" class="conv-avatar" onerror="this.src='${DEFAULT_AVATAR}'">
                </div>
                <div class="conv-info">
                    <div class="conv-name">${otherName || 'Usuário'}</div>
                    ${statusBadge}
                </div>
            </div>`;
    }).join('');
}

async function loadChat(chatId) {
    // === CORREÇÃO CRÍTICA ===
    // Limpa o estado de troca ao mudar de chat. Isso garante que mensagens
    // normais não sejam tratadas como negociação de troca pendente.
    materialParaTroca = null; 
    // ========================

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
        
        atualizarHeaderChat(otherName, otherPhoto);
        currentConversation = { id: chatId };

        // Carrega as mensagens
        const respMsg = await fetch(`${BASE_URL}/api/mensagens?chat_id=${chatId}`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        const mensagens = await respMsg.json();
        renderMensagens(mensagens);
        
        if (emptyOverlay) emptyOverlay.classList.remove('show');
        
        // Atualiza a lista lateral para marcar o ativo
        renderConversationsList();

    } catch (e) { 
        console.error("Erro ao carregar chat:", e); 
    }
}

async function abrirOuCriarChatComUsuario(targetUserId) {
    const chatExistente = conversationsData.find(c => 
        c.Id_Usuario1_FK == targetUserId || c.Id_Usuario2_FK == targetUserId
    );

    if (chatExistente) {
        await loadChat(chatExistente.Id_Chat);
    } else {
        try {
            const resp = await fetch(`${BASE_URL}/api/usuarios/${targetUserId}`, { 
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
            });
            if(resp.ok) {
                const user = await resp.json();
                atualizarHeaderChat(user.Nome_Completo, user.FotoPerfil);
                
                currentPartnerId = targetUserId;
                currentConversation = null;
                materialParaTroca = null; // Garante limpeza

                chatMessagesArea.innerHTML = `<div class="text-center text-muted mt-5">Inicie a conversa...</div>`;
                if(emptyOverlay) emptyOverlay.classList.remove('show');
                if(chatInputArea) chatInputArea.style.display = 'flex';
            }
        } catch(e) { console.error(e); }
    }
    
    if(messageInput) messageInput.value = '';
}

async function prepararChatParaTroca(material) {
    // Verifica se já existe chat com o dono do material
    const chatExistente = conversationsData.find(c => 
        c.Id_Usuario1_FK == material.Id_Dono || c.Id_Usuario2_FK == material.Id_Dono
    );
    
    materialParaTroca = material; // Define o estado de troca
    
    if (chatExistente) {
        await loadChat(chatExistente.Id_Chat);
        // Recoloca o materialParaTroca porque loadChat limpou na linha de correção
        materialParaTroca = material; 
    } else {
        const donoNome = material.Nome_Dono || "Usuário";
        atualizarHeaderChat(donoNome, material.Foto_Dono);
        currentPartnerId = material.Id_Dono;
        currentConversation = null;
        chatMessagesArea.innerHTML = `<div class="text-center text-muted mt-4 mb-4"><small>Negociando: <strong>${material.Titulo}</strong></small></div>`;
    }

    if (messageInput) {
        const nomeDono = material.Nome_Dono || "Usuário";
        messageInput.value = `Olá ${nomeDono}, tenho interesse no seu material "${material.Titulo}". Podemos combinar a troca ou doação?`;
        messageInput.focus();
        if (chatInputArea) chatInputArea.style.display = 'flex';
        if (emptyOverlay) emptyOverlay.classList.remove('show');
    }
}

// === ENVIO DE MENSAGEM ===
if (sendBtn) sendBtn.addEventListener('click', enviarMensagem);
if (messageInput) messageInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') enviarMensagem(); 
});

async function enviarMensagem() {
    const texto = messageInput.value.trim();
    if (!texto) return;
    
    if (!currentPartnerId) {
        alert("Erro: Destinatário não identificado. Recarregue a página.");
        return;
    }

    const token = localStorage.getItem('token');
    const myId = localStorage.getItem('usuarioId');

    try {
        // Se o chat ainda não existe no banco, cria agora
        if (!currentConversation) {
            const respChat = await fetch(`${BASE_URL}/api/chats`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ Id_Usuario1_FK: myId, Id_Usuario2_FK: currentPartnerId })
            });
            const dadosChat = await respChat.json();
            
            if (respChat.ok || dadosChat.existente) {
                const novoId = dadosChat.id || dadosChat.Id_Chat || dadosChat.insertId;
                currentConversation = { id: novoId };
                await loadConversations();
            } else {
                alert("Erro ao criar chat.");
                return;
            }
        }

        // Envia a mensagem
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

            // === LÓGICA DE NOTIFICAÇÃO ===
            
            // Caso 1: É uma negociação de troca
            if (materialParaTroca) {
                adicionarDivisorNoChat(`Início da negociação: ${materialParaTroca.Titulo}`);
                await criarRegistroTroca(materialParaTroca.Id_Material, currentPartnerId);
                
                console.log(`Enviando Notificação de TROCA para ID: ${currentPartnerId}`);
                await criarNotificacao(
                    parseInt(currentPartnerId), 
                    "Nova Proposta de Troca", 
                    `Proposta recebida pelo livro "${materialParaTroca.Titulo}".`, 
                    "Troca"
                );
                
                // Limpa o objeto após a primeira mensagem para virar conversa normal
                materialParaTroca = null; 
                setTimeout(() => loadConversations(), 500);
            
            } else {
                // Caso 2: É uma mensagem comum
                console.log(`Enviando Notificação de MENSAGEM para ID: ${currentPartnerId}`);
                await criarNotificacao(
                    parseInt(currentPartnerId), 
                    "Nova Mensagem", 
                    "Você recebeu uma nova mensagem no chat.", 
                    "Mensagem"
                );
            }
        }
    } catch (e) { 
        console.error("Erro envio:", e); 
    }
}

function atualizarHeaderChat(nome, foto) {
    if (chatHeader) chatHeader.style.display = 'flex';
    if (chatName) chatName.textContent = nome;
    
    // Tratamento de imagem para evitar 404
    if (chatAvatar) {
        chatAvatar.onerror = function() { this.src = DEFAULT_AVATAR; };
        chatAvatar.src = foto ? `${BASE_URL}/uploads/${foto}` : DEFAULT_AVATAR;
    }
    
    if (chatInputArea) chatInputArea.style.display = 'flex';
}

function adicionarDivisorNoChat(texto) {
    const div = document.createElement('div');
    div.className = 'text-center my-3';
    div.innerHTML = `<span class="badge bg-light text-dark border">${texto}</span>`;
    chatMessagesArea.appendChild(div);
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
}

function addMessageToUI(text, sent) {
    const div = document.createElement('div');
    div.className = `message-wrapper ${sent ? 'sent' : 'received'}`;
    div.innerHTML = `
        <div class="message-bubble">
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">Agora</div>
            </div>
        </div>`;
    chatMessagesArea.appendChild(div);
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
}

function renderMensagens(lista) {
    if (!chatMessagesArea) return;
    const myId = localStorage.getItem('usuarioId');
    
    chatMessagesArea.innerHTML = lista.map(msg => {
        const isMe = (msg.Id_Usuario_Remetente_FK == myId);
        const time = new Date(msg.DataEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        return `
            <div class="message-wrapper ${isMe ? 'sent' : 'received'}">
                <div class="message-bubble">
                    <div class="message-content">
                        <div class="message-text">${msg.Conteudo}</div>
                        <div class="message-time">${time}</div>
                    </div>
                </div>
            </div>`;
    }).join('');
    
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
}

async function criarRegistroTroca(materialId, donoId) {
    try {
        await fetch(`${BASE_URL}/api/trocas`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                Id_Usuario_Solicitante_FK: localStorage.getItem('usuarioId'), 
                Id_Usuario_Doador_FK: donoId, 
                Id_Material_FK: materialId, 
                Status: 'Pendente', 
                Observacoes: 'Via Chat' 
            })
        });
    } catch (e) { console.error(e); }
}

async function criarNotificacao(destId, tit, msg, tipo) {
    // Verificação de segurança para o ID
    if (!destId || isNaN(destId)) {
        console.error("Tentativa de notificar ID inválido:", destId);
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/api/notificacoes`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                Id_Usuario_FK: destId, 
                Titulo: tit, 
                Mensagem: msg, 
                Tipo_Notificacao: tipo 
            })
        });
        
        if(res.ok) console.log("Notificação salva no banco com sucesso!");
        else console.error("Erro API notificação:", await res.text());
        
    } catch (e) { 
        console.error("Erro ao chamar API de notificação:", e); 
    }
}

document.getElementById('modalCloseBtn')?.addEventListener('click', () => window.location.href = 'busca.html');