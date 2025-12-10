import pool from '../config/db.js';
import notificacaoService from './notificacaoService.js'; // Importação essencial para o alerta

async function criarDenuncia(dados) {
  const { 
    Descricao,
    Tipo_Denuncia,
    Id_Usuario_Denunciante_FK,
    Id_Usuario_Denunciado_FK,
    Id_Material_FK,
    Id_Troca_FK
  } = dados;

  // Validações básicas
  if (!Descricao || !Tipo_Denuncia || !Id_Usuario_Denunciante_FK) {
    throw new Error('Descrição, Tipo de Denúncia e Usuário Denunciante são obrigatórios.');
  }

  // Verificar se há pelo menos um alvo da denúncia
  if (!Id_Usuario_Denunciado_FK && !Id_Material_FK && !Id_Troca_FK) {
    throw new Error('É necessário informar pelo menos um alvo da denúncia (usuário, material ou troca).');
  }

  // Verificar se o denunciante não está denunciando a si mesmo
  if (Id_Usuario_Denunciado_FK && Id_Usuario_Denunciante_FK == Id_Usuario_Denunciado_FK) {
    throw new Error('Não é possível denunciar a si mesmo.');
  }

  try {
    // 1. Inserir a Denúncia no Banco (Histórico)
    // O Status vai como 'true' (1) porque o sistema notifica automaticamente, então conta como "resolvida/entregue"
    const [resultado] = await pool.query(
      `INSERT INTO Denuncia (
        Descricao, Tipo_Denuncia, Data_Denuncia, Status,
        Id_Usuario_Denunciante_FK, Id_Usuario_Denunciado_FK,
        Id_Material_FK, Id_Troca_FK
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Descricao,
        Tipo_Denuncia,
        new Date(),
        true, // Status TRUE: O alerta foi enviado automaticamente
        Id_Usuario_Denunciante_FK,
        Id_Usuario_Denunciado_FK || null,
        Id_Material_FK || null,
        Id_Troca_FK || null
      ]
    );

    // 2. Lógica de Notificação Automática (O "Admin" Automático)
    let usuarioParaNotificar = Id_Usuario_Denunciado_FK; // Se for denúncia direta de perfil
    let tituloItem = "seu perfil";
    let mensagemAlerta = "";

    // Se for denúncia de MATERIAL, precisamos descobrir quem é o dono
    if (Id_Material_FK) {
      const [materialRows] = await pool.query(
        'SELECT Id_Usuario_FK, Titulo FROM Material WHERE Id_Material = ?', 
        [Id_Material_FK]
      );
      
      if (materialRows.length > 0) {
        usuarioParaNotificar = materialRows[0].Id_Usuario_FK;
        tituloItem = `seu material "${materialRows[0].Titulo}"`;
      }
    }

    // Se identificamos quem notificar e não é o próprio denunciante
    if (usuarioParaNotificar && usuarioParaNotificar != Id_Usuario_Denunciante_FK) {
      
      // Personaliza a mensagem baseada na descrição
      mensagemAlerta = `A comunidade reportou um problema em ${tituloItem}. Motivo: "${Descricao}". Por favor, verifique se está de acordo com as regras.`;

      // Chama o serviço de notificação
      await notificacaoService.criarNotificacao({
        Titulo: "Alerta da Comunidade",
        Mensagem: mensagemAlerta,
        Tipo_Notificacao: "Alerta", // Pode ser usado para mostrar um ícone diferente no front
        Id_Usuario_FK: usuarioParaNotificar
      });
    }

    return { id: resultado.insertId, message: 'Denúncia registrada e proprietário notificado.' };
  } catch (error) {
    console.error("ERRO NO SERVICE (criarDenuncia):", error);
    throw new Error(error.message || "Erro ao criar denúncia no banco de dados.");
  }
}

async function buscarDenunciaPorId(id) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.*,
        ud.Nome_Completo as Nome_Denunciante,
        ud.Email as Email_Denunciante,
        ude.Nome_Completo as Nome_Denunciado,
        ude.Email as Email_Denunciado,
        m.Titulo as Titulo_Material,
        t.Id_Troca as Id_Troca_Relacionada
      FROM Denuncia d
      LEFT JOIN Usuario ud ON d.Id_Usuario_Denunciante_FK = ud.Id_Usuario
      LEFT JOIN Usuario ude ON d.Id_Usuario_Denunciado_FK = ude.Id_Usuario
      LEFT JOIN Material m ON d.Id_Material_FK = m.Id_Material
      LEFT JOIN Troca t ON d.Id_Troca_FK = t.Id_Troca
      WHERE d.Id_Denuncia = ?
    `, [id]);
    
    const denuncia = rows[0];

    if (!denuncia) {
      throw new Error('Denúncia não encontrada.');
    }
    return denuncia;
  } catch (error) {
    console.error("ERRO NO SERVICE (buscarDenunciaPorId):", error);
    throw new Error(error.message || "Erro ao buscar denúncia no banco de dados.");
  }
}

