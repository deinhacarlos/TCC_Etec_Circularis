import denunciaService from '../services/denunciaService.js';

async function criarDenuncia(req, res) {
  try {
    const resultado = await denunciaService.criarDenuncia(req.body);
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (criarDenuncia):", error.message);
    
    if (error.message.includes('são obrigatórios') || 
        error.message.includes('necessário informar') ||
        error.message.includes('Não é possível denunciar')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar criar denúncia.",
      erro: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const denuncia = await denunciaService.buscarDenunciaPorId(id);
    return res.status(200).json(denuncia);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (buscarPorId):", error.message);
    
    if (error.message === 'Denúncia não encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao buscar denúncia.",
      erro: error.message
    });
  }
}

async function listarDenuncias(req, res) {
  try {
    const filtros = {
      tipo_denuncia: req.query.tipo_denuncia,
      status: req.query.status === 'true' ? true : 
              req.query.status === 'false' ? false : undefined,
      usuario_denunciante_id: req.query.usuario_denunciante_id,
      usuario_denunciado_id: req.query.usuario_denunciado_id,
      material_id: req.query.material_id,
      troca_id: req.query.troca_id,
      limite: req.query.limite,
      offset: req.query.offset
    };

    // Remover propriedades undefined
    Object.keys(filtros).forEach(key => {
      if (filtros[key] === undefined) {
        delete filtros[key];
      }
    });

    const denuncias = await denunciaService.listarDenuncias(filtros);
    return res.status(200).json(denuncias);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (listarDenuncias):", error.message);
    return res.status(500).json({
      message: "Erro interno do servidor ao listar denúncias.",
      erro: error.message
    });
  }
}

async function atualizarDenuncia(req, res) {
  try {
    const { id } = req.params;
    const dadosParaAtualizar = req.body;
    
    const resultado = await denunciaService.atualizarDenuncia(id, dadosParaAtualizar);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (atualizarDenuncia):", error.message);
    
    if (error.message.includes('Denúncia não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Nenhum dado válido')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar atualizar denúncia.",
      erro: error.message
    });
  }
}

async function resolverDenuncia(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await denunciaService.resolverDenuncia(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (resolverDenuncia):", error.message);
    
    if (error.message.includes('Denúncia não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao resolver denúncia.",
      erro: error.message
    });
  }
}

async function excluirDenuncia(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await denunciaService.excluirDenuncia(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (excluirDenuncia):", error.message);
    
    if (error.message.includes('Denúncia não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao excluir denúncia.",
      erro: error.message
    });
  }
}

const denunciaController = {
  criarDenuncia,
  buscarPorId,
  listarDenuncias,
  atualizarDenuncia,
  resolverDenuncia,
  excluirDenuncia
};

export default denunciaController;
