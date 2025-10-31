import pool from '../config/db.js';

async function criarRecomendacao(dados) {
  const { 
    Motivo,
    Id_Usuario_FK,
    Id_Material_FK
  } = dados;

  if (!Id_Usuario_FK || !Id_Material_FK) {
    throw new Error('Usuário e Material são obrigatórios.');
  }

  try {
    // Verificar se o usuário e o material existem
    const [usuario] = await pool.query(
      'SELECT Id_Usuario FROM Usuario WHERE Id_Usuario = ?',
      [Id_Usuario_FK]
    );

    if (usuario.length === 0) {
      throw new Error('Usuário não encontrado.');
    }

    const [material] = await pool.query(
      'SELECT Id_Material FROM Material WHERE Id_Material = ?',
      [Id_Material_FK]
    );

    if (material.length === 0) {
      throw new Error('Material não encontrado.');
    }

    const [resultado] = await pool.query(
      `INSERT INTO Recomendacao (
        DataRecomendacao, Motivo, Id_Usuario_FK, Id_Material_FK
      ) VALUES (?, ?, ?, ?)`,
      [
        new Date(),
        Motivo || 'Recomendação baseada em preferências',
        Id_Usuario_FK,
        Id_Material_FK
      ]
    );

    return { id: resultado.insertId, message: 'Recomendação criada com sucesso!' };
  } catch (error) {
    console.error("ERRO NO SERVICE (criarRecomendacao):", error);
    throw new Error(error.message || "Erro ao criar recomendação no banco de dados.");
  }
}

async function buscarRecomendacaoPorId(id) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.*,
        u.Nome_Completo as Nome_Usuario,
        u.Email as Email_Usuario,
        m.Titulo as Titulo_Material,
        m.Tipo_Material,
        m.Categoria,
        m.Imagem as Imagem_Material,
        m.Disponibilidade
      FROM Recomendacao r
      LEFT JOIN Usuario u ON r.Id_Usuario_FK = u.Id_Usuario
      LEFT JOIN Material m ON r.Id_Material_FK = m.Id_Material
      WHERE r.Id_Recomendacao = ?
    `, [id]);
    
    const recomendacao = rows[0];

    if (!recomendacao) {
      throw new Error('Recomendação não encontrada.');
    }
    return recomendacao;
  } catch (error) {
    console.error("ERRO NO SERVICE (buscarRecomendacaoPorId):", error);
    throw new Error(error.message || "Erro ao buscar recomendação no banco de dados.");
  }
}

async function listarRecomendacoes(filtros = {}) {
  try {
    let query = `
      SELECT 
        r.*,
        u.Nome_Completo as Nome_Usuario,
        m.Titulo as Titulo_Material,
        m.Tipo_Material,
        m.Categoria,
        m.Imagem as Imagem_Material,
        m.Disponibilidade
      FROM Recomendacao r
      LEFT JOIN Usuario u ON r.Id_Usuario_FK = u.Id_Usuario
      LEFT JOIN Material m ON r.Id_Material_FK = m.Id_Material
      WHERE 1=1
    `;
    const valores = [];

    // Filtrar por usuário
    if (filtros.usuario_id) {
      query += ' AND r.Id_Usuario_FK = ?';
      valores.push(filtros.usuario_id);
    }

    // Filtrar por material
    if (filtros.material_id) {
      query += ' AND r.Id_Material_FK = ?';
      valores.push(filtros.material_id);
    }

    // Filtrar apenas materiais disponíveis
    if (filtros.apenas_disponiveis) {
      query += ' AND m.Disponibilidade = true';
    }

    query += ' ORDER BY r.DataRecomendacao DESC';

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
    console.error("ERRO NO SERVICE (listarRecomendacoes):", error);
    throw new Error("Erro ao buscar recomendações no banco de dados.");
  }
}

async function atualizarRecomendacao(id, dadosParaAtualizar) {
  const { Motivo } = dadosParaAtualizar;

  const campos = [];
  const valores = [];

  if (Motivo !== undefined) {
    campos.push('Motivo = ?');
    valores.push(Motivo);
  }

  if (campos.length === 0) {
    throw new Error('Nenhum dado válido fornecido para atualização.');
  }

  valores.push(id);

  try {
    const query = `UPDATE Recomendacao SET ${campos.join(', ')} WHERE Id_Recomendacao = ?`;
    const [resultado] = await pool.query(query, valores);

    if (resultado.affectedRows === 0) {
      throw new Error('Recomendação não encontrada ou nenhum dado alterado.');
    }

    return { message: 'Recomendação atualizada com sucesso!', affectedRows: resultado.affectedRows };
  } catch (error) {
    console.error("ERRO NO SERVICE (atualizarRecomendacao):", error);
    throw new Error(error.message || "Erro ao atualizar recomendação no banco de dados.");
  }
}

async function excluirRecomendacao(id) {
  try {
    const [resultado] = await pool.query('DELETE FROM Recomendacao WHERE Id_Recomendacao = ?', [id]);

    if (resultado.affectedRows === 0) {
      throw new Error('Recomendação não encontrada.');
    }

    return { message: 'Recomendação excluída com sucesso!' };

  } catch (error) {
    console.error("ERRO NO SERVICE (excluirRecomendacao):", error);
    throw new Error(error.message || "Erro ao excluir recomendação.");
  }
}

async function gerarRecomendacoesParaUsuario(usuarioId) {
  try {
    // Verificar se o usuário existe
    const [usuario] = await pool.query(
      'SELECT Id_Usuario FROM Usuario WHERE Id_Usuario = ?',
      [usuarioId]
    );

    if (usuario.length === 0) {
      throw new Error('Usuário não encontrado.');
    }

    // Buscar materiais que o usuário pode estar interessado
    // Baseado em: materiais disponíveis que não são do próprio usuário
    const [materiais] = await pool.query(`
      SELECT DISTINCT m.Id_Material, m.Tipo_Material, m.Categoria
      FROM Material m
      WHERE m.Disponibilidade = true 
      AND m.Id_Usuario_FK != ?
      AND NOT EXISTS (
        SELECT 1 FROM Recomendacao r 
        WHERE r.Id_Usuario_FK = ? AND r.Id_Material_FK = m.Id_Material
      )
      LIMIT 10
    `, [usuarioId, usuarioId]);

    // Criar recomendações para esses materiais
    const recomendacoesCriadas = [];
    for (const material of materiais) {
      const [resultado] = await pool.query(
        `INSERT INTO Recomendacao (
          DataRecomendacao, Motivo, Id_Usuario_FK, Id_Material_FK
        ) VALUES (?, ?, ?, ?)`,
        [
          new Date(),
          `Recomendado baseado em ${material.Tipo_Material} - ${material.Categoria}`,
          usuarioId,
          material.Id_Material
        ]
      );
      recomendacoesCriadas.push(resultado.insertId);
    }

    return { 
      message: `${recomendacoesCriadas.length} recomendações geradas com sucesso!`,
      total: recomendacoesCriadas.length,
      ids: recomendacoesCriadas
    };

  } catch (error) {
    console.error("ERRO NO SERVICE (gerarRecomendacoesParaUsuario):", error);
    throw new Error(error.message || "Erro ao gerar recomendações.");
  }
}

const recomendacaoService = {
  criarRecomendacao,
  buscarRecomendacaoPorId,
  listarRecomendacoes,
  atualizarRecomendacao,
  excluirRecomendacao,
  gerarRecomendacoesParaUsuario
};

export default recomendacaoService;
