import usuarioService from '../services/usuarioService.js';

async function cadastrarUsuario(req, res) {
  try {
    const { NomeCompleto, Email, Senha, Telefone } = req.body;
    const FotoPerfil = req.file ? req.file.filename : null; // pegar nome do arquivo

    // Passar para service para salvar no banco
    const resultado = await usuarioService.cadastrarUsuario({
      NomeCompleto,
      Email,
      Senha,
      Telefone,
      FotoPerfil
    });

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      userId: resultado.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário.', erro: error.message });
  }
}


async function loginUsuario(req, res) {
  try {
    const resultado = await usuarioService.loginUsuario(req.body);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (loginUsuario):", error.message);
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar fazer login.",
      erro: error.message
    });
  }
}

// Buscar usuário por ID
async function buscarPorId(req, res) {
  try {
    const { id } = req.params; 
    const usuario = await usuarioService.buscarUsuarioPorId(id);
    return res.status(200).json(usuario);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (buscarPorId):", error.message);
    if (error.message === 'Usuário não encontrado.') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Erro interno do servidor ao buscar usuário.",
      erro: error.message
    });
  }
}

// Atualizar dados do usuário
async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params; 
    const dadosParaAtualizar = req.body;
    if (dadosParaAtualizar.FotoPerfil && dadosParaAtualizar.FotoPerfil.trim() === "") {
      return res.status(400).json({ message: "Foto do perfil é obrigatória." });
    }
    const resultado = await usuarioService.atualizarUsuario(id, dadosParaAtualizar);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (atualizarUsuario):", error.message);
    if (error.message.includes('Usuário não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar atualizar.",
      erro: error.message
    });
  }
}

// Atualizar senha (usuário autenticado)
async function atualizarSenha(req, res) {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;
    
    const resultado = await usuarioService.atualizarSenha(id, senhaAtual, novaSenha);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (atualizarSenha):", error.message);
    
    if (error.message.includes('Usuário não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Senha atual incorreta') || 
        error.message.includes('senha deve ter pelo menos')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar atualizar senha.",
      erro: error.message
    });
  }
}

// Solicitar recuperação de senha (envia email)
async function solicitarRecuperacaoSenha(req, res) {
  try {
    const { email } = req.body;
    
    // Validação básica
    if (!email || email.trim() === '') {
      return res.status(400).json({ 
        message: "Email é obrigatório." 
      });
    }
    
    await usuarioService.solicitarRecuperacaoSenha(email);
    
    // Por segurança, sempre retorna sucesso mesmo se email não existir
    // (evita que atacantes descubram emails cadastrados)
    return res.status(200).json({
      message: "Se o email estiver cadastrado, você receberá instruções para redefinir sua senha."
    });
  } catch (error) {
    console.error("ERRO NO CONTROLLER (solicitarRecuperacaoSenha):", error.message);
    
    // Por segurança, não revela se houve erro específico
    return res.status(200).json({
      message: "Se o email estiver cadastrado, você receberá instruções para redefinir sua senha."
    });
  }
}

// Redefinir senha com token (recebido por email)
async function redefinirSenha(req, res) {
  try {
    const { token } = req.params;
    const { novaSenha } = req.body;
    
    // Validação básica
    if (!novaSenha || novaSenha.trim() === '') {
      return res.status(400).json({ 
        message: "Nova senha é obrigatória." 
      });
    }
    
    const resultado = await usuarioService.redefinirSenha(token, novaSenha);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (redefinirSenha):", error.message);
    
    if (error.message.includes('Token inválido') || 
        error.message.includes('Token expirado') ||
        error.message.includes('não encontrado')) {
      return res.status(400).json({ 
        message: "Token inválido ou expirado. Solicite uma nova recuperação de senha." 
      });
    }
    
    if (error.message.includes('senha deve ter pelo menos')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar redefinir senha.",
      erro: error.message
    });
  }
}

// Validar token de recuperação (antes de redefinir)
async function validarToken(req, res) {
  try {
    const { token } = req.params;
    
    await usuarioService.validarTokenRecuperacao(token);
    
    return res.status(200).json({
      valido: true,
      message: "Token válido."
    });
  } catch (error) {
    console.error("ERRO NO CONTROLLER (validarToken):", error.message);
    
    if (error.message.includes('Token inválido') || 
        error.message.includes('Token expirado') ||
        error.message.includes('não encontrado')) {
      return res.status(400).json({ 
        valido: false,
        message: "Token inválido ou expirado." 
      });
    }
    
    return res.status(500).json({
      valido: false,
      message: "Erro interno do servidor ao validar token.",
      erro: error.message
    });
  }
}

// Desativar usuário (soft delete)
async function desativarUsuario(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await usuarioService.desativarUsuario(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (desativarUsuario):", error.message);
    
    if (error.message.includes('Usuário não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('já está desativado')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar desativar usuário.",
      erro: error.message
    });
  }
}

// Reativar usuário
async function reativarUsuario(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await usuarioService.reativarUsuario(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (reativarUsuario):", error.message);
    
    if (error.message.includes('Usuário não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('já está ativo')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar reativar usuário.",
      erro: error.message
    });
  }
}

// Excluir usuário permanentemente (hard delete)
async function excluirUsuarioPermanente(req, res) {
  try {
    const { id } = req.params;
    
    const resultado = await usuarioService.excluirUsuarioPermanente(id);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (excluirUsuarioPermanente):", error.message);
    
    if (error.message.includes('Usuário não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('registros relacionados') || 
        error.message.includes('Use a desativação')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Erro interno do servidor ao tentar excluir usuário.",
      erro: error.message
    });
  }
}

const usuarioController = {
  // Autenticação
  cadastrarUsuario,
  loginUsuario,
  buscarPorId,
  atualizarUsuario,
  atualizarSenha,
  solicitarRecuperacaoSenha,
  redefinirSenha,
  validarToken,
  desativarUsuario,
  reativarUsuario,
  excluirUsuarioPermanente
};

export default usuarioController;
