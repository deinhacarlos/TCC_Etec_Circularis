// =================================================================
// COMPONENTE: MODAL DE DENÚNCIA (O Card de Opções)
// =================================================================

const API_BASE = 'http://localhost:3000'; 

// 1. HTML DO CARD/MODAL (Injetado via JS)
const modalHTML = `
<div class="modal fade" id="modalDenuncia" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow-lg" style="border-radius: 12px; overflow: hidden;">
      
      <div class="modal-header bg-danger text-white border-0">
        <h5 class="modal-title d-flex align-items-center">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          Reportar Material
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body p-4 bg-light">
        <form id="formDenuncia">
            <input type="hidden" id="denunciaMaterialId">
            
            <div class="alert alert-warning d-flex align-items-center mb-3" role="alert">
              <i class="bi bi-info-circle me-2"></i>
              <div class="small">Essa denúncia será enviada anonimamente para a moderação.</div>
            </div>

            <div class="mb-3">
                <label for="tipoDenuncia" class="form-label fw-bold text-dark">Qual é o problema?</label>
                <select class="form-select border-secondary" id="tipoDenuncia" required>
                    <option value="" selected disabled>Selecione um motivo...</option>
                    <option value="Conteúdo Impróprio">Conteúdo Impróprio / Ofensivo</option>
                    <option value="Informação Falsa">Informação Falsa / Enganosa</option>
                    <option value="Item Proibido">Item Proibido (Venda, Dinheiro, etc)</option>
                    <option value="Spam">Spam / Anúncio Repetido</option>
                    <option value="Outro">Outro Motivo</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="descricaoDenuncia" class="form-label fw-bold text-dark">Detalhes Adicionais</label>
                <textarea class="form-control border-secondary" id="descricaoDenuncia" rows="3" placeholder="Explique brevemente o problema..."></textarea>
            </div>
        </form>
      </div>

      <div class="modal-footer bg-white border-top-0">
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-danger rounded-pill px-4" onclick="enviarDenunciaReal()">
           <i class="bi bi-send me-1"></i> Enviar Denúncia
        </button>
      </div>
    </div>
  </div>
</div>
`;

// 2. INJETAR O HTML NA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('modalDenuncia')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
});

let modalInstance = null;

// 3. FUNÇÃO QUE ABRE O CARD
window.abrirModalDenuncia = function(bookId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // SUBSTITUIÇÃO: alert -> showToast
        showToast("Você precisa estar logado para denunciar.", "warning");
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }

    const modalEl = document.getElementById('modalDenuncia');
    if (modalEl) {
        document.getElementById('formDenuncia').reset();
        document.getElementById('denunciaMaterialId').value = bookId;
        
        modalInstance = new bootstrap.Modal(modalEl);
        modalInstance.show();
    } else {
        console.error("Erro: Modal não carregou.");
    }
}

// 4. FUNÇÃO QUE ENVIA PARA O BACKEND
window.enviarDenunciaReal = async function() {
    const materialId = document.getElementById('denunciaMaterialId').value;
    const tipo = document.getElementById('tipoDenuncia').value;
    const descricao = document.getElementById('descricaoDenuncia').value;
    const userId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem('token');

    if (!tipo) {
        // SUBSTITUIÇÃO: alert -> showToast
        showToast("Por favor, selecione um motivo.", "warning");
        return;
    }

    const textoDescricao = descricao ? `${tipo}: ${descricao}` : tipo;

    const btnEnviar = document.querySelector('#modalDenuncia .btn-danger');
    const textoOriginal = btnEnviar.innerHTML;
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Enviando...';

    try {
        const response = await fetch(`${API_BASE}/api/denuncias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                Descricao: textoDescricao,
                Tipo_Denuncia: "Alerta",
                Id_Usuario_Denunciante_FK: userId,
                Id_Material_FK: materialId
            })
        });

        if (response.ok) {
            modalInstance.hide();
            // SUBSTITUIÇÃO: alert -> showToast
            showToast("Denúncia enviada com sucesso! Analisaremos em breve.", "success");
        } else {
            const erro = await response.json();
            showToast("Erro: " + (erro.message || "Erro desconhecido."), "error");
        }

    } catch (error) {
        console.error(error);
        showToast("Erro de conexão.", "error");
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = textoOriginal;
    }
}