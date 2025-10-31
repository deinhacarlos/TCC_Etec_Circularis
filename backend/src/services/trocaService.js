import pool from '../config/db.js';

async function criarTroca(dados) {
  const { 
    Id_Material_FK,
    Id_Usuario_Solicitante_FK,
    Id_Usuario_Doador_FK,
    Observacoes
  } = dados;

  if (!Id_Material_FK || !Id_Usuario_Solicitante_FK || !Id_Usuario_Doador_FK) {
    throw new Error('Material, Usuário Solicitante e Usuário Doador são obrigatórios.');
  }

  // Verificar se o solicitante não é o próprio doador
  if (Id_Usuario_Solicitante_FK === Id_Usuario_Doador_FK) {
    throw new Error('O usuário não pode solicitar troca de seu próprio material.');
  }

  try {
    // Verificar se o material existe e está disponível
    const [material] = await pool.query(
      'SELECT Id_Material, Disponibilidade, Id_Usuario_FK FROM Material WHERE Id_Material = ?',
      [Id_Material_FK]
    );

    if (material.length === 0) {
      throw new Error('Material não encontrado.');
    }

    if (!material[0].Disponibilidade) {
      throw new Error('Material não está disponível para troca.');
    }

    if (material[0].Id_Usuario_FK !== Id_Usuario_Doador_FK) {
      throw new Error('O usuário doador não é o proprietário do material.');
    }

    const [resultado] = await pool.query(
      `INSERT INTO Troca (
        Id_Material_FK, Data_Solicitacao, Id_Usuario_Solicitante_FK, 
        Id_Usuario_Doador_FK, Observacoes
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        Id_Material_FK,
        new Date(),
        Id_Usuario_Solicitante_FK,
        Id_Usuario_Doador_FK,
        Observacoes || null
      ]
    );

    return { id: resultado.insertId, message: 'Troca solicitada com sucesso!' };
  } catch (error) {
    console.error("ERRO NO SERVICE (criarTroca):", error);
    throw new Error(error.message || "Erro ao criar troca no banco de dados.");
  }
}

async function buscarTrocaPorId(id) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.*,
        m.Titulo as Titulo_Material,
        m.Tipo_Material,
        m.Imagem as Imagem_Material,
        us.Nome_Completo as Nome_Solicitante,
        us.Email as Email_Solicitante,
        ud.Nome_Completo as Nome_Doador,
        ud.Email as Email_Doador
      FROM Troca t
      LEFT JOIN Material m ON t.Id_Material_FK = m.Id_Material
      LEFT JOIN Usuario us ON t.Id_Usuario_Solicitante_FK = us.Id_Usuario
      LEFT JOIN Usuario ud ON t.Id_Usuario_Doador_FK = ud.Id_Usuario
      WHERE t.Id_Troca = ?
    `, [id]);
    
    const troca = rows[0];

    if (!troca) {
      throw new Error('Troca não encontrada.');
    }
    return troca;
  } catch (error) {
    console.error("ERRO NO SERVICE (buscarTrocaPorId):", error);
    throw new Error(error.message || "Erro ao buscar troca no banco de dados.");
  }
}

