import materialService from '../services/materialService.js';

async function cadastrarMaterial(req, res) {
  try {
    const resultado = await materialService.cadastrarMaterial(req.body);
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

async function listarMateriais(req, res) {
  try {
    // Extrair filtros da query string
    const filtros = {
      disponibilidade: req.query.disponibilidade === 'true' ? true : 
                     req.query.disponibilidade === 'false' ? false : undefined,
      tipo_material: req.query.tipo_material,
      categoria: req.query.categoria,
      estado_conservacao: req.query.estado_conservacao,
      usuario_id: req.query.usuario_id,
      busca: req.query.busca,
      limite: req.query.limite,
      offset: req.query.offset
    };

    // Remover propriedades undefined
    Object.keys(filtros).forEach(key => {
      if (filtros[key] === undefined) {
        delete filtros[key];
      }
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

async function atualizarMaterial(req, res) {
  try {
    const { id } = req.params;
    const dadosParaAtualizar = req.body;
    
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