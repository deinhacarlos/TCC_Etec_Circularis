import pool from '../config/db.js'

// Função para capitalizar cada palavra
function capitalizeWords(str) {
  if (!str) return "";
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

async function cadastrarMaterial(dados) {
  // Capitalização e normalização dos dados essenciais
  let {
    Titulo,
    Descricao,
    TipoMaterial,
    EstadoConservacao,
    Categoria,
    Objetivo,
    Localizacao,
    IdUsuarioFK
  } = dados;

  // Padroniza visualmente
  Titulo = capitalizeWords(Titulo ?? "");
  TipoMaterial = capitalizeWords(TipoMaterial ?? "");
  EstadoConservacao = capitalizeWords(EstadoConservacao ?? "");
  if (Categoria) Categoria = capitalizeWords(Categoria);

  // Imagem deve ser tratada pelo controller usando req.file ou req.body.Imagem
  const Imagem = dados.Imagem ?? null;

  // Campos obrigatórios
  if (!Titulo || !TipoMaterial || !EstadoConservacao || !IdUsuarioFK) {
    throw new Error('Título, Tipo de Material, Estado de Conservação e Usuário são obrigatórios.');
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO Material (
        Titulo, Descricao, Tipo_Material, Estado_Conservacao, Categoria, 
        Imagem, DataCadastro, Objetivo, Localizacao, Disponibilidade, Id_Usuario_FK
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Titulo,
        Descricao ?? null,
        TipoMaterial,
        EstadoConservacao,
        Categoria ?? null,
        Imagem,
        new Date(),
        Objetivo ?? 'troca',
        Localizacao ?? null,
        true, // Disponibilidade padrão = true
        IdUsuarioFK
      ]
    );
    return { id: resultado.insertId };
  } catch (error) {
    console.error("ERRO NO SERVICE (cadastrarMaterial):", error);
    throw new Error("Erro ao inserir material no banco de dados.");
  }
}

async function buscarMaterialPorId(id) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        m.*,
        u.Nome_Completo as Nome_Usuario,
        u.Email as Email_Usuario,
        u.Telefone as Telefone_Usuario
      FROM Material m
      LEFT JOIN Usuario u ON m.Id_Usuario_FK = u.Id_Usuario
      WHERE m.Id_Material = ?
    `, [id]);

    const material = rows[0];
    if (!material) throw new Error('Material não encontrado.');
    return material;
  } catch (error) {
    console.error("ERRO NO SERVICE (buscarMaterialPorId):", error);
    throw new Error("Erro ao buscar material no banco de dados.");
  }
}

async function listarMateriais(filtros = {}) {
  try {
    let query = `
      SELECT 
        m.*,
        u.Nome_Completo as Nome_Usuario
      FROM Material m
      LEFT JOIN Usuario u ON m.Id_Usuario_FK = u.Id_Usuario
      WHERE 1=1
    `;
    const valores = [];

    // Filtros dinâmicos
    if (filtros.disponibilidade !== undefined) {
      query += ' AND m.Disponibilidade = ?';
      valores.push(filtros.disponibilidade);
    }
    if (filtros.tipo_material) {
      query += ' AND m.Tipo_Material = ?';
      valores.push(filtros.tipo_material);
    }
    if (filtros.categoria) {
      query += ' AND m.Categoria = ?';
      valores.push(filtros.categoria);
    }
    if (filtros.estado_conservacao) {
      query += ' AND m.Estado_Conservacao = ?';
      valores.push(filtros.estado_conservacao);
    }
    if (filtros.usuario_id) {
      query += ' AND m.Id_Usuario_FK = ?';
      valores.push(filtros.usuario_id);
    }
    if (filtros.busca) {
      query += ' AND (m.Titulo LIKE ? OR m.Descricao LIKE ?)';
      valores.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
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
    Disponibilidade
  } = dadosParaAtualizar;

  // Capitalize se necessário (para campos textuais editáveis)
  if (Titulo) Titulo = capitalizeWords(Titulo);
  if (TipoMaterial) TipoMaterial = capitalizeWords(TipoMaterial);
  if (EstadoConservacao) EstadoConservacao = capitalizeWords(EstadoConservacao);
  if (Categoria) Categoria = capitalizeWords(Categoria);

  const campos = [];
  const valores = [];

  if (Titulo) { campos.push('Titulo = ?'); valores.push(Titulo); }
  if (Descricao !== undefined) { campos.push('Descricao = ?'); valores.push(Descricao); }
  if (TipoMaterial) { campos.push('Tipo_Material = ?'); valores.push(TipoMaterial); }
  if (EstadoConservacao) { campos.push('Estado_Conservacao = ?'); valores.push(EstadoConservacao); }
  if (Categoria !== undefined) { campos.push('Categoria = ?'); valores.push(Categoria); }
  if (Imagem !== undefined) { campos.push('Imagem = ?'); valores.push(Imagem); }
  if (Objetivo) { campos.push('Objetivo = ?'); valores.push(Objetivo); }
  if (Localizacao !== undefined) { campos.push('Localizacao = ?'); valores.push(Localizacao); }
  if (Disponibilidade !== undefined) { campos.push('Disponibilidade = ?'); valores.push(Disponibilidade); }

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
    const [resultado] = await pool.query(
      'UPDATE Material SET Disponibilidade = ? WHERE Id_Material = ?',
      [disponibilidade, id]
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
