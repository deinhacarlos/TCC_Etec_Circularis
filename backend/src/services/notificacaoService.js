import pool from '../config/db.js';

async function criarNotificacao(dados) {
  const { 
    Titulo,
    Mensagem,
    Tipo_Notificacao,
    Id_Usuario_FK
  } = dados;

  if (!Titulo || !Mensagem || !Tipo_Notificacao || !Id_Usuario_FK) {
    throw new Error('Título, Mensagem, Tipo de Notificação e Usuário são obrigatórios.');
  }

  try {
    // Verificar se o usuário existe
    const [usuario] = await pool.query(
      'SELECT Id_Usuario FROM Usuario WHERE Id_Usuario = ?',
      [Id_Usuario_FK]
    );

    if (usuario.length === 0) {
      throw new Error('Usuário não encontrado.');
    }

    const [resultado] = await pool.query(
      `INSERT INTO Notificacao (
        Titulo, Mensagem, Tipo_Notificacao, DataEnvio, Lida, Id_Usuario_FK
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Titulo,
        Mensagem,
        Tipo_Notificacao,
        new Date(),
        false, // Lida padrão = false
        Id_Usuario_FK
      ]
    );

    return { id: resultado.insertId, message: 'Notificação criada com sucesso!' };
  } catch (error) {
    console.error("ERRO NO SERVICE (criarNotificacao):", error);
    throw new Error(error.message || "Erro ao criar notificação no banco de dados.");
  }
}

async function buscarNotificacaoPorId(id) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        n.*,
        u.Nome_Completo as Nome_Usuario,
        u.Email as Email_Usuario
      FROM Notificacao n
      LEFT JOIN Usuario u ON n.Id_Usuario_FK = u.Id_Usuario
      WHERE n.Id_Notificacao = ?
    `, [id]);
    
    const notificacao = rows[0];

    if (!notificacao) {
      throw new Error('Notificação não encontrada.');
    }
    return notificacao;
  } catch (error) {
    console.error("ERRO NO SERVICE (buscarNotificacaoPorId):", error);
    throw new Error(error.message || "Erro ao buscar notificação no banco de dados.");
  }
}

async function listarNotificacoes(filtros = {}) {
  try {
    let query = `
      SELECT 
        n.*,
        u.Nome_Completo as Nome_Usuario
      FROM Notificacao n
      LEFT JOIN Usuario u ON n.Id_Usuario_FK = u.Id_Usuario
      WHERE 1=1
    `;
    const valores = [];

    // Filtrar por usuário
    if (filtros.usuario_id) {
      query += ' AND n.Id_Usuario_FK = ?';
      valores.push(filtros.usuario_id);
    }

    // Filtrar por tipo de notificação
    if (filtros.tipo_notificacao) {
      query += ' AND n.Tipo_Notificacao = ?';
      valores.push(filtros.tipo_notificacao);
    }

    // Filtrar por status de leitura
    if (filtros.lida !== undefined) {
      query += ' AND n.Lida = ?';
      valores.push(filtros.lida);
    }

    query += ' ORDER BY n.DataEnvio DESC';

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
    console.error("ERRO NO SERVICE (listarNotificacoes):", error);
    throw new Error("Erro ao buscar notificações no banco de dados.");
  }
}

async function atualizarNotificacao(id, dadosParaAtualizar) {
  const { Titulo, Mensagem, Lida } = dadosParaAtualizar;

  const campos = [];
  const valores = [];

  if (Titulo !== undefined) {
    campos.push('Titulo = ?');
    valores.push(Titulo);
  }

  if (Mensagem !== undefined) {
    campos.push('Mensagem = ?');
    valores.push(Mensagem);
  }

  if (Lida !== undefined) {
    campos.push('Lida = ?');
    valores.push(Lida);
  }

  if (campos.length === 0) {
    throw new Error('Nenhum dado válido fornecido para atualização.');
  }

  valores.push(id);

  try {
    const query = `UPDATE Notificacao SET ${campos.join(', ')} WHERE Id_Notificacao = ?`;
    const [resultado] = await pool.query(query, valores);

    if (resultado.affectedRows === 0) {
      throw new Error('Notificação não encontrada ou nenhum dado alterado.');
    }

    return { message: 'Notificação atualizada com sucesso!', affectedRows: resultado.affectedRows };
  } catch (error) {
    console.error("ERRO NO SERVICE (atualizarNotificacao):", error);
    throw new Error(error.message || "Erro ao atualizar notificação no banco de dados.");
  }
}

async function marcarComoLida(id) {
  try {
    const [resultado] = await pool.query(
      'UPDATE Notificacao SET Lida = true WHERE Id_Notificacao = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      throw new Error('Notificação não encontrada.');
    }

    return { message: 'Notificação marcada como lida!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (marcarComoLida):", error);
    throw new Error(error.message || "Erro ao marcar notificação como lida.");
  }
}

async function marcarTodasComoLidas(usuarioId) {
  try {
    const [resultado] = await pool.query(
      'UPDATE Notificacao SET Lida = true WHERE Id_Usuario_FK = ? AND Lida = false',
      [usuarioId]
    );

    return { 
      message: 'Todas as notificações foram marcadas como lidas!',
      total: resultado.affectedRows
    };

  } catch (error) {
    console.error("ERRO NO SERVICE (marcarTodasComoLidas):", error);
    throw new Error("Erro ao marcar todas as notificações como lidas.");
  }
}

async function excluirNotificacao(id) {
  try {
    const [resultado] = await pool.query('DELETE FROM Notificacao WHERE Id_Notificacao = ?', [id]);

    if (resultado.affectedRows === 0) {
      throw new Error('Notificação não encontrada.');
    }

    return { message: 'Notificação excluída com sucesso!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (excluirNotificacao):", error);
    throw new Error(error.message || "Erro ao excluir notificação.");
  }
}

async function contarNaoLidas(usuarioId) {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as total FROM Notificacao WHERE Id_Usuario_FK = ? AND Lida = false',
      [usuarioId]
    );

    return { total: rows[0].total };

  } catch (error) {
    console.error("ERRO NO SERVICE (contarNaoLidas):", error);
    throw new Error("Erro ao contar notificações não lidas.");
  }
}

const notificacaoService = {
  criarNotificacao,
  buscarNotificacaoPorId,
  listarNotificacoes,
  atualizarNotificacao,
  marcarComoLida,
  marcarTodasComoLidas,
  excluirNotificacao,
  contarNaoLidas
};

export default notificacaoService;
