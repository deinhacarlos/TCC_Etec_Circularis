import usuarioService from '../services/usuarioService.js';

async function cadastrarUsuario(req, res) {
  try {
    const { Nome, Email, Senha } = req.body;
    const FotoPerfil = req.file ? req.file.filename : null;

    const resultado = await usuarioService.cadastrarUsuario({
      NomeCompleto: Nome,
      Email,
      Senha,
      FotoPerfil
    });

    res.status(201).json({
      message: 'Cadastro realizado! Verifique seu e-mail para ativar a conta.', // MENSAGEM ATUALIZADA
      userId: resultado.id
    });
  } catch (error) {
    console.error("ERRO NO CONTROLLER (cadastrarUsuario):", error.message);
    if (error.message.includes('E-mail já cadastrado')) {
      return res.status(409).json({ message: "E-mail já cadastrado.", error: error.message });
    }
    res.status(500).json({ message: 'Erro ao cadastrar usuário.', erro: error.message });
  }
}

// NOVA FUNÇÃO
async function confirmarConta(req, res) {
  try {
    // Espera receber o token via Query String: /confirmar-conta?token=ABC...
    const { token } = req.query; 
    
    if (!token) {
      return res.status(400).json({ message: "Token de confirmação não fornecido." });
    }

    const resultado = await usuarioService.confirmarConta(token);
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (confirmarConta):", error.message);
    return res.status(400).json({ 
      message: "Não foi possível confirmar a conta.", 
      erro: error.message 
    });
  }
}

async function loginUsuario(req, res) {
  try {
    const resultado = await usuarioService.loginUsuario(req.body);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (loginUsuario):", error.message);
    
    // Tratamento para conta não confirmada
    if (error.message.includes('confirme seu e-mail')) {
      return res.status(403).json({ // 403 Forbidden
        message: "Conta inativa. Verifique seu e-mail.",
        error: error.message
      });
    }

    if (error.message.includes('Credenciais inválidas') || error.message.includes('Senha incorreta') || error.message.includes('Usuário não encontrado')) {
      return res.status(401).json({
        message: "E-mail ou senha incorretos.",
        error: error.message
      });
    }

    return res.status(500).json({
      message: "Erro interno do servidor ao tentar fazer login.",
      erro: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params; 
    
    // Verificação rigorosa do ID
    if (!id || id === 'undefined' || id === 'null') {
        return res.status(400).json({ message: "ID de usuário inválido." });
    }

    const usuario = await usuarioService.buscarUsuarioPorId(id);
    
    // Se o serviço retornar vazio (o que não deveria acontecer pois ele lança erro, mas por segurança)
    if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado no banco de dados." });
    }

    return res.status(200).json(usuario);

  } catch (error) {
    console.error("ERRO NO CONTROLLER (buscarPorId):", error.message);
    
    // Tratamento específico para usuário não encontrado
    if (error.message === 'Usuário não encontrado.') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ message: "Erro interno.", erro: error.message });
  }
}

async function listarUsuarios(req, res) {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (listarUsuarios):", error.message);
    return res.status(500).json({ message: "Erro interno.", erro: error.message });
  }
}

async function atualizarUsuario(req, res) {
  try {
    const id = req.params.id;
    const dadosParaAtualizar = req.body;

    if ("FotoPerfil" in dadosParaAtualizar && dadosParaAtualizar.FotoPerfil.trim() === "") {
      delete dadosParaAtualizar.FotoPerfil;
    }

    const resultado = await usuarioService.atualizarUsuario(id, dadosParaAtualizar);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER atualizarUsuario:", error.message);
    if (error.message.includes("Usurio no encontrado"))
      return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: "Erro interno.", error: error.message });
  }
}

async function atualizarFoto(req, res) {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "Nenhuma imagem foi enviada." });
    }
    const novaFoto = req.file.filename;
    const resultado = await usuarioService.atualizarUsuario(id, { FotoPerfil: novaFoto });
    return res.status(200).json({ message: "Foto atualizada!", foto: novaFoto, resultado });
  } catch (error) {
    console.error("ERRO NO CONTROLLER (atualizarFoto):", error.message);
    return res.status(500).json({ message: "Erro interno.", erro: error.message });
  }
}