async function listarDenuncias(filtros = {}) {
  try {
    let query = `
      SELECT 
        d.*,
        ud.Nome_Completo as Nome_Denunciante,
        ude.Nome_Completo as Nome_Denunciado
      FROM Denuncia d
      LEFT JOIN Usuario ud ON d.Id_Usuario_Denunciante_FK = ud.Id_Usuario
      LEFT JOIN Usuario ude ON d.Id_Usuario_Denunciado_FK = ude.Id_Usuario
      WHERE 1=1
    `;
    const valores = [];

    if (filtros.tipo_denuncia) {
      query += ' AND d.Tipo_Denuncia = ?';
      valores.push(filtros.tipo_denuncia);
    }
    if (filtros.status !== undefined) {
      query += ' AND d.Status = ?';
      valores.push(filtros.status);
    }
    if (filtros.usuario_denunciante_id) {
      query += ' AND d.Id_Usuario_Denunciante_FK = ?';
      valores.push(filtros.usuario_denunciante_id);
    }
    if (filtros.usuario_denunciado_id) {
      query += ' AND d.Id_Usuario_Denunciado_FK = ?';
      valores.push(filtros.usuario_denunciado_id);
    }
    if (filtros.material_id) {
      query += ' AND d.Id_Material_FK = ?';
      valores.push(filtros.material_id);
    }
    if (filtros.troca_id) {
      query += ' AND d.Id_Troca_FK = ?';
      valores.push(filtros.troca_id);
    }

    query += ' ORDER BY d.Data_Denuncia DESC';

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
    console.error("ERRO NO SERVICE (listarDenuncias):", error);
    throw new Error("Erro ao buscar denúncias no banco de dados.");
  }
}

async function atualizarDenuncia(id, dadosParaAtualizar) {
  const { Descricao, Status } = dadosParaAtualizar;
  const campos = [];
  const valores = [];

  if (Descricao !== undefined) {
    campos.push('Descricao = ?');
    valores.push(Descricao);
  }
  if (Status !== undefined) {
    campos.push('Status = ?');
    valores.push(Status);
  }

  if (campos.length === 0) {
    throw new Error('Nenhum dado válido fornecido para atualização.');
  }

  valores.push(id);

  try {
    const query = `UPDATE Denuncia SET ${campos.join(', ')} WHERE Id_Denuncia = ?`;
    const [resultado] = await pool.query(query, valores);

    if (resultado.affectedRows === 0) {
      throw new Error('Denúncia não encontrada ou nenhum dado alterado.');
    }
    return { message: 'Denúncia atualizada com sucesso!', affectedRows: resultado.affectedRows };
  } catch (error) {
    console.error("ERRO NO SERVICE (atualizarDenuncia):", error);
    throw new Error(error.message || "Erro ao atualizar denúncia no banco de dados.");
  }
}

async function resolverDenuncia(id) {
  try {
    const [resultado] = await pool.query(
      'UPDATE Denuncia SET Status = true WHERE Id_Denuncia = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      throw new Error('Denúncia não encontrada.');
    }
    return { message: 'Denúncia marcada como resolvida!' };
  } catch (error) {
    console.error("ERRO NO SERVICE (resolverDenuncia):", error);
    throw new Error(error.message || "Erro ao resolver denúncia.");
  }
}

async function excluirDenuncia(id) {
  try {
    const [resultado] = await pool.query('DELETE FROM Denuncia WHERE Id_Denuncia = ?', [id]);

    if (resultado.affectedRows === 0) {
      throw new Error('Denúncia não encontrada.');
    }
    return { message: 'Denúncia excluída com sucesso!' };
  } catch (error) {
    console.error("ERRO NO SERVICE (excluirDenuncia):", error);
    throw new Error(error.message || "Erro ao excluir denúncia.");
  }
}

const denunciaService = {
  criarDenuncia,
  buscarDenunciaPorId,
  listarDenuncias,
  atualizarDenuncia,
  resolverDenuncia,
  excluirDenuncia
};

export default denunciaService;