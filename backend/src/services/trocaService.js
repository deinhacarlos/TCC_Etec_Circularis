import pool from '../config/db.js';

// --- CRIAR TROCA ---
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

  if (Id_Usuario_Solicitante_FK == Id_Usuario_Doador_FK) {
    throw new Error('O usuário não pode solicitar troca de seu próprio material.');
  }

  try {
    // 1. Verifica Material
    const [material] = await pool.query(
      'SELECT Id_Material, Disponibilidade, Id_Usuario_FK FROM Material WHERE Id_Material = ?',
      [Id_Material_FK]
    );

    if (material.length === 0) throw new Error('Material não encontrado.');
    if (!material[0].Disponibilidade) throw new Error('Material não está disponível para troca.');
    if (material[0].Id_Usuario_FK != Id_Usuario_Doador_FK) throw new Error('Doador inválido.');

    // 2. Verifica Duplicidade (Evita criar 2x)
    const [existente] = await pool.query(`
        SELECT Id_Troca FROM Troca 
        WHERE Id_Usuario_Solicitante_FK = ? 
        AND Id_Usuario_Doador_FK = ? 
        AND Id_Material_FK = ?
        AND Status NOT IN ('Cancelado', 'Rejeitado', 'Concluido')
    `, [Id_Usuario_Solicitante_FK, Id_Usuario_Doador_FK, Id_Material_FK]);

    if (existente.length > 0) {
        return { 
            id: existente[0].Id_Troca, 
            message: 'Já existe uma negociação ativa para este material.',
            existente: true 
        };
    }

    // 3. Insere a Troca
    const [resultado] = await pool.query(
      `INSERT INTO Troca (
        Id_Material_FK, Data_Solicitacao, Id_Usuario_Solicitante_FK, 
        Id_Usuario_Doador_FK, Observacoes, Status
      ) VALUES (?, ?, ?, ?, ?, 'Pendente')`,
      [Id_Material_FK, new Date(), Id_Usuario_Solicitante_FK, Id_Usuario_Doador_FK, Observacoes || 'Iniciado via Chat']
    );

    return { id: resultado.insertId, message: 'Troca solicitada com sucesso!', existente: false };
  } catch (error) {
    console.error("ERRO NO SERVICE (criarTroca):", error);
    throw new Error(error.message || "Erro ao criar troca.");
  }
}

// --- LISTAR TROCAS ---
async function listarTrocas(filtros = {}) {
  try {
    let query = `
      SELECT 
        t.*,
        m.Titulo as Titulo_Material,
        m.Imagem as Imagem_Material,
        us.Nome_Completo as Nome_Solicitante,
        ud.Nome_Completo as Nome_Doador
      FROM Troca t
      LEFT JOIN Material m ON t.Id_Material_FK = m.Id_Material
      LEFT JOIN Usuario us ON t.Id_Usuario_Solicitante_FK = us.Id_Usuario
      LEFT JOIN Usuario ud ON t.Id_Usuario_Doador_FK = ud.Id_Usuario
      WHERE 1=1
    `;
    const valores = [];

    if (filtros.usuario_solicitante_id) {
      query += ' AND t.Id_Usuario_Solicitante_FK = ?';
      valores.push(filtros.usuario_solicitante_id);
    }
    if (filtros.usuario_doador_id) {
      query += ' AND t.Id_Usuario_Doador_FK = ?';
      valores.push(filtros.usuario_doador_id);
    }

    query += ' ORDER BY t.Data_Solicitacao DESC';

    const [rows] = await pool.query(query, valores);
    return rows;
  } catch (error) {
    console.error("ERRO LISTAR:", error);
    throw new Error("Erro ao listar trocas.");
  }
}

// --- ATUALIZAR STATUS (CORAÇÃO DO SISTEMA) ---
async function atualizarStatusTroca(id, novoStatus, usuarioIdDoador) {
  // Status permitidos
  const permitidos = ['Aceito', 'Rejeitado', 'Cancelado', 'Concluido'];
  
  if (!permitidos.includes(novoStatus)) {
      throw new Error('Status inválido.');
  }

  try {
    // Busca a troca para saber qual é o Material relacionado
    const [troca] = await pool.query('SELECT Id_Usuario_Doador_FK, Id_Material_FK FROM Troca WHERE Id_Troca = ?', [id]);
    
    if (troca.length === 0) throw new Error('Troca não encontrada.');
    
    // Opcional: Validar se quem está mexendo é o dono (se o ID for passado)
    if (usuarioIdDoador && troca[0].Id_Usuario_Doador_FK != usuarioIdDoador) {
       // throw new Error('Apenas o dono pode alterar o status.'); // Descomente se quiser rigidez
    }

    // 1. Atualiza o status da Troca
    let updateQuery = 'UPDATE Troca SET Status = ?';
    const updateValues = [novoStatus];

    // Se concluiu, grava a data de conclusão
    if (novoStatus === 'Concluido') {
        updateQuery += ', Data_Conclusao = ?';
        updateValues.push(new Date());
    }
    
    updateQuery += ' WHERE Id_Troca = ?';
    updateValues.push(id);

    await pool.query(updateQuery, updateValues);

    // 2. LÓGICA DE ESTOQUE (DISPONIBILIDADE)
    // Se CONCLUIU, o livro sai da busca (Disponibilidade = 0)
    if (novoStatus === 'Concluido') {
        await pool.query(
            'UPDATE Material SET Disponibilidade = 0, DataAlteracao = NOW() WHERE Id_Material = ?', 
            [troca[0].Id_Material_FK]
        );
    }
    
    // Se CANCELOU ou REJEITOU, garante que o livro volta/continua na busca (Disponibilidade = 1)
    if (novoStatus === 'Rejeitado' || novoStatus === 'Cancelado') {
        await pool.query(
            'UPDATE Material SET Disponibilidade = 1, DataAlteracao = NOW() WHERE Id_Material = ?', 
            [troca[0].Id_Material_FK]
        );
    }

    return { message: `Status atualizado para ${novoStatus}` };

  } catch (error) {
    console.error("ERRO ATUALIZAR STATUS:", error);
    throw new Error(error.message || "Erro ao atualizar status.");
  }
}

async function buscarTrocaPorId(id) {
    const [rows] = await pool.query('SELECT * FROM Troca WHERE Id_Troca = ?', [id]);
    return rows[0];
}

// Mantendo compatibilidade com controllers antigos se houver
async function concluirTroca(id) { return atualizarStatusTroca(id, 'Concluido'); }
async function cancelarTroca(id) { return atualizarStatusTroca(id, 'Cancelado'); }
async function atualizarTroca(id, dados) { /* Implementação genérica se precisar */ }

const trocaService = {
  criarTroca,
  listarTrocas,
  atualizarStatusTroca,
  buscarTrocaPorId,
  concluirTroca,
  cancelarTroca,
  atualizarTroca
};

export default trocaService;