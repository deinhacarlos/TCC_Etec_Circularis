import chatService from '../services/chatService.js';

async function criarChat(req, res) {
  try {
    const resultado = await chatService.criarChat(req.body);
    
    if (resultado.existente) {
      return res.status(200).json(resultado);
    }
    
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (criarChat):", error.message);
    
    if (error.message.includes('são obrigatórios') || 
        error.message.includes('não é possível criar') ||
        error.message.includes('não foram encontrados')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar criar chat.",
      erro: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const chat = await chatService.buscarChatPorId(id);
    return res.status(200).json(chat);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (buscarPorId):", error.message);
    
    if (error.message === 'Chat não encontrado.') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao buscar chat.",
      erro: error.message
    });
  }
}

async function listarChats(req, res) {
  try {
    const filtros = {
      usuario_id: req.query.usuario_id,
      ativo: req.query.ativo === 'true' ? true : 
             req.query.ativo === 'false' ? false : undefined,
      limite: req.query.limite,
      offset: req.query.offset
    };

    // Remover propriedades undefined
    Object.keys(filtros).forEach(key => {
      if (filtros[key] === undefined) {
        delete filtros[key];
      }
    });

    const chats = await chatService.listarChats(filtros);
    return res.status(200).json(chats);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (listarChats):", error.message);
    return res.status(500).json({
      message: "Erro interno do servidor ao listar chats.",
      erro: error.message
    });
  }
}

async function atualizarChat(req, res) {
  try {
    const { id } = req.params;
    const dadosParaAtualizar = req.body;
    
    const resultado = await chatService.atualizarChat(id, dadosParaAtualizar);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (atualizarChat):", error.message);
    
    if (error.message.includes('Chat não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Nenhum dado válido')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar atualizar chat.",
      erro: error.message
    });
  }
}

async function desativarChat(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await chatService.desativarChat(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (desativarChat):", error.message);
    
    if (error.message.includes('Chat não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao desativar chat.",
      erro: error.message
    });
  }
}

async function excluirChat(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await chatService.excluirChat(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (excluirChat):", error.message);
    
    if (error.message.includes('Chat não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao excluir chat.",
      erro: error.message
    });
  }
}

const chatController = {
  criarChat,
  buscarPorId,
  listarChats,
  atualizarChat,
  desativarChat,
  excluirChat
};

export default chatController;
