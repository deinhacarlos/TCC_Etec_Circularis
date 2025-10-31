import notificacaoService from '../services/notificacaoService.js';

async function criarNotificacao(req, res) {
  try {
    const resultado = await notificacaoService.criarNotificacao(req.body);
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (criarNotificacao):", error.message);
    
    if (error.message.includes('são obrigatórios') || 
        error.message.includes('não encontrado')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar criar notificação.",
      erro: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const notificacao = await notificacaoService.buscarNotificacaoPorId(id);
    return res.status(200).json(notificacao);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (buscarPorId):", error.message);
    
    if (error.message === 'Notificação não encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao buscar notificação.",
      erro: error.message
    });
  }
}

async function listarNotificacoes(req, res) {
  try {
    const filtros = {
      usuario_id: req.query.usuario_id,
      tipo_notificacao: req.query.tipo_notificacao,
      lida: req.query.lida === 'true' ? true : 
            req.query.lida === 'false' ? false : undefined,
      limite: req.query.limite,
      offset: req.query.offset
    };

    // Remover propriedades undefined
    Object.keys(filtros).forEach(key => {
      if (filtros[key] === undefined) {
        delete filtros[key];
      }
    });

    const notificacoes = await notificacaoService.listarNotificacoes(filtros);
    return res.status(200).json(notificacoes);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (listarNotificacoes):", error.message);
    return res.status(500).json({
      message: "Erro interno do servidor ao listar notificações.",
      erro: error.message
    });
  }
}

async function atualizarNotificacao(req, res) {
  try {
    const { id } = req.params;
    const dadosParaAtualizar = req.body;
    
    const resultado = await notificacaoService.atualizarNotificacao(id, dadosParaAtualizar);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (atualizarNotificacao):", error.message);
    
    if (error.message.includes('Notificação não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Nenhum dado válido')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar atualizar notificação.",
      erro: error.message
    });
  }
}

async function marcarComoLida(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await notificacaoService.marcarComoLida(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (marcarComoLida):", error.message);
    
    if (error.message.includes('Notificação não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao marcar notificação como lida.",
      erro: error.message
    });
  }
}

async function marcarTodasComoLidas(req, res) {
  try {
    const { usuario_id } = req.params;
    
    const resultado = await notificacaoService.marcarTodasComoLidas(usuario_id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (marcarTodasComoLidas):", error.message);
    
    return res.status(500).json({
      message: "Erro interno do servidor ao marcar todas as notificações como lidas.",
      erro: error.message
    });
  }
}

async function excluirNotificacao(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await notificacaoService.excluirNotificacao(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (excluirNotificacao):", error.message);
    
    if (error.message.includes('Notificação não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao excluir notificação.",
      erro: error.message
    });
  }
}

async function contarNaoLidas(req, res) {
  try {
    const { usuario_id } = req.params;
    
    const resultado = await notificacaoService.contarNaoLidas(usuario_id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (contarNaoLidas):", error.message);
    
    return res.status(500).json({
      message: "Erro interno do servidor ao contar notificações não lidas.",
      erro: error.message
    });
  }
}

const notificacaoController = {
  criarNotificacao,
  buscarPorId,
  listarNotificacoes,
  atualizarNotificacao,
  marcarComoLida,
  marcarTodasComoLidas,
  excluirNotificacao,
  contarNaoLidas
};

export default notificacaoController;
