import materialService from '../services/materialService.js';

// Cadastrar material (POST)
async function cadastrarMaterial(req, res) {
  try {
    // Junta todos os campos de texto do formulário e a imagem se houver
    const dados = {
      ...req.body,
      Imagem: req.file ? req.file.filename : null,
    };
    // Converte para número se necessário (caso venha string do localStorage)
    if (dados.IdUsuarioFK && typeof dados.IdUsuarioFK === 'string') {
      dados.IdUsuarioFK = parseInt(dados.IdUsuarioFK);
    }
    const resultado = await materialService.cadastrarMaterial(dados);
    return res.status(201).json({
      message: 'Material cadastrado com sucesso!',
      materialId: resultado.id,
    });
  } catch (error) {
    console.error("ERRO NO CONTROLLER (cadastrarMaterial):", error.message);
    if (error.message.includes('são obrigatórios')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar cadastrar material.",
      erro: error.message
    });
  }
}

// Buscar material por ID (GET)
async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const material = await materialService.buscarMaterialPorId(id);
    return res.status(200).json(material);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (buscarPorId):", error.message);
    if (error.message === 'Material não encontrado.') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Erro interno do servidor ao buscar material.",
      erro: error.message
    });
  }
}

// Listar materiais (GET com query)
async function listarMateriais(req, res) {
  try {
    // Pegue os filtros exatos que seu frontend pode passar
    const filtros = {
      disponibilidade: req.query.disponibilidade === 'true' ? true :
        req.query.disponibilidade === 'false' ? false : undefined,
      TipoMaterial: req.query.TipoMaterial,
      Categoria: req.query.Categoria,
      EstadoConservacao: req.query.EstadoConservacao,
      usuarioid: req.query.usuarioid, // O frontend manda ?usuarioid=2
      busca: req.query.busca,
      limite: req.query.limite,
      offset: req.query.offset
    };
    Object.keys(filtros).forEach(key => {
      if (filtros[key] === undefined) delete filtros[key];
    });

    const materiais = await materialService.listarMateriais(filtros);
    return res.status(200).json(materiais);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (listarMateriais):", error.message);
    return res.status(500).json({
      message: "Erro interno do servidor ao listar materiais.",
      erro: error.message
    });
  }
}

// Atualizar material (PUT)
async function atualizarMaterial(req, res) {
  try {
    const id = req.params.id;
    // Junta todos os campos do form, e a imagem se enviada
    let dadosParaAtualizar = {
      ...req.body,
      Imagem: req.file ? req.file.filename : undefined
    };

    console.log("RECEBIDO PARA ATUALIZAR:", req.body, req.file);

    // Converte Disponibilidade de string ('true'/'false') para booleano
    if (dadosParaAtualizar.Disponibilidade !== undefined && typeof dadosParaAtualizar.Disponibilidade === 'string') {
      dadosParaAtualizar.Disponibilidade = dadosParaAtualizar.Disponibilidade === 'true';
    }

    // Remove campos indefinidos, nulos ou strings vazias, exceto o booleano Disponibilidade
    Object.keys(dadosParaAtualizar).forEach(key => {
      const valor = dadosParaAtualizar[key];
      // Mantém se for booleano, ou se tiver valor (não undefined, não null, e não string vazia)
      if (valor === undefined || valor === null || (typeof valor === 'string' && valor.trim() === '')) {
        delete dadosParaAtualizar[key];
      }
    });

    console.log('dadosParaAtualizar (após limpeza):', dadosParaAtualizar);

    // Se após a limpeza restar apenas a chave 'Disponibilidade', ela é um dado válido.
    // Se restar apenas 'Imagem', ela é um dado válido.
    if (Object.keys(dadosParaAtualizar).length === 0) {
      throw new Error('Nenhum dado válido fornecido para atualização.');
    }

    const resultado = await materialService.atualizarMaterial(id, dadosParaAtualizar);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (atualizarMaterial):", error.message);
    if (error.message.includes('Material não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Nenhum dado válido')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar atualizar material.",
      erro: error.message
    });
  }
}

// Excluir material (DELETE)
async function excluirMaterial(req, res) {
  try {
    const { id } = req.params;
    const resultado = await materialService.excluirMaterial(id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (excluirMaterial):", error.message);
    if (error.message.includes('Material não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('trocas relacionadas') ||
      error.message.includes('registros relacionados')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar excluir material.",
      erro: error.message
    });
  }
}

// Alterar disponibilidade (PATCH)
async function alterarDisponibilidade(req, res) {
  try {
    const { id } = req.params;
    const { disponibilidade } = req.body;
    if (disponibilidade === undefined) {
      return res.status(400).json({
        message: 'Disponibilidade é obrigatória (true ou false)'
      });
    }
    const resultado = await materialService.alterarDisponibilidade(id, disponibilidade);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (alterarDisponibilidade):", error.message);
    if (error.message.includes('Material não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Erro interno do servidor ao alterar disponibilidade.",
      erro: error.message
    });
  }
}

const materialController = {
  cadastrarMaterial,
  buscarPorId,
  listarMateriais,
  atualizarMaterial,
  excluirMaterial,
  alterarDisponibilidade
};

export default materialController;