async function atualizarSenha(req, res) {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;
    const resultado = await usuarioService.atualizarSenha(id, senhaAtual, novaSenha);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (atualizarSenha):", error.message);
    if (error.message.includes('Usuário não encontrado')) return res.status(404).json({ message: error.message });
    if (error.message.includes('Senha atual incorreta') || error.message.includes('senha deve ter pelo menos')) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Erro interno.", erro: error.message });
  }
}

async function solicitarRecuperacaoSenha(req, res) {
  try {
    const { email } = req.body;
    if (!email || email.trim() === '') { return res.status(400).json({ message: "Email é obrigatório." }); }
    
    await usuarioService.solicitarRecuperacaoSenha(email);
    
    return res.status(200).json({ message: "Se o email estiver cadastrado, você receberá instruções para redefinir sua senha." });
  } catch (error) {
    console.error("ERRO NO CONTROLLER (solicitarRecuperacaoSenha):", error.message);
    return res.status(200).json({ message: "Se o email estiver cadastrado, você receberá instruções para redefinir sua senha." });
  }
}

async function redefinirSenha(req, res) {
  try {
    const { token } = req.params;
    const { novaSenha } = req.body;
    
    if (!novaSenha || novaSenha.trim() === '') { return res.status(400).json({ message: "Nova senha é obrigatória." }); }
    
    const resultado = await usuarioService.redefinirSenha(token, novaSenha);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (redefinirSenha):", error.message);
    if (error.message.includes('Token inválido') || error.message.includes('Token expirado') || error.message.includes('não encontrado')) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }
    if (error.message.includes('senha deve ter pelo menos')) { return res.status(400).json({ message: error.message }); }
    return res.status(500).json({ message: "Erro interno.", erro: error.message });
  }
}

async function validarToken(req, res) {
  try {
    const { token } = req.params;
    await usuarioService.validarTokenRecuperacao(token);
    return res.status(200).json({ valido: true, message: "Token válido." });
  } catch (error) {
    console.error("ERRO NO CONTROLLER (validarToken):", error.message);
    if (error.message.includes('Token inválido') || error.message.includes('Token expirado') || error.message.includes('não encontrado')) {
      return res.status(400).json({ valido: false, message: "Token inválido ou expirado." });
    }
    return res.status(500).json({ valido: false, message: "Erro interno.", erro: error.message });
  }
}

async function desativarUsuario(req, res) {
  try {
    const { id } = req.params;
    const resultado = await usuarioService.desativarUsuario(id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (desativarUsuario):", error.message);
    if (error.message.includes('Usuário não encontrado')) return res.status(404).json({ message: error.message });
    if (error.message.includes('já está desativado')) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Erro interno.", erro: error.message });
  }
}

async function reativarUsuario(req, res) {
  try {
    const { id } = req.params;
    const resultado = await usuarioService.reativarUsuario(id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (reativarUsuario):", error.message);
    if (error.message.includes('Usuário não encontrado')) return res.status(404).json({ message: error.message });
    if (error.message.includes('já está ativo')) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Erro interno.", erro: error.message });
  }
}

async function excluirUsuarioPermanente(req, res) {
  try {
    const { id } = req.params;
    const resultado = await usuarioService.excluirUsuarioPermanente(id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO CONTROLLER (excluirUsuarioPermanente):", error.message);
    if (error.message.includes('Usuário não encontrado')) return res.status(404).json({ message: error.message });
    if (error.message.includes('registros relacionados') || error.message.includes('Use a desativação')) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Erro interno.", erro: error.message });
  }
}

const usuarioController = {
  cadastrarUsuario,
  confirmarConta, // NOVA FUNÇÃO EXPORTADA
  loginUsuario,
  buscarPorId,
  listarUsuarios,
  atualizarUsuario,
  atualizarSenha,
  solicitarRecuperacaoSenha,
  redefinirSenha,
  validarToken,
  desativarUsuario,
  reativarUsuario,
  excluirUsuarioPermanente,
  atualizarFoto 
};

export default usuarioController;