import pool from '../config/db.js';

// Função para capitalizar cada palavra
function capitalizeWords(str) {
  if (!str) return "";
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

async function cadastrarMaterial(dados) {
  let {
    Titulo,
    Descricao,
    TipoMaterial,
    EstadoConservacao,
    Categoria,
    Objetivo,
    Localizacao,
    IdUsuarioFK,
    Autor
  } = dados;

  Titulo = capitalizeWords(Titulo ?? "");
  TipoMaterial = capitalizeWords(TipoMaterial ?? "");
  EstadoConservacao = capitalizeWords(EstadoConservacao ?? "");
  if (Categoria) Categoria = capitalizeWords(Categoria);
  if (Autor) Autor = capitalizeWords(Autor); // <-- Capitaliza

  const Imagem = dados.Imagem ?? null;

  if (!Titulo || !TipoMaterial || !EstadoConservacao || !IdUsuarioFK) {
    throw new Error('Título, Tipo de Material, Estado de Conservação e Usuário são obrigatórios.');
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO Material (
        Titulo, Descricao, Tipo_Material, Estado_Conservacao, Categoria, Autor, 
        Imagem, DataCadastro, Objetivo, Localizacao, Disponibilidade, Id_Usuario_FK, DataAlteracao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // <-- 13 placeholders
      [
        Titulo,
        Descricao ?? null,
        TipoMaterial,
        EstadoConservacao,
        Categoria ?? null,
        Autor ?? null, // <-- Incluir Autor
        Imagem,
        new Date(),
        Objetivo ?? null,
        Localizacao ?? null,
        true,
        IdUsuarioFK,
        new Date() // DataAlteracao igual DataCadastro na criação
      ]
    );
    return { id: resultado.insertId };
  } catch (error) {
    console.error("ERRO NO SERVICE (cadastrarMaterial):", error);
    throw new Error("Erro ao inserir material no banco de dados.");
  }
}

async function buscarMaterialPorId(id) {
  // JOIN para pegar também o Nome e Foto do dono do material
  const query = `
    SELECT 
      m.*, 
      u.Nome_Completo AS Nome_Dono, 
      u.FotoPerfil AS Foto_Dono,
      u.Id_Usuario AS Id_Dono
    FROM Material m
    JOIN Usuario u ON m.Id_Usuario_FK = u.Id_Usuario
    WHERE m.Id_Material = ?
  `;

  const [rows] = await pool.query(query, [id]);
  return rows[0];
}

async function listarMateriais(filtros = {}) {
  try { // 1. O TRY COMEÇA AQUI
    let query = `
      SELECT 
        m.*,
        u.Nome_Completo as Nome_Usuario
      FROM Material m
      LEFT JOIN Usuario u ON m.Id_Usuario_FK = u.Id_Usuario
      WHERE 1=1
    `;
    const valores = [];

    if (filtros.disponibilidade !== undefined) {
      query += ' AND m.Disponibilidade = ?';
      valores.push(filtros.disponibilidade);
    }
    if (filtros.TipoMaterial) {
      query += ' AND m.Tipo_Material = ?';
      valores.push(filtros.TipoMaterial);
    }
    if (filtros.Categoria) {
      query += ' AND m.Categoria = ?';
      valores.push(filtros.Categoria);
    }
    if (filtros.EstadoConservacao) {
      query += ' AND m.Estado_Conservacao = ?';
      valores.push(filtros.EstadoConservacao);
    }
    if (filtros.usuarioid) {
      query += ' AND m.Id_Usuario_FK = ?';
      valores.push(filtros.usuarioid);
    }
    if (filtros.busca) {
      query += ' AND (m.Titulo LIKE ? OR m.Descricao LIKE ? OR m.Autor LIKE ?)';
      valores.push(`%${filtros.busca}%`, `%${filtros.busca}%`, `%${filtros.busca}%`);
    }

    query += ' ORDER BY m.DataCadastro DESC';

    if (filtros.limite) {
      query += ' LIMIT ?';
      valores.push(parseInt(filtros.limite));
      if (filtros.offset) {
        query += ' OFFSET ?';
        valores.push(parseInt(filtros.offset));
      }
    }

    // --- DEBUG LOGS (Opcional, só para testar) ---
    console.log("--- DEBUG BUSCA ---");
    console.log("SQL:", query);
    console.log("Valores:", valores);

    const [rows] = await pool.query(query, valores);
    return rows;

  } catch (error) { 
    console.error("ERRO NO SERVICE (listarMateriais):", error);
    throw new Error("Erro ao buscar materiais no banco de dados.");
  }
}

async function atualizarMaterial(id, dadosParaAtualizar) {
  let {
    Titulo,
    Descricao,
    TipoMaterial,
    EstadoConservacao,
    Categoria,
    Imagem,
    Objetivo,
    Localizacao,
    Disponibilidade,
    Autor
  } = dadosParaAtualizar;

  if (Titulo) Titulo = capitalizeWords(Titulo);
  if (TipoMaterial) TipoMaterial = capitalizeWords(TipoMaterial);
  if (EstadoConservacao) EstadoConservacao = capitalizeWords(EstadoConservacao);
  if (Categoria) Categoria = capitalizeWords(Categoria);
  if (Autor) Autor = capitalizeWords(Autor);

  const campos = [];
  const valores = [];

  // Se o valor não é undefined (foi enviado e não foi limpo no controller),
  // ele é adicionado para atualização (pode ser "" ou null se o usuário limpou o campo)
  if (Titulo !== undefined) { campos.push('Titulo = ?'); valores.push(Titulo); }
  if (Descricao !== undefined) { campos.push('Descricao = ?'); valores.push(Descricao); }
  if (TipoMaterial !== undefined) { campos.push('Tipo_Material = ?'); valores.push(TipoMaterial); }
  if (EstadoConservacao !== undefined) { campos.push('Estado_Conservacao = ?'); valores.push(EstadoConservacao); }
  if (Categoria !== undefined) { campos.push('Categoria = ?'); valores.push(Categoria); }
  if (Imagem !== undefined) { campos.push('Imagem = ?'); valores.push(Imagem); }
  if (Objetivo !== undefined) { campos.push('Objetivo = ?'); valores.push(Objetivo); }
  if (Localizacao !== undefined) { campos.push('Localizacao = ?'); valores.push(Localizacao); }
  if (Autor !== undefined) { campos.push('Autor = ?'); valores.push(Autor); }
  // Disponibilidade pode ser um booleano (já convertido no controller)
  if (Disponibilidade !== undefined) { campos.push('Disponibilidade = ?'); valores.push(Disponibilidade); }

  // Sempre atualiza DataAlteracao
  campos.push('DataAlteracao = ?');
  valores.push(new Date());

  if (campos.length === 0) {
    throw new Error('Nenhum dado válido fornecido para atualização.');
  }

  valores.push(id);

  try {
    const query = `UPDATE Material SET ${campos.join(', ')} WHERE Id_Material = ?`;
    const [resultado] = await pool.query(query, valores);
    if (resultado.affectedRows === 0) {
      throw new Error('Material não encontrado ou nenhum dado alterado.');
    }
    return { message: 'Material atualizado com sucesso!', affectedRows: resultado.affectedRows };
  } catch (error) {
    console.error("ERRO NO SERVICE (atualizarMaterial):", error);
    throw new Error(error.message || "Erro ao atualizar material no banco de dados.");
  }
}

async function excluirMaterial(id) {
  try {
    const [material] = await pool.query('SELECT Id_Material FROM Material WHERE Id_Material = ?', [id]);
    if (material.length === 0) throw new Error('Material não encontrado.');

    const [trocas] = await pool.query('SELECT COUNT(*) as count FROM Troca WHERE Id_Material_FK = ?', [id]);
    if (trocas[0].count > 0) {
      throw new Error(`Não é possível excluir material com trocas relacionadas. Total: ${trocas[0].count}`);
    }

    const [resultado] = await pool.query('DELETE FROM Material WHERE Id_Material = ?', [id]);
    if (resultado.affectedRows === 0) throw new Error('Erro ao excluir material.');
    return { message: 'Material excluído com sucesso!' };
  } catch (error) {
    console.error("ERRO NO SERVICE (excluirMaterial):", error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new Error('Não é possível excluir material com registros relacionados.');
    }
    throw new Error(error.message || "Erro ao excluir material do banco de dados.");
  }
}

async function alterarDisponibilidade(id, disponibilidade) {
  try {
    // Atualiza DataAlteracao também!
    const [resultado] = await pool.query(
      'UPDATE Material SET Disponibilidade = ?, DataAlteracao = ? WHERE Id_Material = ?',
      [disponibilidade, new Date(), id]
    );
    if (resultado.affectedRows === 0) throw new Error('Material não encontrado.');
    return {
      message: `Material ${disponibilidade ? 'disponibilizado' : 'indisponibilizado'} com sucesso!`
    };
  } catch (error) {
    console.error("ERRO NO SERVICE (alterarDisponibilidade):", error);
    throw new Error(error.message || "Erro ao alterar disponibilidade do material.");
  }
}

const materialService = {
  cadastrarMaterial,
  buscarMaterialPorId,
  listarMateriais,
  atualizarMaterial,
  excluirMaterial,
  alterarDisponibilidade
};

export default materialService;