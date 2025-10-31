import pool from '../config/db.js';

async function enviarMensagem(dados) {
  const { 
    Conteudo,
    Id_Chat_FK,
    Id_Usuario_Rementente_FK
  } = dados;

  if (!Conteudo || !Id_Chat_FK || !Id_Usuario_Rementente_FK) {
    throw new Error('Conteúdo, Chat e Usuário Remetente são obrigatórios.');
  }

  try {
    // Verificar se o chat existe e está ativo
    const [chat] = await pool.query(
      'SELECT Id_Chat, Ativo, Id_Usuario1_FK, Id_Usuario2_FK FROM Chat WHERE Id_Chat = ?',
      [Id_Chat_FK]
    );

    if (chat.length === 0) {
      throw new Error('Chat não encontrado.');
    }

    if (!chat[0].Ativo) {
      throw new Error('Chat está desativado.');
    }

    // Verificar se o usuário remetente participa do chat
    if (chat[0].Id_Usuario1_FK !== Id_Usuario_Rementente_FK && 
        chat[0].Id_Usuario2_FK !== Id_Usuario_Rementente_FK) {
      throw new Error('Usuário não participa deste chat.');
    }

    const [resultado] = await pool.query(
      `INSERT INTO Mensagem (
        Conteudo, DataEnvio, Lida, Id_Chat_FK, Id_Usuario_Rementente_FK
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        Conteudo,
        new Date(),
        false,
        Id_Chat_FK,
        Id_Usuario_Rementente_FK
      ]
    );

    return { id: resultado.insertId, message: 'Mensagem enviada com sucesso!' };
  } catch (error) {
    console.error("ERRO NO SERVICE (enviarMensagem):", error);
    throw new Error(error.message || "Erro ao enviar mensagem no banco de dados.");
  }
}

async function buscarMensagemPorId(id) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        m.*,
        u.Nome_Completo as Nome_Remetente,
        u.Email as Email_Remetente,
        u.FotoPerfil as Foto_Remetente
      FROM Mensagem m
      LEFT JOIN Usuario u ON m.Id_Usuario_Rementente_FK = u.Id_Usuario
      WHERE m.Id_Mensagem = ?
    `, [id]);
    
    const mensagem = rows[0];

    if (!mensagem) {
      throw new Error('Mensagem não encontrada.');
    }
    return mensagem;
  } catch (error) {
    console.error("ERRO NO SERVICE (buscarMensagemPorId):", error);
    throw new Error(error.message || "Erro ao buscar mensagem no banco de dados.");
  }
}

async function listarMensagens(filtros = {}) {
  try {
    let query = `
      SELECT 
        m.*,
        u.Nome_Completo as Nome_Remetente,
        u.FotoPerfil as Foto_Remetente
      FROM Mensagem m
      LEFT JOIN Usuario u ON m.Id_Usuario_Rementente_FK = u.Id_Usuario
      WHERE 1=1
    `;
    const valores = [];

    // Filtrar por chat (obrigatório para listar mensagens)
    if (filtros.chat_id) {
      query += ' AND m.Id_Chat_FK = ?';
      valores.push(filtros.chat_id);
    }

    // Filtrar por remetente
    if (filtros.usuario_remetente_id) {
      query += ' AND m.Id_Usuario_Rementente_FK = ?';
      valores.push(filtros.usuario_remetente_id);
    }

    // Filtrar por status de leitura
    if (filtros.lida !== undefined) {
      query += ' AND m.Lida = ?';
      valores.push(filtros.lida);
    }

    query += ' ORDER BY m.DataEnvio ASC';

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
    console.error("ERRO NO SERVICE (listarMensagens):", error);
    throw new Error("Erro ao buscar mensagens no banco de dados.");
  }
}

async function marcarComoLida(id) {
  try {
    const [resultado] = await pool.query(
      'UPDATE Mensagem SET Lida = true WHERE Id_Mensagem = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      throw new Error('Mensagem não encontrada.');
    }

    return { message: 'Mensagem marcada como lida!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (marcarComoLida):", error);
    throw new Error(error.message || "Erro ao marcar mensagem como lida.");
  }
}

async function marcarTodasComoLidas(chatId, usuarioId) {
  try {
    // Marcar como lidas todas as mensagens do chat que NÃO foram enviadas pelo usuário
    const [resultado] = await pool.query(
      `UPDATE Mensagem 
       SET Lida = true 
       WHERE Id_Chat_FK = ? 
       AND Id_Usuario_Rementente_FK != ? 
       AND Lida = false`,
      [chatId, usuarioId]
    );

    return { 
      message: 'Todas as mensagens foram marcadas como lidas!',
      total: resultado.affectedRows
    };

  } catch (error) {
    console.error("ERRO NO SERVICE (marcarTodasComoLidas):", error);
    throw new Error("Erro ao marcar todas as mensagens como lidas.");
  }
}

async function excluirMensagem(id) {
  try {
    const [resultado] = await pool.query('DELETE FROM Mensagem WHERE Id_Mensagem = ?', [id]);

    if (resultado.affectedRows === 0) {
      throw new Error('Mensagem não encontrada.');
    }

    return { message: 'Mensagem excluída com sucesso!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (excluirMensagem):", error);
    throw new Error(error.message || "Erro ao excluir mensagem.");
  }
}

async function contarNaoLidas(chatId, usuarioId) {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM Mensagem 
       WHERE Id_Chat_FK = ? 
       AND Id_Usuario_Rementente_FK != ? 
       AND Lida = false`,
      [chatId, usuarioId]
    );

    return { total: rows[0].total };

  } catch (error) {
    console.error("ERRO NO SERVICE (contarNaoLidas):", error);
    throw new Error("Erro ao contar mensagens não lidas.");
  }
}

const mensagemService = {
  enviarMensagem,
  buscarMensagemPorId,
  listarMensagens,
  marcarComoLida,
  marcarTodasComoLidas,
  excluirMensagem,
  contarNaoLidas
};

export default mensagemService;
