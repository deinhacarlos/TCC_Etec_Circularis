document.addEventListener('DOMContentLoaded', () => {
  // ==================== VERIFICAÇÃO DE SESSÃO DO USUÁRIO ====================
  if (window.location.pathname.includes('login.html')) return;
  const token = localStorage.getItem('token');
  const usuarioId = localStorage.getItem('usuarioId');
  if (!token || !usuarioId) {
    localStorage.clear();
    window.location.href = 'login.html';
    return;
  }

  // ==================== ELEMENTOS DO DOM ====================
  const materialForm = document.getElementById('materialForm');
  const tipoInput = document.getElementById('tipoMaterial');
  const tituloInput = document.getElementById('tituloMaterial');
  const autorInput = document.getElementById('autorMaterial');
  const categoriaInput = document.getElementById('categoriaMaterial');
  const descricaoInput = document.getElementById('descricaoMaterial');
  const estadoInput = document.getElementById('estadoMaterial');
  const cidadeInput = document.getElementById('cidadeMaterial');
  const fileInput = document.getElementById('fileInput');
  const conservacaoInput = document.getElementById('estadoConservacao');

  const tipoError = document.getElementById('tipoError');
  const tituloError = document.getElementById('tituloError');
  const estadoError = document.getElementById('estadoError');
  const imagemError = document.getElementById('imagemError');
  const conservacaoError = document.getElementById('conservacaoError');
  const btnSelectFile = document.getElementById('btnSelectFile');

  // ==================== VALIDAÇÃO DOS CAMPOS ====================
  function showError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
  function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
  function validateTipo() {
    if (tipoInput.value === '') {
      showError(tipoInput, tipoError, 'Selecione o tipo de material');
      return false;
    }
    showSuccess(tipoInput, tipoError);
    return true;
  }
  function validateTitulo() {
    const val = tituloInput.value.trim();
    if (val === '') {
      showError(tituloInput, tituloError, 'Informe o nome do material');
      return false;
    }
    if (val.length < 3) {
      showError(tituloInput, tituloError, 'O nome deve ter pelo menos 3 caracteres');
      return false;
    }
    showSuccess(tituloInput, tituloError);
    return true;
  }
  function validateEstado() {
    if (estadoInput.value === '') {
      showError(estadoInput, estadoError, 'Selecione o estado');
      return false;
    }
    showSuccess(estadoInput, estadoError);
    return true;
  }
  function validateConservacao() {
    if (conservacaoInput.value === '') {
      showError(conservacaoInput, conservacaoError, 'Selecione o estado de conservação');
      return false;
    }
    showSuccess(conservacaoInput, conservacaoError);
    return true;
  }
  function validateImagem() {
    const file = fileInput.files[0];
    if (!file) {
      showError(fileInput, imagemError, 'É necessário selecionar uma imagem');
      return false;
    }
    if (!file.type.startsWith('image/')) {
      showError(fileInput, imagemError, 'Arquivo inválido. Selecione uma imagem');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError(fileInput, imagemError, 'A imagem deve ter no máximo 5MB');
      return false;
    }
    showSuccess(fileInput, imagemError);
    return true;
  }

  // ==================== EVENT LISTENERS ====================
  tipoInput.addEventListener('blur', validateTipo);
  tituloInput.addEventListener('blur', validateTitulo);
  estadoInput.addEventListener('blur', validateEstado);
  conservacaoInput.addEventListener('blur', validateConservacao);
  fileInput.addEventListener('change', validateImagem);

  btnSelectFile.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        let preview = document.getElementById('imgPreview');
        if (!preview) {
          preview = document.createElement("img");
          preview.id = 'imgPreview';
          preview.style.maxHeight = "120px";
          preview.style.display = "block";
          preview.style.marginTop = "8px";
          fileInput.parentElement.appendChild(preview);
        }
        preview.src = ev.target.result;
      }
      reader.readAsDataURL(file);
    }
  });

  // ==================== SUBMIT DO FORMULÁRIO ====================
  materialForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isTipoValid = validateTipo();
    const isTituloValid = validateTitulo();
    const isEstadoValid = validateEstado();
    const isConservacaoValid = validateConservacao();
    const isImagemValid = validateImagem();

    if (!usuarioId || !token) {
      // SUBSTITUIÇÃO DE ALERT
      showToast("Não foi possível identificar o usuário. Faça login novamente.", "error");
      setTimeout(() => window.location.href = 'login.html', 2000);
      return;
    }

    if (isTipoValid && isTituloValid && isEstadoValid && isConservacaoValid && isImagemValid) {
      const formData = new FormData();
      formData.append('Titulo', tituloInput.value.trim());
      formData.append('Descricao', descricaoInput.value.trim());
      formData.append('TipoMaterial', tipoInput.value.trim());
      formData.append('EstadoConservacao', conservacaoInput.value.trim());
      formData.append('Categoria', categoriaInput.value.trim());
      formData.append('Imagem', fileInput.files[0]);
      
      const cidade = cidadeInput.value.trim();
      const estado = estadoInput.value.trim();
      const localizacaoCompleta = `${cidade}/${estado}`;
        
      formData.append('Localizacao', localizacaoCompleta); 
      formData.append('Objetivo', 'troca'); 
      formData.append('IdUsuarioFK', usuarioId);
      formData.append('Autor', autorInput.value.trim());

      // Feedback visual no botão
      const btnSubmit = materialForm.querySelector('button[type="submit"]');
      const textoOriginal = btnSubmit.innerHTML;
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Cadastrando...";

      try {
        const resp = await fetch('http://localhost:3000/api/materiais', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }, 
          body: formData
        });
        
        if (resp.ok) {
          // SUBSTITUIÇÃO DE ALERT
          showToast("Material cadastrado com sucesso!", "success");
          materialForm.reset();
          const preview = document.getElementById('imgPreview');
          if (preview) preview.remove();
          
          // Opcional: Redirecionar para 'Meus Materiais' após sucesso
          setTimeout(() => window.location.href = 'meusmateriais.html', 1500);

        } else {
          let erroMsg = "Erro ao cadastrar: ";
          try {
            const erroObj = await resp.json();
            erroMsg += erroObj.message || "Tente novamente";
          } catch {
            erroMsg += "Tente novamente.";
          }
          // SUBSTITUIÇÃO DE ALERT
          showToast(erroMsg, "error");
        }
      } catch (error) {
        // SUBSTITUIÇÃO DE ALERT
        showToast("Erro na conexão com o servidor.", "error");
        console.error(error);
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = textoOriginal;
      }
    }
  });
});