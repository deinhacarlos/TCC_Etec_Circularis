import pool from '../config/db.js';

async function criarChat(dados) {
  const { 
    Id_Usuario1_FK,
    Id_Usuario2_FK
  } = dados;

  if (!Id_Usuario1_FK || !Id_Usuario2_FK) {
    throw new Error('Ambos os usuários são obrigatórios para criar um chat.');
  }

  if (Id_Usuario1_FK === Id_Usuario2_FK) {
    throw new Error('Não é possível criar um chat consigo mesmo.');
  }

  try {
    // Verificar se já existe um chat entre esses usuários
    const [chatExistente] = await pool.query(`
      SELECT Id_Chat FROM Chat 
      WHERE (Id_Usuario1_FK = ? AND Id_Usuario2_FK = ?) 
         OR (Id_Usuario1_FK = ? AND Id_Usuario2_FK = ?)
    `, [Id_Usuario1_FK, Id_Usuario2_FK, Id_Usuario2_FK, Id_Usuario1_FK]);

    if (chatExistente.length > 0) {
      return { 
        id: chatExistente[0].Id_Chat, 
        message: 'Chat já existe entre esses usuários.',
        existente: true
      };
    }

    // Verificar se os usuários existem
    const [usuario1] = await pool.query(
      'SELECT Id_Usuario FROM Usuario WHERE Id_Usuario = ?',
      [Id_Usuario1_FK]
    );

    const [usuario2] = await pool.query(
      'SELECT Id_Usuario FROM Usuario WHERE Id_Usuario = ?',
      [Id_Usuario2_FK]
    );

    if (usuario1.length === 0 || usuario2.length === 0) {
      throw new Error('Um ou ambos os usuários não foram encontrados.');
    }

    const [resultado] = await pool.query(
      `INSERT INTO Chat (
        Id_Usuario1_FK, Id_Usuario2_FK, DataCriacao, Ativo
      ) VALUES (?, ?, ?, ?)`,
      [
        Id_Usuario1_FK,
        Id_Usuario2_FK,
        new Date(),
        true
      ]
    );

    return { id: resultado.insertId, message: 'Chat criado com sucesso!', existente: false };
  } catch (error) {
    console.error("ERRO NO SERVICE (criarChat):", error);
    throw new Error(error.message || "Erro ao criar chat no banco de dados.");
  }
}

async function buscarChatPorId(id) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        u1.Nome_Completo as Nome_Usuario1,
        u1.Email as Email_Usuario1,
        u1.FotoPerfil as Foto_Usuario1,
        u2.Nome_Completo as Nome_Usuario2,
        u2.Email as Email_Usuario2,
        u2.FotoPerfil as Foto_Usuario2
      FROM Chat c
      LEFT JOIN Usuario u1 ON c.Id_Usuario1_FK = u1.Id_Usuario
      LEFT JOIN Usuario u2 ON c.Id_Usuario2_FK = u2.Id_Usuario
      WHERE c.Id_Chat = ?
    `, [id]);
    
    const chat = rows[0];

    if (!chat) {
      throw new Error('Chat não encontrado.');
    }
    return chat;
  } catch (error) {
    console.error("ERRO NO SERVICE (buscarChatPorId):", error);
    throw new Error(error.message || "Erro ao buscar chat no banco de dados.");
  }
}

async function listarChats(filtros = {}) {
  try {
    let query = `
      SELECT 
        c.*,
        u1.Nome_Completo as Nome_Usuario1,
        u1.FotoPerfil as Foto_Usuario1,
        u2.Nome_Completo as Nome_Usuario2,
        u2.FotoPerfil as Foto_Usuario2,
        (SELECT COUNT(*) FROM Mensagem WHERE Id_Chat_FK = c.Id_Chat) as Total_Mensagens,
        (SELECT MAX(DataEnvio) FROM Mensagem WHERE Id_Chat_FK = c.Id_Chat) as Ultima_Mensagem_Data
      FROM Chat c
      LEFT JOIN Usuario u1 ON c.Id_Usuario1_FK = u1.Id_Usuario
      LEFT JOIN Usuario u2 ON c.Id_Usuario2_FK = u2.Id_Usuario
      WHERE 1=1
    `;
    const valores = [];

    // Filtrar por usuário (retorna chats onde o usuário participa)
    if (filtros.usuario_id) {
      query += ' AND (c.Id_Usuario1_FK = ? OR c.Id_Usuario2_FK = ?)';
      valores.push(filtros.usuario_id, filtros.usuario_id);
    }

    // Filtrar por status ativo
    if (filtros.ativo !== undefined) {
      query += ' AND c.Ativo = ?';
      valores.push(filtros.ativo);
    }

    query += ' ORDER BY Ultima_Mensagem_Data DESC, c.DataCriacao DESC';

    // Paginação
    if (filtros.limite) {
      query += ' LIMIT ?';
      valores.push(parseInt(filtros.limite));
      
      if (filtros.offset) {
        query += ' OFFSET ?';
        valores.push(parseInt(filtros.offset));
      }
    }

    const [rows] = await pool.query(query, valores);
    return rows;
  } catch (error) {
    console.error("ERRO NO SERVICE (listarChats):", error);
    throw new Error("Erro ao buscar chats no banco de dados.");
  }
}

async function atualizarChat(id, dadosParaAtualizar) {
  const { Ativo } = dadosParaAtualizar;

  const campos = [];
  const valores = [];

  if (Ativo !== undefined) {
    campos.push('Ativo = ?');
    valores.push(Ativo);
  }

  if (campos.length === 0) {
    throw new Error('Nenhum dado válido fornecido para atualização.');
  }

  valores.push(id);

  try {
    const query = `UPDATE Chat SET ${campos.join(', ')} WHERE Id_Chat = ?`;
    const [resultado] = await pool.query(query, valores);

    if (resultado.affectedRows === 0) {
      throw new Error('Chat não encontrado ou nenhum dado alterado.');
    }

    return { message: 'Chat atualizado com sucesso!', affectedRows: resultado.affectedRows };
  } catch (error) {
    console.error("ERRO NO SERVICE (atualizarChat):", error);
    throw new Error(error.message || "Erro ao atualizar chat no banco de dados.");
  }
}

async function desativarChat(id) {
  try {
    const [resultado] = await pool.query(
      'UPDATE Chat SET Ativo = false WHERE Id_Chat = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      throw new Error('Chat não encontrado.');
    }

    return { message: 'Chat desativado com sucesso!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (desativarChat):", error);
    throw new Error(error.message || "Erro ao desativar chat.");
  }
}

async function excluirChat(id) {
  try {
    // Excluir todas as mensagens do chat primeiro
    await pool.query('DELETE FROM Mensagem WHERE Id_Chat_FK = ?', [id]);

    // Excluir o chat
    const [resultado] = await pool.query('DELETE FROM Chat WHERE Id_Chat = ?', [id]);

    if (resultado.affectedRows === 0) {
      throw new Error('Chat não encontrado.');
    }

    return { message: 'Chat e todas as mensagens excluídos com sucesso!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (excluirChat):", error);
    throw new Error(error.message || "Erro ao excluir chat.");
  }
}

const chatService = {
  criarChat,
  buscarChatPorId,
  listarChats,
  atualizarChat,
  desativarChat,
  excluirChat
};

export default chatService;
