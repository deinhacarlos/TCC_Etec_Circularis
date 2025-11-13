import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function cadastrarUsuario(dados) {
  const { NomeCompleto, Email, Senha, Telefone, FotoPerfil } = dados;
  if (!NomeCompleto || !Email || !Senha || !FotoPerfil) {
    throw new Error("Nome, Email, Senha e Foto do perfil são obrigatórios.");
  }

  const senhaCriptografada = await bcrypt.hash(Senha, 10);

  try {
    const [resultado] = await pool.query(
      'INSERT INTO Usuario (Nome_Completo, Email, Telefone, Senha, DataNascimento, Endereco, FotoPerfil, Tipo_Usuario, Status, DataCadastro, PontosRanking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        NomeCompleto, Email, Telefone, senhaCriptografada,
        null,         // DataNascimento
        null,         // Endereco
        FotoPerfil,   // FotoPerfil, aqui vem o nome do arquivo!
        'comum', 1, new Date(), 0
      ]

    );
    return { id: resultado.insertId };
  } catch (error) {
    console.error("ERRO NO SERVICE (cadastrarUsuario):", error);
    throw new Error("Erro ao inserir usuário no banco de dados.");
  }
}

async function loginUsuario(dados) {
  const { Email, Senha } = dados;

  if (!Email || !Senha) {
    throw new Error('Email e Senha são obrigatórios.');
  }

  try {
    const [rows] = await pool.query('SELECT Id_Usuario, Nome_Completo, Email, Senha FROM Usuario WHERE Email = ?', [Email]);
    const usuario = rows[0];

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    const senhaCorreta = await bcrypt.compare(Senha, usuario.Senha);

    if (!senhaCorreta) {
      throw new Error('Senha incorreta.');
    }

    const token = jwt.sign(
      { id: usuario.Id_Usuario, email: usuario.Email },
      process.env.JWT_SEGREDO,
      { expiresIn: '1h' }
    );

    return { token, userId: usuario.Id_Usuario, nome: usuario.Nome_Completo };

  } catch (error) {
    console.error("ERRO NO SERVICE (loginUsuario):", error);
    throw new Error(error.message || "Erro ao realizar login.");
  }
}

async function buscarUsuarioPorId(id) {
  try {
    const [rows] = await pool.query('SELECT Id_Usuario, Nome_Completo, Email, Telefone, DataNascimento, Endereco, FotoPerfil, Tipo_Usuario, Status, DataCadastro, PontosRanking FROM Usuario WHERE Id_Usuario = ?', [id]);
    const usuario = rows[0];

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }
    return usuario;
  } catch (error) {
    console.error("ERRO NO SERVICE (buscarUsuarioPorId):", error);
    throw new Error("Erro ao buscar usuário no banco de dados.");
  }
}

// Listar Usuários
async function listarUsuarios() {
  try {
    const [rows] = await pool.query(
      'SELECT Id_Usuario, Nome_Completo, Email, Telefone, DataNascimento, Endereco, FotoPerfil, Tipo_Usuario, Status, DataCadastro, PontosRanking FROM Usuario'
    );
    return rows;
  } catch (error) {
    console.error("ERRO NO SERVICE (listarUsuarios):", error);
    throw new Error("Erro ao listar usuários no banco de dados.");
  }
}


async function atualizarUsuario(id, dadosParaAtualizar) {
  const { Nome_Completo, Email, Telefone, DataNascimento, Endereco, FotoPerfil, Tipo_Usuario, Status, PontosRanking } = dadosParaAtualizar;

  // Lógica para construir a query de forma dinâmica, apenas com os campos que foram enviados
  const campos = [];
  const valores = [];

  if (Nome_Completo) {
    campos.push('Nome_Completo = ?');
    valores.push(Nome_Completo);
  }
  if (Email) {
    campos.push('Email = ?');
    valores.push(Email);
  }
  if (Telefone) {
    campos.push('Telefone = ?');
    valores.push(Telefone);
  }
  if (DataNascimento) {
    campos.push('DataNascimento = ?');
    valores.push(DataNascimento);
  }
  if (Endereco) {
    campos.push('Endereco = ?');
    valores.push(Endereco);
  }
  if (FotoPerfil) {
    campos.push('FotoPerfil = ?');
    valores.push(FotoPerfil);
  }
  if (Tipo_Usuario) {
    campos.push('Tipo_Usuario = ?');
    valores.push(Tipo_Usuario);
  }
  if (Status !== undefined) {
    campos.push('Status = ?');
    valores.push(Status);
  }
  if (PontosRanking !== undefined) {
    campos.push('PontosRanking = ?');
    valores.push(PontosRanking);
  }

  if (campos.length === 0) {
    throw new Error('Nenhum dado válido fornecido para atualização.');
  }

  // Adiciona o ID ao final dos valores para a cláusula WHERE
  valores.push(id);

  try {
    const query = `UPDATE Usuario SET ${campos.join(', ')} WHERE Id_Usuario = ?`;
    const [resultado] = await pool.query(query, valores);

    if (resultado.affectedRows === 0) {
      throw new Error('Usuário não encontrado ou nenhum dado alterado.');
    }

    return { message: 'Usuário atualizado com sucesso!', affectedRows: resultado.affectedRows };
  } catch (error) {
    console.error("ERRO NO SERVICE (atualizarUsuario):", error);
    throw new Error(error.message || "Erro ao atualizar usuário no banco de dados.");
  }
}

