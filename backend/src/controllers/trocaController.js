import trocaService from '../services/trocaService.js';

async function criarTroca(req, res) {
  try {
    const resultado = await trocaService.criarTroca(req.body);
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (criarTroca):", error.message);
    
    if (error.message.includes('são obrigatórios') || 
        error.message.includes('não pode solicitar') ||
        error.message.includes('não encontrado') ||
        error.message.includes('não está disponível') ||
        error.message.includes('não é o proprietário')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar criar troca.",
      erro: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const troca = await trocaService.buscarTrocaPorId(id);
    return res.status(200).json(troca);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (buscarPorId):", error.message);
    
    if (error.message === 'Troca não encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao buscar troca.",
      erro: error.message
    });
  }
}

async function listarTrocas(req, res) {
  try {
    const filtros = {
      usuario_solicitante_id: req.query.usuario_solicitante_id,
      usuario_doador_id: req.query.usuario_doador_id,
      material_id: req.query.material_id,
      concluida: req.query.concluida === 'true' ? true : 
                 req.query.concluida === 'false' ? false : undefined,
      limite: req.query.limite,
      offset: req.query.offset
    };

    // Remover propriedades undefined
    Object.keys(filtros).forEach(key => {
      if (filtros[key] === undefined) {
        delete filtros[key];
      }
    });

    const trocas = await trocaService.listarTrocas(filtros);
    return res.status(200).json(trocas);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (listarTrocas):", error.message);
    return res.status(500).json({
      message: "Erro interno do servidor ao listar trocas.",
      erro: error.message
    });
  }
}

async function atualizarTroca(req, res) {
  try {
    const { id } = req.params;
    const dadosParaAtualizar = req.body;
    
    const resultado = await trocaService.atualizarTroca(id, dadosParaAtualizar);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (atualizarTroca):", error.message);
    
    if (error.message.includes('Troca não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Nenhum dado válido')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar atualizar troca.",
      erro: error.message
    });
  }
}

async function concluirTroca(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await trocaService.concluirTroca(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (concluirTroca):", error.message);
    
    if (error.message.includes('Troca não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('já foi concluída')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao concluir troca.",
      erro: error.message
    });
  }
}

async function cancelarTroca(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await trocaService.cancelarTroca(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (cancelarTroca):", error.message);
    
    if (error.message.includes('Troca não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Não é possível cancelar')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao cancelar troca.",
      erro: error.message
    });
  }
}

const trocaController = {
  criarTroca,
  buscarPorId,
  listarTrocas,
  atualizarTroca,
  concluirTroca,
  cancelarTroca
};

export default trocaController;
