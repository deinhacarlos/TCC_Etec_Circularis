import mensagemService from '../services/mensagemService.js';

async function enviarMensagem(req, res) {
  try {
    const resultado = await mensagemService.enviarMensagem(req.body);
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (enviarMensagem):", error.message);
    
    if (error.message.includes('são obrigatórios') || 
        error.message.includes('não encontrado') ||
        error.message.includes('desativado') ||
        error.message.includes('não participa')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar enviar mensagem.",
      erro: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const mensagem = await mensagemService.buscarMensagemPorId(id);
    return res.status(200).json(mensagem);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (buscarPorId):", error.message);
    
    if (error.message === 'Mensagem não encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao buscar mensagem.",
      erro: error.message
    });
  }
}

async function listarMensagens(req, res) {
  try {
    const filtros = {
      chat_id: req.query.chat_id,
      usuario_remetente_id: req.query.usuario_remetente_id,
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

    const mensagens = await mensagemService.listarMensagens(filtros);
    return res.status(200).json(mensagens);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (listarMensagens):", error.message);
    return res.status(500).json({
      message: "Erro interno do servidor ao listar mensagens.",
      erro: error.message
    });
  }
}

async function marcarComoLida(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await mensagemService.marcarComoLida(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (marcarComoLida):", error.message);
    
    if (error.message.includes('Mensagem não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao marcar mensagem como lida.",
      erro: error.message
    });
  }
}

async function marcarTodasComoLidas(req, res) {
  try {
    const { chat_id } = req.params;
    const { usuario_id } = req.body;

    if (!usuario_id) {
      return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
    }
    
    const resultado = await mensagemService.marcarTodasComoLidas(chat_id, usuario_id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (marcarTodasComoLidas):", error.message);
    
    return res.status(500).json({
      message: "Erro interno do servidor ao marcar todas as mensagens como lidas.",
      erro: error.message
    });
  }
}

async function excluirMensagem(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await mensagemService.excluirMensagem(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (excluirMensagem):", error.message);
    
    if (error.message.includes('Mensagem não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao excluir mensagem.",
      erro: error.message
    });
  }
}

async function contarNaoLidas(req, res) {
  try {
    const { chat_id, usuario_id } = req.params;
    
    const resultado = await mensagemService.contarNaoLidas(chat_id, usuario_id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (contarNaoLidas):", error.message);
    
    return res.status(500).json({
      message: "Erro interno do servidor ao contar mensagens não lidas.",
      erro: error.message
    });
  }
}

const mensagemController = {
  enviarMensagem,
  buscarPorId,
  listarMensagens,
  marcarComoLida,
  marcarTodasComoLidas,
  excluirMensagem,
  contarNaoLidas
};

export default mensagemController;
