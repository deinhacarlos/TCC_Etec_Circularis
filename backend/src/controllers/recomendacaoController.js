import recomendacaoService from '../services/recomendacaoService.js';

async function criarRecomendacao(req, res) {
  try {
    const resultado = await recomendacaoService.criarRecomendacao(req.body);
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (criarRecomendacao):", error.message);
    
    if (error.message.includes('são obrigatórios') || 
        error.message.includes('não encontrado')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar criar recomendação.",
      erro: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const recomendacao = await recomendacaoService.buscarRecomendacaoPorId(id);
    return res.status(200).json(recomendacao);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (buscarPorId):", error.message);
    
    if (error.message === 'Recomendação não encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao buscar recomendação.",
      erro: error.message
    });
  }
}

async function listarRecomendacoes(req, res) {
  try {
    const filtros = {
      usuario_id: req.query.usuario_id,
      material_id: req.query.material_id,
      apenas_disponiveis: req.query.apenas_disponiveis === 'true',
      limite: req.query.limite,
      offset: req.query.offset
    };

    // Remover propriedades undefined
    Object.keys(filtros).forEach(key => {
      if (filtros[key] === undefined) {
        delete filtros[key];
      }
    });

    const recomendacoes = await recomendacaoService.listarRecomendacoes(filtros);
    return res.status(200).json(recomendacoes);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (listarRecomendacoes):", error.message);
    return res.status(500).json({
      message: "Erro interno do servidor ao listar recomendações.",
      erro: error.message
    });
  }
}

async function atualizarRecomendacao(req, res) {
  try {
    const { id } = req.params;
    const dadosParaAtualizar = req.body;
    
    const resultado = await recomendacaoService.atualizarRecomendacao(id, dadosParaAtualizar);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (atualizarRecomendacao):", error.message);
    
    if (error.message.includes('Recomendação não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Nenhum dado válido')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar atualizar recomendação.",
      erro: error.message
    });
  }
}

async function excluirRecomendacao(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await recomendacaoService.excluirRecomendacao(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (excluirRecomendacao):", error.message);
    
    if (error.message.includes('Recomendação não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao excluir recomendação.",
      erro: error.message
    });
  }
}

async function gerarRecomendacoes(req, res) {
  try {
    const { usuario_id } = req.params;
    
    const resultado = await recomendacaoService.gerarRecomendacoesParaUsuario(usuario_id);
    
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (gerarRecomendacoes):", error.message);
    
    if (error.message.includes('Usuário não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao gerar recomendações.",
      erro: error.message
    });
  }
}

const recomendacaoController = {
  criarRecomendacao,
  buscarPorId,
  listarRecomendacoes,
  atualizarRecomendacao,
  excluirRecomendacao,
  gerarRecomendacoes
};

export default recomendacaoController;
