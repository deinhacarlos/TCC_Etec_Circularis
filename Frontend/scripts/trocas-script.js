const BASE_URL = 'http://localhost:3000'; 

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId'); 

    if (!token || !usuarioId) {
        window.location.href = 'login.html';
        return; 
    }
    
    document.getElementById('btnLogout')?.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    carregarTrocas();

    async function carregarTrocas() {
        try {
            const [respRecebidas, respEnviadas] = await Promise.all([
                fetch(`${BASE_URL}/api/trocas?usuario_doador_id=${usuarioId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${BASE_URL}/api/trocas?usuario_solicitante_id=${usuarioId}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            let recebidas = [], enviadas = [];
            if (respRecebidas.ok) recebidas = await respRecebidas.json();
            if (respEnviadas.ok) enviadas = await respEnviadas.json();

            renderizarLista('listaRecebidas', recebidas, true); 
            renderizarLista('listaEnviadas', enviadas, false);  

        } catch (error) {
            console.error("Erro ao carregar trocas:", error);
        }
    }

    function renderizarLista(elementId, lista, souDoador) {
        const container = document.getElementById(elementId);
        
        if (!lista || lista.length === 0) {
            container.innerHTML = `<div class="text-center py-5 text-muted"><p>Nenhuma troca encontrada.</p></div>`;
            return;
        }

        container.innerHTML = lista.map(t => {
            const idParceiro = souDoador ? t.Id_Usuario_Solicitante_FK : t.Id_Usuario_Doador_FK;
            const nomeParceiro = souDoador ? t.Nome_Solicitante : t.Nome_Doador;
            const chatUrl = `chat.html?targetUser=${idParceiro}&book=${t.Id_Material_FK}`;

            let statusControl = '';
            
            if (souDoador) {
                statusControl = `
                    <div class="mt-2">
                        <label class="small text-muted">Status:</label>
                        <select class="form-select form-select-sm" 
                                style="width: auto; display: inline-block; border-color: ${getStatusColor(t.Status)}"
                                onchange="atualizarStatus(${t.Id_Troca}, this.value)">
                            <option value="Pendente" ${t.Status === 'Pendente' ? 'selected' : ''}>🟡 Pendente</option>
                            <option value="Concluido" ${t.Status === 'Concluido' ? 'selected' : ''}>🟢 Concluído</option>
                            <option value="Cancelado" ${t.Status === 'Cancelado' ? 'selected' : ''}>🔴 Cancelado</option>
                        </select>
                    </div>
                `;
            } else {
                statusControl = `<span class="badge ${getStatusBadgeClass(t.Status)} mt-2">${t.Status}</span>`;
            }

            return `
            <div class="troca-card p-3 mb-3 border rounded bg-white shadow-sm">
                <div class="d-flex align-items-center gap-3 flex-wrap">
                    <img src="${t.Imagem_Material ? `${BASE_URL}/uploads/${t.Imagem_Material}` : 'assets/logo.png'}" 
                         style="width:60px; height:80px; object-fit:cover; border-radius:4px;"
                         onerror="this.src='https://via.placeholder.com/80?text=Livro'">
                    
                    <div class="flex-grow-1">
                        <h5 class="mb-1 fw-bold">${t.Titulo_Material || 'Material'}</h5>
                        <p class="mb-1 small text-muted">
                            ${souDoador ? 'Interessado:' : 'Dono:'} <strong>${nomeParceiro || 'Usuário'}</strong>
                        </p>
                        ${statusControl}
                    </div>

                    <div class="d-flex flex-column gap-2 align-items-end">
                        <a href="${chatUrl}" class="btn btn-sm btn-outline-primary w-100 text-decoration-none">
                            <i class="bi bi-chat-dots-fill"></i> Conversar
                        </a>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    function getStatusColor(status) {
        if (status === 'Concluido') return '#198754';
        if (status === 'Cancelado') return '#dc3545';
        return '#ffc107';
    }

    function getStatusBadgeClass(status) {
        if (status === 'Concluido') return 'bg-success';
        if (status === 'Cancelado') return 'bg-danger';
        return 'bg-warning text-dark';
    }

    // --- AQUI ESTÁ A CORREÇÃO PRINCIPAL ---
    window.atualizarStatus = async (id, novoStatus) => {
        let textoConfirmacao = `Deseja mudar o status para "${novoStatus}"?`;
        
        if (novoStatus === 'Concluido') {
            textoConfirmacao = "Ao concluir, o livro sairá da lista de busca automaticamente. Deseja continuar?";
        } else if (novoStatus === 'Cancelado') {
            textoConfirmacao = "Tem certeza que deseja cancelar esta troca?";
        }

        // Usa showConfirm (do utils.js) em vez do confirm nativo
        if (typeof showConfirm === 'function') {
            showConfirm(textoConfirmacao, async () => {
                await executarAtualizacao(id, novoStatus);
            });
        } else {
            // Fallback caso utils.js falhe, mas não deve acontecer
            if(confirm(textoConfirmacao)) await executarAtualizacao(id, novoStatus);
            else carregarTrocas();
        }
    };

    async function executarAtualizacao(id, novoStatus) {
        try {
            const resp = await fetch(`${BASE_URL}/api/trocas/${id}/responder`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: novoStatus })
            });

            if (resp.ok) {
                if(typeof showToast === 'function') showToast(`Status alterado para: ${novoStatus}`, 'success');
                else alert('Status atualizado!');
                carregarTrocas(); 
            } else {
                const erro = await resp.json();
                if(typeof showToast === 'function') showToast(erro.message || 'Erro.', 'error');
                else alert(erro.message);
                carregarTrocas();
            }
        } catch (error) {
            console.error(error);
            if(typeof showToast === 'function') showToast('Erro de conexão.', 'error');
        }
    }
});