async function atualizarSenha(id, senhaAtual, novaSenha) {
  if (!senhaAtual || !novaSenha) {
    throw new Error('Senha atual e nova senha são obrigatórias.');
  }

  if (novaSenha.length < 6) {
    throw new Error('A nova senha deve ter pelo menos 6 caracteres.');
  }

  try {
    // Buscar a senha atual do usuário
    const [rows] = await pool.query('SELECT Senha FROM Usuario WHERE Id_Usuario = ?', [id]);
    const usuario = rows[0];

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    // Verificar se a senha atual está correta
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.Senha);
    if (!senhaCorreta) {
      throw new Error('Senha atual incorreta.');
    }

    // Criptografar a nova senha
    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);

    // Atualizar no banco
    const [resultado] = await pool.query(
      'UPDATE Usuario SET Senha = ? WHERE Id_Usuario = ?',
      [novaSenhaCriptografada, id]
    );

    if (resultado.affectedRows === 0) {
      throw new Error('Erro ao atualizar senha.');
    }

    return { message: 'Senha atualizada com sucesso!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (atualizarSenha):", error);
    throw new Error(error.message || "Erro ao atualizar senha no banco de dados.");
  }
}

async function desativarUsuario(id) {
  try {
    // Verificar se o usuário existe
    const [rows] = await pool.query('SELECT Status FROM Usuario WHERE Id_Usuario = ?', [id]);
    const usuario = rows[0];

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    if (usuario.Status === 0) {
      throw new Error('Usuário já está desativado.');
    }

    // Desativar usuário (soft delete)
    const [resultado] = await pool.query(
      'UPDATE Usuario SET Status = 0 WHERE Id_Usuario = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      throw new Error('Erro ao desativar usuário.');
    }

    return { message: 'Usuário desativado com sucesso!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (desativarUsuario):", error);
    throw new Error(error.message || "Erro ao desativar usuário no banco de dados.");
  }
}

async function reativarUsuario(id) {
  try {
    // Verificar se o usuário existe
    const [rows] = await pool.query('SELECT Status FROM Usuario WHERE Id_Usuario = ?', [id]);
    const usuario = rows[0];

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    if (usuario.Status === 1) {
      throw new Error('Usuário já está ativo.');
    }

    // Reativar usuário
    const [resultado] = await pool.query(
      'UPDATE Usuario SET Status = 1 WHERE Id_Usuario = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      throw new Error('Erro ao reativar usuário.');
    }

    return { message: 'Usuário reativado com sucesso!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (reativarUsuario):", error);
    throw new Error(error.message || "Erro ao reativar usuário no banco de dados.");
  }
}

async function excluirUsuarioPermanente(id) {
  try {
    // Verificar se o usuário existe
    const [userCheck] = await pool.query('SELECT Id_Usuario FROM Usuario WHERE Id_Usuario = ?', [id]);

    if (userCheck.length === 0) {
      throw new Error('Usuário não encontrado.');
    }

    // Verificar dependências - materiais
    const [materiais] = await pool.query(
      'SELECT COUNT(*) as count FROM Material WHERE Id_Usuario_FK = ?',
      [id]
    );

    // Verificar dependências - trocas
    const [trocas] = await pool.query(
      'SELECT COUNT(*) as count FROM Troca WHERE Id_Usuario_Solicitante_FK = ? OR Id_Usuario_Doador_FK = ?',
      [id, id]
    );

    if (materiais[0].count > 0 || trocas[0].count > 0) {
      throw new Error(`Não é possível excluir usuário com registros relacionados. Materiais: ${materiais[0].count}, Trocas: ${trocas[0].count}. Use a desativação.`);
    }

    // Excluir permanentemente
    const [resultado] = await pool.query('DELETE FROM Usuario WHERE Id_Usuario = ?', [id]);

    if (resultado.affectedRows === 0) {
      throw new Error('Erro ao excluir usuário.');
    }

    return { message: 'Usuário excluído permanentemente!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (excluirUsuarioPermanente):", error);

    // Tratamento específico para constraints de FK
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new Error('Não é possível excluir usuário com registros relacionados. Use a desativação.');
    }

    throw new Error(error.message || "Erro ao excluir usuário do banco de dados.");
  }
}

const usuarioService = {
  cadastrarUsuario,
  loginUsuario,
  buscarUsuarioPorId,
  atualizarUsuario,
  atualizarSenha,
  desativarUsuario,
  reativarUsuario,
  excluirUsuarioPermanente,
  listarUsuarios
};

export default usuarioService;