async function listarTrocas(filtros = {}) {
  try {
    let query = `
      SELECT 
        t.*,
        m.Titulo as Titulo_Material,
        m.Tipo_Material,
        us.Nome_Completo as Nome_Solicitante,
        ud.Nome_Completo as Nome_Doador
      FROM Troca t
      LEFT JOIN Material m ON t.Id_Material_FK = m.Id_Material
      LEFT JOIN Usuario us ON t.Id_Usuario_Solicitante_FK = us.Id_Usuario
      LEFT JOIN Usuario ud ON t.Id_Usuario_Doador_FK = ud.Id_Usuario
      WHERE 1=1
    `;
    const valores = [];

    // Filtrar por usuário solicitante
    if (filtros.usuario_solicitante_id) {
      query += ' AND t.Id_Usuario_Solicitante_FK = ?';
      valores.push(filtros.usuario_solicitante_id);
    }

    // Filtrar por usuário doador
    if (filtros.usuario_doador_id) {
      query += ' AND t.Id_Usuario_Doador_FK = ?';
      valores.push(filtros.usuario_doador_id);
    }

    // Filtrar por material
    if (filtros.material_id) {
      query += ' AND t.Id_Material_FK = ?';
      valores.push(filtros.material_id);
    }

    // Filtrar por status (concluída ou não)
    if (filtros.concluida !== undefined) {
      if (filtros.concluida) {
        query += ' AND t.Data_Conclusao IS NOT NULL';
      } else {
        query += ' AND t.Data_Conclusao IS NULL';
      }
    }

    query += ' ORDER BY t.Data_Solicitacao DESC';

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
    console.error("ERRO NO SERVICE (listarTrocas):", error);
    throw new Error("Erro ao buscar trocas no banco de dados.");
  }
}

async function atualizarTroca(id, dadosParaAtualizar) {
  const { Observacoes } = dadosParaAtualizar;

  const campos = [];
  const valores = [];

  if (Observacoes !== undefined) {
    campos.push('Observacoes = ?');
    valores.push(Observacoes);
  }

  if (campos.length === 0) {
    throw new Error('Nenhum dado válido fornecido para atualização.');
  }

  valores.push(id);

  try {
    const query = `UPDATE Troca SET ${campos.join(', ')} WHERE Id_Troca = ?`;
    const [resultado] = await pool.query(query, valores);

    if (resultado.affectedRows === 0) {
      throw new Error('Troca não encontrada ou nenhum dado alterado.');
    }

    return { message: 'Troca atualizada com sucesso!', affectedRows: resultado.affectedRows };
  } catch (error) {
    console.error("ERRO NO SERVICE (atualizarTroca):", error);
    throw new Error(error.message || "Erro ao atualizar troca no banco de dados.");
  }
}

async function concluirTroca(id) {
  try {
    // Verificar se a troca existe e não foi concluída
    const [troca] = await pool.query(
      'SELECT Id_Troca, Data_Conclusao, Id_Material_FK FROM Troca WHERE Id_Troca = ?',
      [id]
    );

    if (troca.length === 0) {
      throw new Error('Troca não encontrada.');
    }

    if (troca[0].Data_Conclusao) {
      throw new Error('Esta troca já foi concluída.');
    }

    // Atualizar a troca como concluída
    await pool.query(
      'UPDATE Troca SET Data_Conclusao = ? WHERE Id_Troca = ?',
      [new Date(), id]
    );

    // Marcar o material como indisponível
    await pool.query(
      'UPDATE Material SET Disponibilidade = false WHERE Id_Material = ?',
      [troca[0].Id_Material_FK]
    );

    return { message: 'Troca concluída com sucesso!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (concluirTroca):", error);
    throw new Error(error.message || "Erro ao concluir troca.");
  }
}

async function cancelarTroca(id) {
  try {
    // Verificar se a troca existe
    const [troca] = await pool.query(
      'SELECT Id_Troca, Data_Conclusao FROM Troca WHERE Id_Troca = ?',
      [id]
    );

    if (troca.length === 0) {
      throw new Error('Troca não encontrada.');
    }

    if (troca[0].Data_Conclusao) {
      throw new Error('Não é possível cancelar uma troca já concluída.');
    }

    // Excluir a troca
    const [resultado] = await pool.query('DELETE FROM Troca WHERE Id_Troca = ?', [id]);

    if (resultado.affectedRows === 0) {
      throw new Error('Erro ao cancelar troca.');
    }

    return { message: 'Troca cancelada com sucesso!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (cancelarTroca):", error);
    throw new Error(error.message || "Erro ao cancelar troca.");
  }
}

const trocaService = {
  criarTroca,
  buscarTrocaPorId,
  listarTrocas,
  atualizarTroca,
  concluirTroca,
  cancelarTroca
};

export default trocaService;
