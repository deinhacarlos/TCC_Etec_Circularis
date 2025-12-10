function capitalizeWords(str) {
    if (str === null || str === '') return '';
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// URL base do seu servidor Node.js (Backend)
const BASE_URL_BACKEND = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {

    // ===========================================
    // 1. VERIFICAÇÃO DE AUTENTICAÇÃO
    // ===========================================
    const usuarioId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem('token');

    if (!token || !usuarioId) {
        window.location.href = 'login.html'; // Redireciona se não estiver logado
        return;
    }

    // ===========================================
    // 2. VARIÁVEIS E FUNÇÕES PRINCIPAIS
    // ===========================================

    const materiaisBody = document.getElementById('materiaisBody');
    const alertArea = document.getElementById('alertArea');
    const editarForm = document.getElementById('editarForm');

    // Todos os campos do modal de edição
    const editId = document.getElementById('editId');
    const editTitulo = document.getElementById('editTitulo');
    const editDescricao = document.getElementById('editDescricao');
    const editTipo = document.getElementById('editTipo');
    const editConservacao = document.getElementById('editConservacao');
    const editCategoria = document.getElementById('editCategoria');
    const editAutor = document.getElementById('editAutor');
    const editObj = document.getElementById('editObj');
    const editLocalizacao = document.getElementById('editLocalizacao');
    const editDisponibilidade = document.getElementById('editDisponibilidade');
    const editDataCadastro = document.getElementById('editDataCadastro');
    const editDataAlteracao = document.getElementById('editDataAlteracao');
    const editFileInput = document.getElementById('editFileInput');
    const editImgPreview = document.getElementById('editImgPreview');

    let materiaisData = [];

    async function carregarMateriais() {
        materiaisBody.innerHTML = `<tr><td colspan="12">Carregando...</td></tr>`;
        try {
            const resp = await fetch(`${BASE_URL_BACKEND}/api/materiais?usuarioid=${usuarioId}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (!resp.ok) throw new Error('Erro ao buscar materiais do usuário!');
            materiaisData = await resp.json();
            exibeMateriais();
        } catch (err) {
            materiaisBody.innerHTML = `<tr><td colspan="12" class="text-danger">${err.message}</td></tr>`;
        }
    }

    function getImageUrl(imagem) {
        if (imagem) {
            return `${BASE_URL_BACKEND}/uploads/${imagem}`;
        }
        return `${BASE_URL_BACKEND}/imagens/padrao.png`;
    }

    function exibeMateriais() {
        if (!materiaisData || materiaisData.length === 0) {
            materiaisBody.innerHTML = `<tr><td colspan="12" class="text-center py-4">Nenhum material cadastrado.</td></tr>`;
            return;
        }
        materiaisBody.innerHTML = '';
        materiaisData.forEach(material => {
            const tipo = material.TipoMaterial || material.Tipo_Material || '';
            const conservacao = material.EstadoConservacao || material.Estado_Conservacao || '';

            // Lógica do Status
            let statusBadge = '';
            if (material.Disponibilidade) {
                statusBadge = '<span class="badge bg-success">Disponível</span>';
            } else {
                statusBadge = '<span class="badge bg-secondary">Trocado / Indisp.</span>';
            }

            // Renderização da tabela
            materiaisBody.innerHTML += `
        <tr>
          <td>
            <img src="${getImageUrl(material.Imagem)}" class="img-tabela" alt="img">
          </td>
          <td>${material.Titulo || ''}</td>
          <td>
            <div class="desc-limit" title="${material.Descricao || ''}">
                ${material.Descricao || ''}
            </div>
          </td>
          <td>${tipo}</td>
          <td>${conservacao}</td>
          <td>${material.Categoria || ''}</td>
          <td>${material.Autor || ''}</td>
          <td>${material.DataCadastro ? new Date(material.DataCadastro).toLocaleDateString() : ''}</td>
          
          <td>${capitalizeWords(material.Objetivo) || ''}</td> 
          
          <td>${material.Localizacao || ''}</td>
          
          <td>${statusBadge}</td>
          
          <td>
             <div class="d-flex gap-1">
                <button class="btn btn-sm btn-warning" onclick="editarMaterial(${material.Id_Material})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirMaterial(${material.Id_Material})" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
          </td>
        </tr>`;
        });
    }
    
    // CORRIGIDO: Usa a chave correta (Id_Material) e o acesso robusto ao modal
    window.editarMaterial = (id) => {
        // CORRIGIDO AQUI: Usa x.Id_Material para buscar
        const mat = materiaisData.find(x => x.Id_Material == id);
        if (!mat) return;

        editId.value = mat.Id_Material;
        editTitulo.value = mat.Titulo || '';
        editDescricao.value = mat.Descricao || '';
        editTipo.value = mat.TipoMaterial || mat.Tipo_Material || '';
        editConservacao.value = (mat.EstadoConservacao || '').trim();
        editCategoria.value = mat.Categoria || '';
        editAutor.value = mat.Autor || '';
        editObj.value = (mat.Objetivo || '').toLowerCase().trim();
        editLocalizacao.value = mat.Localizacao || '';
        editDisponibilidade.checked = Boolean(mat.Disponibilidade);
        editFileInput.value = '';

        editImgPreview.src = getImageUrl(mat.Imagem);
        editImgPreview.style.display = 'block';

        // SOLUÇÃO: Acessa e exibe o modal de forma robusta
        const modalElement = document.getElementById('modalEditar');
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
        modalInstance.show(); // Abre o modal
    };

    window.excluirMaterial = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este material?')) return;
        try {
            const resp = await fetch(`${BASE_URL_BACKEND}/api/materiais/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (!resp.ok) throw new Error('Falha ao excluir!');
            showAlert('Material excluído com sucesso.', 'success');
            carregarMateriais();
        } catch {
            showAlert('Erro ao excluir material.', 'danger');
        }
    };

    // FUNÇÃO PRINCIPAL DE EDIÇÃO
    editarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = editId.value;
        const novaImagem = editFileInput.files[0];

        const formData = new FormData();

        const dadosTexto = {
            Titulo: editTitulo.value.trim(),
            Descricao: editDescricao.value.trim(),
            TipoMaterial: editTipo.value.trim(),
            EstadoConservacao: editConservacao.value.trim(),
            Categoria: editCategoria.value.trim(),
            Autor: editAutor.value.trim(),
            Objetivo: editObj.value,
            Localizacao: editLocalizacao.value.trim(),
            Disponibilidade: editDisponibilidade.checked
        };

        // Adiciona todos os campos de texto
        Object.keys(dadosTexto).forEach(key => {
            const valor = (key === 'Disponibilidade') ? String(dadosTexto[key]) : dadosTexto[key];
            formData.append(key, valor);
        });

        // Adiciona a imagem SE existir
        if (novaImagem) {
            formData.append('Imagem', novaImagem);
        }

        try {
            // Usamos sempre a rota POST que lida com o multer, pois é mais robusta.
            const resp = await fetch(`${BASE_URL_BACKEND}/api/materiais/atualizar/${id}`, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData
            });

            if (!resp.ok) {
                const erroObj = await resp.json().catch(() => ({}));
                throw new Error(erroObj.message || `Erro ao salvar alterações! (Status: ${resp.status})`);
            }

            // Fecha o modal (usando getInstance para pegar a instância existente)
            const modalElement = document.getElementById('modalEditar');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            showAlert('Material alterado com sucesso.', 'success');
            carregarMateriais();

        } catch (err) {
            showAlert(err.message, 'danger');
        }
    });

    editFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                editImgPreview.src = ev.target.result;
                editImgPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            const mat = materiaisData.find(x => x.Id_Material == editId.value);
            if (mat && mat.Imagem) {
                editImgPreview.src = getImageUrl(mat.Imagem);
            } else {
                editImgPreview.src = '';
                editImgPreview.style.display = 'none';
            }
        }
    });

    function showAlert(message, type) {
        showToast(message, type === 'danger' ? 'error' : 'success');
    }

    // ===========================================
    // 3. LÓGICA DE LOGOUT (Mantida)
    // ===========================================
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Inicia o carregamento dos dados se o usuário estiver autenticado
    carregarMateriais();
});